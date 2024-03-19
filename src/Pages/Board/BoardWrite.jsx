import React, { useState, useContext, useEffect } from 'react';
import { Editor, EditorState, Modifier, RichUtils,AtomicBlockUtils  } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Check from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Modules/AuthProvider';
import { useDropzone } from 'react-dropzone';
import '../../Styles/BoardWrite.css'
import axios from 'axios';

export default function BoardWrite() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { userInfo, authenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const newEditorState = addImageToEditorState(editorState, reader.result);
        setEditorState(newEditorState);
      }
      const formData = new FormData();
      formData.append('file', file);
      // axios.post('/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then(response => {
      //   console.log(response);
      // }).catch(error => {
      //   console.log(error);
      // });
  
      reader.readAsDataURL(file);
    });
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop,noClick:true });

  const addImageToEditorState = (editorState, imageUrl) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
  }

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
    try {
      const response = await axios.post('/post', {
        title: document.getElementsByName('Primary')[0].value,
        contents: editorState.getCurrentContent().getPlainText('\u0001'),
        email: userInfo.email,
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
            />
          </Box>
        </FormControl>

        <FormControl>
        <div {...getRootProps()} onDragOver={(event) => event.preventDefault()} className="postEditor" >
      <input {...getInputProps()} />
        <Editor 
        editorState={editorState} 
        onChange={setEditorState} 
        blockRendererFn={myBlockRenderer} 
        placeholder='내용을 입력해주세요..'/>
        </div>
          <Button onClick={handleSubmit}>글쓰기</Button>
        </FormControl>
      </section>
    </main>
  );
}
