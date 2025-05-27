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
import BoardCategorySelector from './BoardCategorySelector';

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

// getBlobUrls 함수 추가
const getBlobUrls = (contentState) => {
  if (!contentState) return [];
  
  const blobUrls = [];
  const blocks = contentState.getBlocksAsArray();
  
  for (const block of blocks) {
    if (block.getType() === 'atomic') {
      const entityKey = block.getEntityAt(0);
      if (entityKey) {
        const entity = contentState.getEntity(entityKey);
        const { src } = entity.getData();
        
        if (src && src.startsWith('blob:')) {
          blobUrls.push(src);
        }
      }
    }
  }
  
  return blobUrls;
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
  category,
  onCategoryChange,
  handleKeyCommand,
  handleDeleteClick,
  blockRendererFn,
  handleBeforeInput
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isUploading, setIsUploading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [titleError, setTitleError] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const editorRef = useRef(null);
  
  // getRootProps에서 isDragActive 추출
  const { isDragActive } = getRootProps ? getRootProps() : { isDragActive: false };

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
    const hasText = contentState.hasText();
    const blockMap = contentState.getBlockMap();
    const isEmpty = !hasText && blockMap.size <= 1;
    
    // 내용이 비어있는 경우, 빈 HTML 반환
    if (isEmpty) {
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

  const handleSubmitWithHtml = (isTemp = false) => {
    // 제목 확인
    if (!title.trim() && !isTemp) {
      alert('제목을 입력해주세요');
      return;
    }

    // 카테고리 확인 (임시저장이 아닌 경우)
    if (!category.mainCategory && !isTemp) {
      alert('카테고리를 선택해주세요');
      return;
    }

    // HTML 변환
    const contentState = editorState.getCurrentContent();
    const html = convertContentToHTML(contentState);
    
    // 미디어 URL 경고
    const blobUrls = getBlobUrls(contentState);
    if (blobUrls.length > 0 && !isTemp) {
      const confirmed = window.confirm(
        '저장되지 않은 미디어 파일이 있습니다. 계속 진행하시면 이미지나 비디오가 제대로 표시되지 않을 수 있습니다. 계속하시겠습니까?'
      );
      if (!confirmed) {
        return;
      }
    }
    
    // 제출
    handleSubmit(title, html, isTemp);
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
    <Box className="board-write-container" sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
      <Box className="board-write-header" sx={{ mb: 2 }}>
        <Typography level="h3" component="h1" sx={{ mb: 2 }}>
          게시글 작성
        </Typography>
        
        {/* 카테고리 선택 */}
        <BoardCategorySelector 
          selectedCategory={category.subCategory || category.mainCategory}
          onCategoryChange={onCategoryChange}
        />
        
        <FormControl sx={{ width: '100%', mt: 2 }}>
          <input
            type="text"
            className="postTitle"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      </Box>

      {/* 에디터 툴바 */}
      <Box className="editor-toolbar" sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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

      {/* 에디터 */}
      <Box
        className="postEditor"
        sx={{
          border: '1px solid #ccc',
          padding: 2,
          minHeight: '300px',
          backgroundColor: 'white',
        }}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          {...(typeof blockRendererFn === 'function' ? { blockRendererFn } : {})}
          {...(typeof handleBeforeInput === 'function' ? { handleBeforeInput } : {})}
          placeholder="내용을 입력하세요..."
          autoFocus
        />
      </Box>

      {/* 액션 버튼 */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color="danger"
          startDecorator={<DeleteIcon />}
          onClick={handleDeleteClick}
        >
          삭제
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="neutral"
            startDecorator={<SaveIcon />}
            onClick={() => handleSubmitWithHtml(true)}
          >
            임시저장
          </Button>
          <Button
            color="primary"
            startDecorator={<PreviewIcon />}
            onClick={() => handleSubmitWithHtml(false)}
          >
            등록
          </Button>
        </Box>
      </Box>

      {/* 이미지/비디오 업로드 드래그 영역 */}
      <Box
        {...getRootProps()}
        sx={{
          mt: 2,
          p: 2,
          border: '2px dashed #ccc',
          borderRadius: 2,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f8f8f8'
          }
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>파일을 여기에 놓으세요...</Typography>
        ) : (
          <Typography>
            클릭하거나 파일을 여기로 드래그하여 이미지나 비디오를 업로드하세요
          </Typography>
        )}
      </Box>

      {/* 미리보기 모달 */}
      {/* ... existing preview modal ... */}
    </Box>
  );
};

export default BoardWriteForm;

