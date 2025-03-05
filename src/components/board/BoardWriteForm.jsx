import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, IconButton, Typography } from '@mui/joy';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../../styles/BoardWrite.css';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

const AUTOSAVE_INTERVAL = 30000; // 30초

const BoardWriteForm = ({
  title,
  setTitle,
  editorState,
  onEditorChange,
  getRootProps,
  getInputProps,
  handleSubmit,
  blockRendererFn,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  // 임시저장 기능
  useEffect(() => {
    const savedData = localStorage.getItem('boardDraft');
    if (savedData) {
      const { title: savedTitle, content: savedContent, timestamp } = JSON.parse(savedData);
      if (window.confirm('이전에 작성중이던 글이 있습니다. 불러오시겠습니까?')) {
        setTitle(savedTitle);
        onEditorChange(savedContent);
      }
    }

    const autoSaveInterval = setInterval(() => {
      if (title || editorState.getCurrentContent().hasText()) {
        const draft = {
          title,
          content: editorState,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('boardDraft', JSON.stringify(draft));
        setLastSaved(new Date());
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [title, editorState]);

  const handleManualSave = () => {
    const draft = {
      title,
      content: editorState,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('boardDraft', JSON.stringify(draft));
    setLastSaved(new Date());
    alert('임시저장되었습니다.');
  };

  const toggleFormatting = (format) => {
    const selection = editorState.getSelection();
    const nextContentState = editorState
      .getCurrentContent()
      .createEntity(format, 'MUTABLE', {});
    const entityKey = nextContentState.getLastCreatedEntityKey();
    const nextEditorState = Editor.RichUtils.toggleInlineStyle(editorState, format);
    onEditorChange(nextEditorState);
  };

  return (
    <main className="boardwrite-container flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="boardwrite-section w-full max-w-3xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <h2 className="boardwrite-title text-2xl font-semibold text-rose-900 dark:text-rose-50">
            정보 공유 게시판 글 쓰기
          </h2>
          <Box display="flex" gap={1}>
            <Button
              startDecorator={<PreviewIcon />}
              onClick={() => setShowPreview(!showPreview)}
              variant="outlined"
            >
              {showPreview ? '수정하기' : '미리보기'}
            </Button>
            <Button
              startDecorator={<SaveIcon />}
              onClick={handleManualSave}
              variant="outlined"
            >
              임시저장
            </Button>
          </Box>
        </Box>
        {lastSaved && (
          <Typography level="body2" color="neutral" mb={2}>
            마지막 저장: {new Date(lastSaved).toLocaleString()}
          </Typography>
        )}
        <FormControl>
          <Box sx={{ py: 2, display: 'grid', gap: 2, alignItems: 'center' }}>
            <textarea
              name="Primary"
              placeholder="제목을 입력해주세요."
              className="boardwrite-title-input p-2 border rounded w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        </FormControl>
        <FormControl>
          {!showPreview ? (
            <>
              <Box className="editor-toolbar" display="flex" gap={1} mb={2}>
                <IconButton onClick={() => toggleFormatting('BOLD')}>
                  <FormatBoldIcon />
                </IconButton>
                <IconButton onClick={() => toggleFormatting('ITALIC')}>
                  <FormatItalicIcon />
                </IconButton>
                <IconButton onClick={() => toggleFormatting('UNDERLINE')}>
                  <FormatUnderlinedIcon />
                </IconButton>
                <Box position="relative">
                  <IconButton onClick={() => setShowFormatting(!showFormatting)}>
                    <FormatColorTextIcon />
                  </IconButton>
                  {showFormatting && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      bgcolor="background.paper"
                      border={1}
                      borderColor="divider"
                      borderRadius={1}
                      p={1}
                      zIndex={1}
                    >
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          toggleFormatting('COLOR');
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <IconButton {...getRootProps()}>
                  <ImageIcon />
                </IconButton>
                <input {...getInputProps()} />
                <IconButton onClick={() => onEditorChange(Editor.EditorState.undo(editorState))}>
                  <UndoIcon />
                </IconButton>
                <IconButton onClick={() => onEditorChange(Editor.EditorState.redo(editorState))}>
                  <RedoIcon />
                </IconButton>
              </Box>
              <div
                {...getRootProps()}
                onDragOver={(event) => event.preventDefault()}
                className="boardwrite-editor border p-4 rounded mt-4"
              >
                <Editor
                  editorState={editorState}
                  onChange={onEditorChange}
                  blockRendererFn={blockRendererFn}
                  placeholder="내용을 입력해주세요..."
                />
              </div>
            </>
          ) : (
            <Box className="preview-container" p={4} border={1} borderRadius={1} mb={4}>
              <Typography level="h4" mb={2}>{title || '제목 없음'}</Typography>
              <div dangerouslySetInnerHTML={{ __html: editorState.getCurrentContent().getPlainText() }} />
            </Box>
          )}
          <Button 
            onClick={handleSubmit} 
            className="boardwrite-submit mt-4 self-end"
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#357a38' },
              color: 'white'
            }}
          >
            글쓰기
          </Button>
        </FormControl>
      </section>
    </main>
  );
};

export default BoardWriteForm;
