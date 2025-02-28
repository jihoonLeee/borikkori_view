import React, { useState, useEffect, useContext } from 'react';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import BoardWriteForm from '../../components/board/BoardWriteForm';
import { initializePost, createPost, uploadImage } from '../../api/boardApi';
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
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );
    return EditorState.forceSelection(
      newEditorState,
      newEditorState.getCurrentContent().getSelectionAfter()
    );
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      uploadImage({ file, postId })
        .then((imageUrl) => {
          setEditorState((currentEditorState) => addImageToEditorState(currentEditorState, imageUrl));
        })
        .catch(error => console.log(error));
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });

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

  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    try {
      await createPost({
        postId,
        title,
        contents: html,
      });
      alert('글이 성공적으로 등록되었습니다.');
      navigate("/mainBoard");
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
        if (data.temp && window.confirm("임시 저장된 게시글이 있습니다. 계속 작성 하시겠습니까?")) {
          setTitle(data.title);
        }
      })
      .catch(error => console.log(error));

    if (!authenticated) {
      alert("로그인 해주세요.");
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
      blockRendererFn={myBlockRenderer}
    />
  );
};

export default BoardWriteContainer;
