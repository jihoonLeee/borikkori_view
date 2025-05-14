import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Button, FormControl, IconButton, Typography, CircularProgress } from '@mui/joy';
import { Editor, RichUtils, EditorState, AtomicBlockUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../../styles/BoardWrite.css';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam';

/**
 * 게시글 작성 폼 컴포넌트
 * 
 * 미디어 업로드 시 주의사항:
 * 1. 현재 구현은 임시 blob URL을 생성하여 사용하므로 페이지를 벗어나면 미디어가 사라집니다.
 * 2. 실제 서버 업로드 기능을 구현하려면 상위 컴포넌트에서 다음과 같이 handleImageUpload를 구현해야 합니다:
 * 
 * // BoardWriteContainer.jsx에서 구현 예시
 * const handleImageUpload = async (file) => {
 *   if (!file) return null;
 *   
 *   try {
 *     const formData = new FormData();
 *     formData.append('file', file);
 *     
 *     const response = await axios.post('/api/upload', formData, {
 *       headers: {
 *         'Content-Type': 'multipart/form-data'
 *       }
 *     });
 *     
 *     // 서버에서 반환된 실제 URL 사용
 *     return response.data.url;
 *   } catch (error) {
 *     console.error('업로드 실패:', error);
 *     return null;
 *   }
 * };
 */

// HTML 변환 유틸리티 함수 최종 개선
const convertContentToHTML = (contentState) => {
  if (!contentState) return '';
  
  let html = '';
  const blocks = contentState.getBlocksAsArray();
  
  // 디버깅: 전체 블록 내용 검사
  console.log(`총 ${blocks.length}개 블록 변환 시작`);
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const text = block.getText();
    const type = block.getType();
    
    // 블록 타입에 따른 HTML 래핑
    if (type === 'atomic') {
      // 이미지나 비디오 블록 처리
      const entityKey = block.getEntityAt(0);
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        const { src, type: mediaType } = entity.getData();
        
        // 미디어 타입 및 URL 확인 (디버깅용)
        console.log(`[${i}] 미디어 블록:`, mediaType, src ? src.substring(0, 30) + '...' : 'URL 없음');
        
        // 유효한 URL 확인
        if (!src) {
          console.warn(`[${i}] 유효하지 않은 미디어 URL`);
          continue;
        }
        
        if (mediaType === 'video' || entity.getType() === 'VIDEO') {
          // 비디오를 직접 내보내기 - 크기 제한 추가
          console.log(`[${i}] 비디오 태그 생성`);
          html += `<div class="video-container" style="max-width:640px; margin:0 auto;">
            <video controls src="${src}" width="100%" style="max-height:360px; display:block;"></video>
          </div>`;
        } else if (mediaType === 'image' || entity.getType() === 'IMAGE') {
          // 이미지는 div로 감싸기 (figure 대신 div 사용)
          html += `<div class="image-container" style="max-width:800px; margin:0 auto;">
            <img src="${src}" alt="업로드된 이미지" style="max-width:100%; display:block; margin:0 auto;"/>
          </div>`;
        }
      } else {
        console.warn(`[${i}] 엔티티 키가 없는 atomic 블록`);
      }
    } else if (text.length === 0) {
      // 빈 블록인 경우, 이전과 다음 블록이 atomic인지 확인
      const isPrevAtomic = i > 0 && blocks[i-1].getType() === 'atomic';
      const isNextAtomic = i < blocks.length - 1 && blocks[i+1].getType() === 'atomic';
      
      // atomic 블록 사이의 빈 줄은 무시하고, 그 외의 경우만 추가
      if (!(isPrevAtomic && isNextAtomic)) {
        html += '<p><br></p>';
      }
    } else {
      // 일반 텍스트 블록은 p 태그로 래핑
      html += `<p>${text}</p>`;
    }
  }
  
  // 모든 빈 태그 제거 (더 강력한 정규식 사용)
  html = html.replace(/<figure[^>]*>(&nbsp;|\s)*<\/figure>/g, '');
  html = html.replace(/<figure><\/figure>/g, '');
  
  // div 태그 내부가 비어있을 경우 제거
  html = html.replace(/<div[^>]*>(&nbsp;|\s)*<\/div>/g, '');
  
  // 최종 HTML 길이 확인 (디버깅용)
  console.log(`HTML 변환 완료. 길이: ${html.length}, 비디오 태그 포함: ${html.includes('<video')}`);
  
  return html;
};

