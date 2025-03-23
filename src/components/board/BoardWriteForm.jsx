import React, { useState, useRef } from 'react';
import { Box, Button, FormControl, IconButton, Typography } from '@mui/joy';
import { Editor, RichUtils, EditorState } from 'draft-js';
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

const BoardWriteForm = ({
  title,
  setTitle,
  editorState,
  onEditorChange,
  getRootProps,
  getInputProps,
  handleSubmit,
  handleTempSave,
  blockRendererFn,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  // 파일 input에 직접 접근하기 위한 ref
  const fileInputRef = useRef(null);

  const toggleFormatting = (format) => {
    if (format === 'COLOR') {
      const colorStyle = `COLOR_${selectedColor.replace('#', '')}`;
      const newEditorState = RichUtils.toggleInlineStyle(editorState, colorStyle);
      onEditorChange(newEditorState);
    } else {
      const newEditorState = RichUtils.toggleInlineStyle(editorState, format);
      onEditorChange(newEditorState);
    }
  };

  // 이미지 아이콘 클릭 시 숨겨진 input 클릭
  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // getInputProps에서 받은 inputProps를 변수에 저장
  const inputProps = getInputProps();

  return (
    <main className="boardwrite-container flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="boardwrite-section w-full max-w-3xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <h2 className="boardwrite-title text-2xl font-semibold text-rose-900 dark:text-rose-50">
            정보 공유 게시판 글 쓰기
          </h2>
          <Box display="flex" gap={2}>
            <Button startDecorator={<SaveIcon />} onClick={handleTempSave} variant="outlined">
              임시저장
            </Button>
            <Button
              startDecorator={<PreviewIcon />}
              onClick={() => setShowPreview(!showPreview)}
              variant="outlined"
            >
              {showPreview ? '수정하기' : '미리보기'}
            </Button>
          </Box>
        </Box>

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
                <IconButton onClick={handleClickUpload}>
                  <ImageIcon />
                </IconButton>
                {/* 숨겨진 파일 입력: ref 병합 시 ref 타입을 체크 */}
                <input
                  {...inputProps}
                  accept="image/*, video/*"
                  style={{ display: 'none' }}
                  ref={(node) => {
                    fileInputRef.current = node;
                    if (inputProps.ref) {
                      if (typeof inputProps.ref === 'function') {
                        inputProps.ref(node);
                      } else if (typeof inputProps.ref === 'object') {
                        inputProps.ref.current = node;
                      }
                    }
                  }}
                />
                <IconButton onClick={() => onEditorChange(EditorState.undo(editorState))}>
                  <UndoIcon />
                </IconButton>
                <IconButton onClick={() => onEditorChange(EditorState.redo(editorState))}>
                  <RedoIcon />
                </IconButton>
              </Box>
              {/* 에디터 영역에 dropzone 적용 */}
              <div {...getRootProps()} className="boardwrite-editor border p-4 rounded mt-4">
                <Editor
                  editorState={editorState}
                  onChange={onEditorChange}
                  blockRendererFn={blockRendererFn}
                  customStyleFn={customStyleFn}
                  placeholder="내용을 입력해주세요..."
                />
              </div>
            </>
          ) : (
            <Box className="preview-container" p={4} border={1} borderRadius={1} mb={4}>
              <Typography level="h4" mb={2}>
                {title || '제목 없음'}
              </Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: editorState.getCurrentContent().getPlainText(),
                }}
              />
            </Box>
          )}
          <Button
            onClick={handleSubmit}
            className="boardwrite-submit mt-4 self-end"
            sx={{
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#357a38' },
              color: 'white',
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
