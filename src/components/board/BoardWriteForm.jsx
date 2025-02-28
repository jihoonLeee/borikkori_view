import React from 'react';
import { Box, Button, FormControl } from '@mui/joy';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import '../../styles/BoardWrite.css';

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
  return (
    <main className="boardwrite-container flex flex-col items-center px-4 md:px-6 dark:bg-rose-900 min-h-screen">
      <section className="boardwrite-section w-full max-w-3xl mt-8 bg-white dark:bg-rose-950 rounded-lg shadow-md overflow-hidden p-6">
        <h2 className="boardwrite-title text-2xl font-semibold text-rose-900 dark:text-rose-50 mb-4">
          정보 공유 게시판 글 쓰기
        </h2>
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
          <div
            {...getRootProps()}
            onDragOver={(event) => event.preventDefault()}
            className="boardwrite-editor border p-4 rounded mt-4"
          >
            <input {...getInputProps()} />
            <Editor
              editorState={editorState}
              onChange={onEditorChange}
              blockRendererFn={blockRendererFn}
              placeholder="내용을 입력해주세요..."
            />
          </div>
          <Button onClick={handleSubmit} className="boardwrite-submit mt-4 self-end">
            글쓰기
          </Button>
        </FormControl>
      </section>
    </main>
  );
};

export default BoardWriteForm;
