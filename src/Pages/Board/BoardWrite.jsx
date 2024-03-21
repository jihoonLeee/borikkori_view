import React, { useState, useContext, useEffect } from 'react';
import { Editor, EditorState, Modifier, RichUtils,AtomicBlockUtils  } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Modules/AuthProvider';
import { useDropzone } from 'react-dropzone';
import '../../Styles/BoardWrite.css'
import axios from 'axios';

export default function BoardWrite() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { userInfo, authenticated } = useContext(AuthContext);
  const [postId, setPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const navigate = useNavigate();
  
  const onChange = (newEditorState) => {
    // 글 쓸 때 editorState가 업데이트 되어서 업로드 했던 이미지가 삭제되는 이슈로
    // 추가된 함수
    const currentContent = editorState.getCurrentContent();
    const newContent = newEditorState.getCurrentContent();

    // 텍스트 입력이나 다른 변경사항이 있을 경우
    // 기존 컨텐츠 상태를 유지하면서 새로운 상태로 업데이트
    if (currentContent !== newContent) {
      setEditorState(newEditorState);
    }
  };
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
       
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('postId', postId);
      axios.post('/file/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        const imageUrl = response.data; 
        setEditorState((currentEditorState) => addImageToEditorState(currentEditorState, imageUrl));
      }).catch(error => {
        console.log(error);
      });
    });
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop,noClick:true });

  const addImageToEditorState = (editorState, imageUrl) => {
    console.log(editorState ,imageUrl+ "상태");
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', {src: imageUrl});
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
  }

  // 블록 렌더러 함수
  const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
      };
    }
  }

  const MediaComponent = (props) => {
    const entityKey = props.block.getEntityAt(0);

    if (entityKey === null) {
      return null;
    }
    const entity = props.contentState.getEntity(entityKey);
    const {src} = entity.getData();
    const type = entity.getType();

    let media;
    if (type === 'IMAGE') {
      media = <img src={src} />;
    }

    return media;
  };



  const handleSubmit = async () => {
    const contentState = editorState.getCurrentContent();
    const html = stateToHTML(contentState);
    console.log(html);
    try {
      const response = await axios.post('/post', {
        postId,
        title: document.getElementsByName('Primary')[0].value,
        contents: html,
      },
      { withCredentials: true }
      );
      if (response.status === 201) {
        alert('글이 성공적으로 등록되었습니다.');
        navigate("/mainBoard");
        window.location.reload();
      }
    } catch (error) {
      console.error('글 등록에 실패했습니다.', error);
      alert('글 등록에 실패했습니다.');
    }
  }

  useEffect(() => {
    axios.post('/post/init', {
    },{ withCredentials: true }).then(response => {
      let postId = response.data.postId;
      setPostId(postId); 
      let isTemp = response.data.temp;
      if(isTemp){
        if (window.confirm("임시 저장된 게시글이 있습니다. 계속 작성 하시겠습니까?")) {
          //TODO 진행
          setTitle(response.data.title); 
          setContents(response.data.contents);
        } else {
          // TODO삭제 추가
           
        }
      }else{
        
      }
     
    }).catch(error => {
      console.log(error);
    });

    if (!authenticated) {
      alert("로그인 해주세요.");
      navigate('/login');
    }
  }, [authenticated, navigate]);

  return (
    <main className="flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="w-full max-w-3xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-semibold text-rose-900 dark:text-rose-50">정보 공유 게시판 글 쓰기</h2>
        <FormControl>
          <Box
            sx={{
              py: 2,
              display: 'grid',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <textarea
              name="Primary"
              placeholder="제목을 입력해주세요."
              className="postTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        </FormControl>

        <FormControl>
        <div {...getRootProps()} onDragOver={(event) => event.preventDefault()} className="postEditor" >
      <input {...getInputProps()} />
        <Editor 
          editorState={editorState} 
          onChange={onChange}
          blockRendererFn={myBlockRenderer} 
          placeholder='내용을 입력해주세요..'/>
        </div>
          <Button onClick={handleSubmit}>글쓰기</Button>
        </FormControl>
      </section>
    </main>
  );
}
