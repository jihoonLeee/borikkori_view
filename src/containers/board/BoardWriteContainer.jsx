import React, { useState, useEffect, useContext, useCallback } from 'react';
import { EditorState, AtomicBlockUtils, RichUtils, ContentState, SelectionState, ContentBlock } from 'draft-js';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import BoardWriteForm from '../../components/board/BoardWriteForm';
import { initializePost, createPost, uploadFile, deletePost } from '../../api/boardApi';
import { AuthContext } from '../../contexts/AuthProvider';
import { getCategoryByKey } from '../../constants/boardCategory';
import axios from 'axios';

const BoardWriteContainer = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [category, setCategory] = useState({
    mainCategory: '',
    subCategory: ''
  });
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const onEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const selection = newEditorState.getSelection();
    
    // 선택 영역이 있는 경우에만 로그 출력
    if (!selection.isCollapsed()) {
      console.log('선택된 텍스트:', contentState.getBlockForKey(selection.getStartKey()).getText());
    }
  };

  const addMediaToEditorState = (editorState, mediaUrl, mediaType) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(mediaType, 'IMMUTABLE', { src: mediaUrl });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    const newSelection = newEditorState.getSelection().merge({
      anchorKey: newEditorState.getCurrentContent().getBlockAfter(newEditorState.getCurrentContent().getLastBlock().getKey())?.getKey(),
      anchorOffset: 0,
      focusOffset: 0,
    });
    return EditorState.forceSelection(newEditorState, newSelection);
  };
  
  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      try {
        const mediaUrl = await uploadFile({ file, postId }); // Upload API call
        setEditorState((currentEditorState) =>
          addMediaToEditorState(
            currentEditorState,
            mediaUrl,
            file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
          )
        );
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        alert('파일 업로드 실패');
      }
    }
  };
  
  // Using noClick and noKeyboard to prevent file dialog on click
  const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

  const setSelection = (selection) => {
    setEditorState(EditorState.forceSelection(editorState, selection));
  };

  const myBlockRenderer = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      return {
        component: MediaComponent,
        props: { setSelection },
        editable: false,
      };
    }
    return null;
  };

  const MediaComponent = React.memo((props) => {
    const { block, contentState, setSelection } = props;
    const entityKey = block.getEntityAt(0);
    const videoRef = React.useRef(null);

    const handleVideoFocus = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.blur();
      }
    }, []);

    const handleClick = useCallback((e) => {
      e.stopPropagation();
      const selection = SelectionState.create(block.key, 0, block.key, 1);
      setSelection(selection);
    }, [block.key, setSelection]);

    const entity = entityKey ? contentState.getEntity(entityKey) : null;
    const type = entity ? entity.getType() : null;

    if (!entityKey) return null;

    const { src } = entity.getData();

    return (
      <div
        data-draft-js-block="true"
        className="atomic-block"
        style={{ userSelect: 'none' }}
        onClick={handleClick}
      >
        {type === 'IMAGE' ? (
          <img src={src} alt="uploaded" style={{ maxWidth: '100%' }} />
        ) : type === 'VIDEO' ? (
          <video
            ref={videoRef}
            src={src}
            controls
            style={{ maxWidth: '100%' }}
            onFocus={handleVideoFocus}
            tabIndex="-1"
          />
        ) : null}
      </div>
    );
  });

  const handleTempSave = async () => {
    const contentStateJSON = JSON.stringify(
      editorState.getCurrentContent().toJS()
    );
    try {
      await createPost({
        postId,
        title,
        contents: contentStateJSON,
        isTemp: true,
        categoryType: category.mainCategory,
        subCategoryType :category.subCategory
      });
      alert('임시 저장 성공');
    } catch (error) {
      console.error('임시 저장 실패', error);
      alert('임시 저장 실패');
    }
  };

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleBeforeInput = (chars, editorState) => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    if (block.getType() === 'atomic') {
      const nextBlock = content.getBlockAfter(block.key);
      const anchorKey = nextBlock ? nextBlock.key : block.key;
      const newSelection = selection.merge({
        anchorKey,
        anchorOffset: 0,
        focusOffset: 0,
      });
      setEditorState(EditorState.forceSelection(editorState, newSelection));
      return 'handled';
    }
    return 'not-handled';
  };

  const handleSubmit = async (title, htmlContent, isTemp = false) => {
    if (!authenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!category.mainCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

     try {
      await createPost({
        postId,
        title,
        contents: htmlContent,
        isTemp,
        categoryType: category.mainCategory,
        subCategoryType:category.subCategory
      });
      alert("게시글 작성에 성공했습니다.");
      navigate('/board');
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
      if (axios.isAxiosError(error) && error.response) {
        const msg =
          error.response.data?.message || `서버 오류: ${error.response.status}`;
        alert(`게시글 작성에 실패했습니다: ${msg}`);
      } else {
        alert('게시글 작성 중 오류가 발생했습니다.');
      }
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      console.error('업로드할 파일이 없습니다.');
      return null;
    }
    
    console.log('파일 업로드 시작:', file.name);
    
    try {
      // 초기화된 postId가 없으면 생성
      if (!postId) {
        await initializePostId();
      }
      
      // 서버에 파일 업로드
      const uploadResult = await uploadFile({ file, postId });
      console.log('서버 업로드 결과:', uploadResult);
      
      if (uploadResult && uploadResult.fileUrl) {
        return uploadResult.fileUrl;
      } else {
        throw new Error('파일 URL을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
      return null;
    }
  };

  const handleCategoryChange = (mainCategory, subCategory) => {
    setCategory({
      mainCategory,
      subCategory
    });
  };

  const initializePostId = async () => {
    try {
      const response = await initializePost("FREE");
      if (response && response.postId) {
        setPostId(response.postId);
        return response.postId;
      } else {
        throw new Error('게시글 초기화 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('게시글 초기화 실패:', error);
      throw error;
    }
  };

  const handleDeletePost = async () => {
    if (!postId) {
      navigate('/board');
      return;
    }
    
    if (window.confirm('작성 중인 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        alert('게시글이 삭제되었습니다.');
        navigate('/board');
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    if (!authenticated) {
      alert('로그인 해주세요');
      navigate('/login');
      return;
    }
  
    initializePost("FREE")
      .then((data) => {
        setPostId(data.postId);
        if (data.temp) {
          const hasContent =
            (data.title && data.title.trim() !== '') ||
            (data.contents && data.contents.trim() !== '');
          if (hasContent && window.confirm('임시 저장된 게시글이 있습니다. 계속 작성 하시겠습니까?')) {
            setTitle(data.title);
            const contentState = ContentState.createFromBlockArray(
              JSON.parse(data.contents).blocks
            );
            setEditorState(EditorState.createWithContent(contentState));
            
            // 카테고리 설정
            if (data.category) {
              // 카테고리 정보 확인 및 설정
              const categoryInfo = getCategoryByKey(data.category);
              
              if (categoryInfo) {
                if (categoryInfo.parentKey) {
                  // 하위 카테고리인 경우
                  setCategory({
                    mainCategory: categoryInfo.parentKey,
                    subCategory: data.category
                  });
                } else {
                  // 메인 카테고리인 경우
                  setCategory({
                    mainCategory: data.category,
                    subCategory: ''
                  });
                }
              }
            }
          } else {
            deletePost(data.postId)
              .then(() => window.location.reload())
              .catch(console.log);
          }
        }
      })
      .catch(console.log);
  }, [authenticated, navigate]);
  

  return (
    <BoardWriteForm
      title={title}
      setTitle={setTitle}
      editorState={editorState}
      onEditorChange={onEditorChange}
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      handleSubmit={handleSubmit}
      handleTempSave={handleTempSave}
      blockRendererFn={myBlockRenderer}
      handleKeyCommand={handleKeyCommand}
      handleBeforeInput={handleBeforeInput}
      setHtmlContent={setHtmlContent}
      handleImageUpload={handleImageUpload}
      category={category}
      onCategoryChange={handleCategoryChange}
      handleDeleteClick={handleDeletePost}
    />
  );
};

export default BoardWriteContainer;