import React, { useState, useEffect, useContext } from 'react';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import BoardWriteForm from '../../components/board/BoardWriteForm';
import { initializePost, createPost, uploadImage,deletePost } from '../../api/boardApi';
import { AuthContext } from '../../contexts/AuthProvider';

const BoardWriteContainer = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const onEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const addImageToEditorState = (editorState, imageUrl) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    return EditorState.forceSelection(
      newEditorState,
      newEditorState.getCurrentContent().getSelectionAfter()
    );
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      uploadImage({ file, postId })
        .then((imageUrl) => {
          setEditorState((currentEditorState) =>
            addImageToEditorState(currentEditorState, imageUrl)
          );
        })
        .catch((error) => console.log(error));
    });
  };

  // noClick, noKeyboard 옵션을 사용하여 에디터 영역에서 파일 선택창이 뜨지 않도록 설정
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const myBlockRenderer = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      return { component: MediaComponent, editable: false };
    }
  };

  const MediaComponent = (props) => {
    const entityKey = props.block.getEntityAt(0);
    if (!entityKey) return null;
    const entity = props.contentState.getEntity(entityKey);
    const { src } = entity.getData();
    if (entity.getType() === 'IMAGE') {
      return <img src={src} alt="uploaded" className="boardwrite-image" />;
    }
    return null;
  };

  const handleTempSave = async () => {
    const html = stateToHTML(editorState.getCurrentContent());
    try {
      await createPost({
        postId,
        title,
        contents: html,
        isTemp: true,
      });
      alert('임시저장 완료');
    } catch (error) {
      console.error('임시저장 실패', error);
      alert('임시저장에 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    try {
      await createPost({
        postId,
        title,
        contents: html,
        isTemp: false,
      });
      alert('글이 성공적으로 등록되었습니다.');
      navigate('/board');
      window.location.reload();
    } catch (error) {
      console.error('글 등록에 실패했습니다.', error);
      alert('글 등록에 실패했습니다.');
    }
  };

  useEffect(() => {
    initializePost()
      .then((data) => {
        setPostId(data.postId);
        console.log(data.postId + " : 1 : "+ postId);
        if (data.temp && window.confirm('임시 저장된 게시글이 있습니다. 계속 작성 하시겠습니까?')) {
          setTitle(data.title);
          const contentState = stateFromHTML(data.contents);
          const restoredState = EditorState.createWithContent(contentState);
          setEditorState(restoredState);
        }else if(data.temp){
          deletePost(data.postId);
        }
      })
      .catch((error) => console.log(error));

    if (!authenticated) {
      alert('로그인 해주세요.');
      navigate('/login');
    }
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
    />
  );
};

export default BoardWriteContainer;