const customStyleFn = (styleSet) => {
  const styles = {};

  styleSet.forEach((style) => {
    if (style.startsWith('COLOR_')) {
      const color = style.replace('COLOR_', '');
      styles.color = `#${color}`;
    }
    if (style === 'BOLD') styles.fontWeight = 'bold';
    if (style === 'ITALIC') styles.fontStyle = 'italic';
    if (style === 'UNDERLINE') styles.textDecoration = 'underline';
  });

  return styles;
};

const mediaBlockRenderer = (block) => {
  if (block.getType() === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
    };
  }
  return null;
};

const MediaComponent = (props) => {
  const { block, contentState, blockProps } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, type } = entity.getData();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 src 유효성 확인
    console.log(`미디어 컴포넌트 마운트: ${type}`, src);
    if (!src) {
      console.error('유효하지 않은 미디어 소스');
      setHasError(true);
    }
  }, [src, type]);

  const handleLoad = () => {
    console.log(`${type} 로드 완료:`, src);
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = (e) => {
    console.error(`${type} 로드 실패:`, e);
    setHasError(true);
  };

  const handleRemove = () => {
    console.log(`${type} 삭제 시작`);
    if (blockProps && typeof blockProps.onRemove === 'function') {
      blockProps.onRemove(block.getKey());
    }
  };

  return (
    <div className="media-wrapper" style={{ position: 'relative', margin: '10px 0' }}>
      {!isLoaded && !hasError && (
        <div className="media-loading" style={{ padding: '30px', textAlign: 'center', background: '#f5f5f5' }}>
          미디어 로딩 중...
        </div>
      )}
      
      {hasError && (
        <div className="media-error" style={{ padding: '30px', textAlign: 'center', background: '#fff0f0', color: 'red' }}>
          미디어를 로드할 수 없습니다
        </div>
      )}
      
      {type === 'image' && (
        <img
          src={src}
          alt="업로드된 이미지"
          style={{
            width: '100%',
            maxWidth: '800px',
            maxHeight: '500px',
            objectFit: 'contain',
            display: isLoaded ? 'block' : 'none',
            margin: '0 auto'
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {type === 'video' && (
        <video
          controls
          src={src}
          style={{
            width: '100%',
            maxWidth: '640px',
            maxHeight: '360px',
            display: isLoaded ? 'block' : 'none',
            margin: '0 auto'
          }}
          onLoadedData={handleLoad}
          onError={handleError}
        />
      )}
      
      <button
        className="media-delete-btn"
        onClick={handleRemove}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        ✕
      </button>
    </div>
  );
};

const BoardWriteForm = ({
  title,
  setTitle,
  editorState,
  setEditorState,
  onEditorChange,
  getRootProps,
  getInputProps,
  handleSubmit,
  handleTempSave,
  handleImageUpload,
  setHtmlContent,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isUploading, setIsUploading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [titleError, setTitleError] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const toggleFormatting = (format) => {
    if (format === 'COLOR') {
      const colorStyle = `COLOR_${selectedColor.replace('#', '')}`;
      const newEditorState = RichUtils.toggleInlineStyle(editorState, colorStyle);
      if (typeof onEditorChange === 'function') {
        onEditorChange(newEditorState);
      } else if (typeof setEditorState === 'function') {
        setEditorState(newEditorState);
      }
    } else {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, format);
      if (typeof onEditorChange === 'function') {
        onEditorChange(newEditorState);
      } else if (typeof setEditorState === 'function') {
        setEditorState(newEditorState);
      }
    }
  };

  const handleRemoveMedia = (blockKey) => {
    if (!blockKey) {
      console.error('삭제할 블록 키가 제공되지 않았습니다');
      return;
    }

    console.log('미디어 삭제 시작:', blockKey);
    
    try {
      // 현재 콘텐츠 상태 가져오기
      const contentState = editorState.getCurrentContent();
      
      // 콘텐츠의 블록맵 가져오기
      const blockMap = contentState.getBlockMap();
      
      // 해당 키의 블록이 있는지 확인
      if (!blockMap.has(blockKey)) {
        console.error('삭제하려는 블록을 찾을 수 없습니다:', blockKey);
        return;
      }
      
      // 블록을 필터링하여 해당 키의 블록만 제거
      const newBlockMap = blockMap.filter((_, key) => key !== blockKey);
      
      // 새로운 콘텐츠 상태 생성
      const newContentState = contentState.merge({
        blockMap: newBlockMap
      });
      
      // 새로운 에디터 상태 생성
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'remove-range'
      );
      
      // 에디터 상태 업데이트 (setEditorState 또는 onEditorChange 사용)
      if (typeof onEditorChange === 'function') {
        onEditorChange(newEditorState);
      } else if (typeof setEditorState === 'function') {
        setEditorState(newEditorState);
      } else {
        console.error('에디터 상태를 업데이트할 수 있는 함수가 제공되지 않았습니다.');
        return;
      }
      
      // HTML 콘텐츠 업데이트
      if (setHtmlContent) {
        const html = convertContentToHTML(newContentState);
        console.log('미디어 삭제 후 HTML 업데이트:', html.length);
        setHtmlContent(html);
      }
      
      console.log('미디어 삭제 완료:', blockKey);
    } catch (error) {
      console.error('미디어 삭제 중 오류 발생:', error);
    }
  };

  const saveEditorContent = useCallback(() => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      localStorage.setItem('draftEditorContent', JSON.stringify(rawContent));
      console.log('에디터 내용 저장 완료');
    } catch (error) {
      console.error('에디터 내용 저장 실패:', error);
    }
  }, [editorState]);

  const handleEditorChange = (newEditorState) => {
    // 기본 상태 업데이트
    if (typeof onEditorChange === 'function') {
      onEditorChange(newEditorState);
    } else if (typeof setEditorState === 'function') {
      setEditorState(newEditorState);
    } else {
      console.error('에디터 상태를 업데이트할 수 있는 함수가 제공되지 않았습니다.');
      return;
    }
    
    // 내용이 비어있는지 확인
    const contentState = newEditorState.getCurrentContent();
    if (!contentState.hasText() && contentState.getBlockMap().size <= 1) {
      // 내용이 비어있는 경우, 빈 HTML 반환
      if (typeof setHtmlContent === 'function') {
        setHtmlContent('');
      }
      setPreviewHtml('');
      return;
    }
    
    // HTML로 변환
    const html = convertContentToHTML(contentState);
    
    // 부모 컴포넌트로 HTML 전달
    if (typeof setHtmlContent === 'function') {
      setHtmlContent(html);
    }
    
    // 미리보기 업데이트
    setPreviewHtml(html);
    
    // 디버깅 - HTML 내용 확인
    if (html.includes('<figure>&nbsp;</figure>')) {
      console.warn('빈 figure 태그가 포함되어 있습니다:', html);
    }
  };

  const insertMedia = (url, mediaType) => {
    // 디버깅: 미디어 삽입 시작
    console.log(`미디어 삽입 시작: ${mediaType}`, url ? url.substring(0, 30) + '...' : 'URL 없음');
    
    // URL 유효성 검사
    if (!url || (typeof url !== 'string') || url.trim() === '') {
      console.error('유효하지 않은 미디어 URL:', url);
      alert('미디어 업로드에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // Blob URL 감지 및 로깅
    if (url.startsWith('blob:')) {
      console.warn('Blob URL이 감지되었습니다. 서버 업로드가 필요합니다:', url);
    }

    // ContentState에 엔티티 생성
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      mediaType === 'image' ? 'IMAGE' : 'VIDEO',
      'IMMUTABLE',
      { src: url, type: mediaType }
    );
    
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    
    // 엔티티 키 로깅
    console.log(`생성된 엔티티 키: ${entityKey}`, mediaType);
    
    // AtomicBlock 생성 및 삽입
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      EditorState.set(editorState, { currentContent: contentStateWithEntity }),
      entityKey,
      ' '
    );
    
    // 에디터 상태 업데이트 (setEditorState 또는 onEditorChange 사용)
    if (typeof onEditorChange === 'function') {
      onEditorChange(newEditorState);
    } else if (typeof setEditorState === 'function') {
      setEditorState(newEditorState);
    } else {
      console.error('에디터 상태를 업데이트할 수 있는 함수가 제공되지 않았습니다.');
      return;
    }
    
    // HTML 콘텐츠 업데이트
    if (setHtmlContent) {
      const newContentState = newEditorState.getCurrentContent();
      const html = convertContentToHTML(newContentState);
      console.log(`미디어 삽입 후 HTML 업데이트: 길이=${html.length}`);
      setHtmlContent(html);
    }
  };

  const handleLocalImageUpload = async (file) => {
    if (!file) return;
    
    console.log('이미지 업로드 시작:', file.name, file.type);
    setIsUploading(true);
    
    try {
      // 임시 URL 생성 (실제 업로드 전 미리보기용)
      const objectUrl = URL.createObjectURL(file);
      
      // 서버에 실제 파일 업로드
      const formData = new FormData();
      formData.append('file', file);
      
      // 외부에서 제공된 handleImageUpload가 있으면 사용
      let serverUrl;
      if (typeof handleImageUpload === 'function') {
        serverUrl = await handleImageUpload(file);
        console.log('외부 이미지 업로드 핸들러로 업로드 완료:', serverUrl);
      } else {
        // 직접 API 호출
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        
        const data = await response.json();
        serverUrl = data.url || data.fileUrl;
        console.log('서버에 이미지 업로드 완료:', serverUrl);
      }
      
      // 서버 URL이 반환되지 않았을 경우 오류
      if (!serverUrl) {
        console.error('서버에서 URL을 반환하지 않았습니다');
        alert('이미지 업로드에 실패했습니다: 서버 응답 오류');
        
        // 임시로 Blob URL 사용 (개발 테스트용)
        console.warn('임시 URL을 사용합니다 (개발 테스트용):', objectUrl);
        insertMedia(objectUrl, 'image');
      } else {
        // 서버에서 받은 URL로 미디어 삽입
        insertMedia(serverUrl, 'image');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    
    console.log('비디오 업로드 시작:', file.name, file.type);
    
    if (!file.type.startsWith('video/')) {
      console.error('유효하지 않은 비디오 파일:', file.type);
      alert('유효한 비디오 파일이 아닙니다.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 임시 URL 생성 (실제 업로드 전 미리보기용)
      const objectUrl = URL.createObjectURL(file);
      
      // 서버에 실제 파일 업로드
      const formData = new FormData();
      formData.append('file', file);
      
      // 외부에서 제공된 handleImageUpload가 있으면 사용 (비디오에도 적용 가능)
      let serverUrl;
      if (typeof handleImageUpload === 'function') {
        serverUrl = await handleImageUpload(file);
        console.log('외부 업로드 핸들러로 비디오 업로드 완료:', serverUrl);
      } else {
        // 직접 API 호출
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`서버 응답 오류: ${response.status}`);
        }
        
        const data = await response.json();
        serverUrl = data.url || data.fileUrl;
        console.log('서버에 비디오 업로드 완료:', serverUrl);
      }
      
      // 서버 URL이 반환되지 않았을 경우 오류
      if (!serverUrl) {
        console.error('서버에서 URL을 반환하지 않았습니다');
        alert('비디오 업로드에 실패했습니다: 서버 응답 오류');
        
        // 임시로 Blob URL 사용 (개발 테스트용)
        console.warn('임시 URL을 사용합니다 (개발 테스트용):', objectUrl);
        insertMedia(objectUrl, 'video');
      } else {
        // 서버에서 받은 URL로 미디어 삽입
        insertMedia(serverUrl, 'video');
      }
    } catch (error) {
      console.error('비디오 업로드 실패:', error);
      alert('비디오 업로드에 실패했습니다: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e, mediaType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (mediaType === 'video') {
      handleVideoUpload(file);
    } else {
      handleLocalImageUpload(file);
    }
    
    e.target.value = '';
  };

  const handleDroppedFiles = (selection, files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleLocalImageUpload(file);
      } else if (file.type.startsWith('video/')) {
        handleVideoUpload(file);
      }
    }
    return 'handled';
  };

  const handlePastedFiles = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleLocalImageUpload(file);
      }
    }
    return 'handled';
  };

  const blockRendererFunction = useCallback((block) => {
    if (block.getType() === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          onRemove: handleRemoveMedia
        }
      };
    }
    return null;
  }, [handleRemoveMedia]);

  const handleTempSaveWrapper = () => {
    if (!title || title.trim() === '') {
      setTitleError(true);
      alert('제목을 입력해주세요.');
      return;
    }
    
    setTitleError(false);
    saveEditorContent();
    if (handleTempSave) handleTempSave();
  };

  const inputProps = getInputProps();

  const handleSubmitWithHtml = () => {
    // 제목 검증
    if (!title || title.trim() === '') {
      setTitleError(true);
      alert('제목을 입력해주세요.');
      return;
    }
    
    // 콘텐츠 비어있는지 확인
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText() && contentState.getBlockMap().size <= 1) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    setTitleError(false);
    
    // 현재 콘텐츠의 미디어 URL 상태 확인
    const blocks = contentState.getBlocksAsArray();
    let hasBlobUrl = false;
    let hasContent = false;
    let hasVideoContent = false;
    
    for (const block of blocks) {
      if (block.getType() === 'atomic') {
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
          const entity = contentState.getEntity(entityKey);
          const entityData = entity.getData();
          const { src, type: mediaType } = entityData;
          
          if (src) {
            hasContent = true;
            if (mediaType === 'video') {
              hasVideoContent = true;
              console.log('비디오 콘텐츠 확인:', src);
            }
            if (src.startsWith('blob:')) {
              hasBlobUrl = true;
              console.warn('blob URL이 포함된 콘텐츠가 발견되었습니다:', src);
            }
          }
        }
      } else if (block.getText().trim().length > 0) {
        hasContent = true;
      }
    }
    
    if (!hasContent) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    if (hasBlobUrl) {
      // 경고 메시지 개선
      const warningMessage = '일부 미디어 파일이 서버에 저장되지 않았습니다. 게시물 저장 후 미디어가 보이지 않을 수 있습니다. 계속하시겠습니까?';
      if (!window.confirm(warningMessage)) {
        return;
      }
      console.warn('사용자가 Blob URL을 포함한 콘텐츠로 계속 진행하기로 선택했습니다.');
    }
    
    // HTML 변환
    const html = convertContentToHTML(contentState);
    
    // 비디오가 정상적으로 변환되었는지 확인
    if (hasVideoContent && !html.includes('<video')) {
      console.error('비디오 콘텐츠가 있지만 HTML에 <video> 태그가 없습니다');
      console.log('현재 HTML:', html);
    }
    
    // 부모 컴포넌트로 HTML 전달
    if (typeof setHtmlContent === 'function') {
      setHtmlContent(html);
    }
    
    // 기존 제출 핸들러 호출
    if (typeof handleSubmit === 'function') {
      handleSubmit();
    }
  };

  // 미리보기 렌더링을 위한 커스텀 함수
  const generatePreviewHtml = (contentState) => {
    if (!contentState) return '';
    
    let html = '';
    const blocks = contentState.getBlocksAsArray();
    
    for (const block of blocks) {
      if (block.getType() === 'atomic') {
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
          const entity = contentState.getEntity(entityKey);
          const { src, type: mediaType } = entity.getData();
          
          if (mediaType === 'video') {
            html += `<div class="preview-video"><video controls src="${src}" style="max-width:100%;"></video></div>`;
          } else if (mediaType === 'image') {
            html += `<div class="preview-image"><img src="${src}" alt="미리보기 이미지" style="max-width:100%;"/></div>`;
          }
        }
      } else {
        const text = block.getText();
        if (text.length === 0) {
          html += '<p><br/></p>';
        } else {
          html += `<p>${text}</p>`;
        }
      }
    }
    
    return html;
  };

  return (
    <main className="boardwrite-container flex flex-col items-center px-4 md:px-6 dark:bg-stone-900 min-h-screen">
      <section className="boardwrite-section w-full max-w-4xl mt-8 bg-white dark:bg-stone-800 rounded-lg shadow-md overflow-hidden p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <h2 className="boardwrite-title text-2xl font-semibold text-stone-800 dark:text-stone-100">
          정보 공유 게시판 글 쓰기
        </h2>
          <Box display="flex" gap={2}>
            <Button 
              startDecorator={<SaveIcon sx={{ fontSize: '1.2rem', color: '#8B5E3C' }} />} 
              onClick={handleTempSaveWrapper} 
              disabled={isUploading}
              variant="soft"
              sx={{
                bgcolor: 'rgba(139, 94, 60, 0.1)',
                color: '#8B5E3C',
                '&:hover': { 
                  bgcolor: 'rgba(139, 94, 60, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease',
                fontWeight: '600',
                borderRadius: '8px',
                px: 2,
                py: 1,
                fontSize: '0.9rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              임시저장
            </Button>
            <Button
              startDecorator={<PreviewIcon sx={{ fontSize: '1.2rem', color: '#8B5E3C' }} />}
              onClick={() => setShowPreview(!showPreview)}
              disabled={isUploading}
              variant="soft"
              sx={{
                bgcolor: 'rgba(139, 94, 60, 0.1)',
                color: '#8B5E3C',
                '&:hover': { 
                  bgcolor: 'rgba(139, 94, 60, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease',
                fontWeight: '600',
                borderRadius: '8px',
                px: 2,
                py: 1,
                fontSize: '0.9rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {showPreview ? '수정하기' : '미리보기'}
            </Button>
          </Box>
        </Box>

        <FormControl error={titleError} sx={{ mb: 2 }}>
          <input
            name="title"
            placeholder="제목을 입력해주세요."
            className={`boardwrite-title-input p-2 border rounded w-full ${titleError ? 'border-red-500' : 'border-stone-300'}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim() !== '') {
                setTitleError(false);
              }
            }}
            style={{ 
              height: '40px',
              fontSize: '1rem',
              outline: 'none',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
            required
          />
          {titleError && (
            <Typography level="body2" color="danger" fontSize="sm">
              제목을 입력해주세요.
            </Typography>
          )}
        </FormControl>

        <FormControl sx={{ flexGrow: 1 }}>
          {!showPreview ? (
            <>
              <Box 
                className="editor-toolbar" 
                display="flex" 
                flexWrap="wrap" 
                gap={1} 
                mb={1}
                p={1.5}
                sx={{
                  bgcolor: 'rgba(139, 94, 60, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(139, 94, 60, 0.15)',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start'
                }}
              >
                <IconButton 
                  onClick={() => toggleFormatting('BOLD')} 
                  color="neutral"
                  size="sm"
                  sx={{ 
                    color: '#8B5E3C',
                    '&:hover': { 
                      bgcolor: 'rgba(139, 94, 60, 0.1)',
                      transform: 'scale(1.1)' 
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FormatBoldIcon />
                </IconButton>
                <IconButton 
                  onClick={() => toggleFormatting('ITALIC')} 
                  color="neutral"
                  size="sm" 
                  sx={{ 
                    color: '#8B5E3C',
                    '&:hover': { 
                      bgcolor: 'rgba(139, 94, 60, 0.1)',
                      transform: 'scale(1.1)' 
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FormatItalicIcon />
                </IconButton>
                <IconButton 
                  onClick={() => toggleFormatting('UNDERLINE')} 
                  color="neutral"
                  size="sm"
                  sx={{ 
                    color: '#8B5E3C',
                    '&:hover': { 
                      bgcolor: 'rgba(139, 94, 60, 0.1)',
                      transform: 'scale(1.1)' 
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FormatUnderlinedIcon />
                </IconButton>
                <Box position="relative">
                  <IconButton 
                    onClick={() => setShowFormatting(!showFormatting)} 
                    color="neutral"
                    size="sm"
                    sx={{ 
                      color: '#8B5E3C',
                      '&:hover': { 
                        bgcolor: 'rgba(139, 94, 60, 0.1)',
                        transform: 'scale(1.1)' 
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FormatColorTextIcon />
                  </IconButton>
                  {showFormatting && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      bgcolor="white"
                      border="1px solid rgba(139, 94, 60, 0.3)"
                      borderRadius={2}
                      p={1}
                      zIndex={10}
                      boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                    >
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          toggleFormatting('COLOR');
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, ml: 2, borderLeft: '1px solid rgba(139, 94, 60, 0.2)', pl: 2 }}>
                  <IconButton 
                    onClick={() => fileInputRef.current?.click()} 
                    color="neutral"
                    size="sm"
                    sx={{ 
                      color: '#8B5E3C',
                      '&:hover': { 
                        bgcolor: 'rgba(139, 94, 60, 0.1)',
                        transform: 'scale(1.1)' 
                      },
                      transition: 'all 0.2s ease'
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? <CircularProgress size="sm" /> : <ImageIcon />}
                  </IconButton>
                  <IconButton 
                    onClick={() => videoInputRef.current?.click()}
                    color="neutral" 
                    size="sm"
                    sx={{ 
                      color: '#8B5E3C',
                      '&:hover': { 
                        bgcolor: 'rgba(139, 94, 60, 0.1)',
                        transform: 'scale(1.1)' 
                      },
                      transition: 'all 0.2s ease'
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? <CircularProgress size="sm" /> : <VideocamIcon />}
                  </IconButton>
                </Box>
                
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={(e) => handleFileInput(e, 'image')}
                />
                
                <input
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  ref={videoInputRef}
                  onChange={(e) => handleFileInput(e, 'video')}
                />
                
                <Box sx={{ display: 'flex', gap: 1, ml: 2, borderLeft: '1px solid rgba(139, 94, 60, 0.2)', pl: 2 }}>
                  <IconButton 
                    onClick={() => {
                      const newState = EditorState.undo(editorState);
                      if (typeof onEditorChange === 'function') {
                        onEditorChange(newState);
                      } else if (typeof setEditorState === 'function') {
                        setEditorState(newState);
                      }
                    }} 
                    color="neutral"
                    size="sm"
                    sx={{ 
                      color: '#8B5E3C',
                      '&:hover': { 
                        bgcolor: 'rgba(139, 94, 60, 0.1)',
                        transform: 'scale(1.1)' 
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <UndoIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => {
                      const newState = EditorState.redo(editorState);
                      if (typeof onEditorChange === 'function') {
                        onEditorChange(newState);
                      } else if (typeof setEditorState === 'function') {
                        setEditorState(newState);
                      }
                    }} 
                    color="neutral"
                    size="sm"
                    sx={{ 
                      color: '#8B5E3C',
                      '&:hover': { 
                        bgcolor: 'rgba(139, 94, 60, 0.1)',
                        transform: 'scale(1.1)' 
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <RedoIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative' }}>
                {isUploading && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      zIndex: 1
                    }}
                  >
                    <CircularProgress sx={{ color: '#8B5E3C' }} />
                    <Typography level="body2" sx={{ ml: 2, color: '#8B5E3C' }}>
                      미디어 업로드 중...
                    </Typography>
                  </Box>
                )}
              
          <div
            {...getRootProps()}
                  className="boardwrite-editor border p-4 rounded"
                  style={{
                    minHeight: '400px',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    border: '1px solid rgba(139, 94, 60, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: '#FAF8F5'
                  }}
                >
            <Editor
              editorState={editorState}
                    onChange={handleEditorChange}
                    blockRendererFn={blockRendererFunction}
                    customStyleFn={customStyleFn}
                    handlePastedFiles={handlePastedFiles}
                    handleDroppedFiles={handleDroppedFiles}
              placeholder="내용을 입력해주세요..."
                    readOnly={isUploading}
            />
          </div>
              </Box>
            </>
          ) : (
            <Box 
              className="preview-container" 
              p={4} 
              border={1} 
              borderRadius={1} 
              mb={4}
              sx={{
                minHeight: '450px',
                border: '1px solid rgba(139, 94, 60, 0.2)',
                borderRadius: '8px',
                backgroundColor: '#FAF8F5'
              }}
            >
              <Typography level="h4" mb={2} sx={{ color: '#8B5E3C' }}>
                {title || '제목 없음'}
              </Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: previewHtml || '내용이 없습니다.'
                }}
              />
            </Box>
          )}
          <Button
            onClick={handleSubmitWithHtml}
            className="boardwrite-submit mt-4 self-end"
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { 
                bgcolor: '#3d8b40',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              },
              color: 'white',
              mt: 3,
              fontWeight: '600',
              float: 'right',
              borderRadius: '8px',
              px: 3,
              py: 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size="sm" sx={{ mr: 1 }} /> : null}
            글쓰기
          </Button>
        </FormControl>
      </section>
    </main>
  );
};

export default BoardWriteForm;

