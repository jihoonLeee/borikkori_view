import React, { useState, useEffect, useContext, useCallback } from 'react';
import { EditorState, AtomicBlockUtils, RichUtils, ContentState, SelectionState, ContentBlock } from 'draft-js';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import BoardWriteForm from '../../components/board/BoardWriteForm';
import { initializePost, createPost, uploadFile, deletePost } from '../../api/boardApi';
import { AuthContext } from '../../contexts/AuthProvider';

const BoardWriteContainer = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const onEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    console.log(newEditorState.getCurrentContent().getBlockMap());
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
      setEditorState(newState);
      return 'handled';
    }
    if (command === 'split-block') {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const block = content.getBlockForKey(selection.getStartKey());
      if (block.getType() === 'atomic') {
        // Manually create a new block after the atomic block
        const newContent = content.insertAfter(
          block,
          ContentBlock.create({
            type: 'unstyled',
            data: {},
          })
        );
        const newEditorState = EditorState.push(
          editorState,
          newContent,
          'insert-block'
        );
        const newSelection = newEditorState.getSelection().merge({
          anchorKey: newContent.getLastBlock().getKey(),
          anchorOffset: 0,
          focusOffset: 0,
        });
        setEditorState(EditorState.forceSelection(newEditorState, newSelection));
        return 'handled';
      }
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

  const handleSubmit = async () => {
    console.log(htmlContent);
    try {
      await createPost({
        postId,
        title,
        contents: htmlContent,
        isTemp: false,
      });
      alert('게시글 등록 성공');
      navigate('/board');
      window.location.reload();
    } catch (error) {
      console.error('게시글 등록 실패', error);
      alert('게시글 등록 실패');
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    console.log('BoardWriteContainer: 파일 업로드 시작', file.name, file.type);
    
    try {
      // uploadFile API 호출
      const fileUrl = await uploadFile({ file, postId });
      console.log('파일 업로드 완료, 서버 URL:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      throw new Error(`파일 업로드 실패: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!authenticated) {
      alert('로그인 해주세요');
      navigate('/login');
      return;
    }
  
    initializePost()
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
    />
  );
};

export default BoardWriteContainer;