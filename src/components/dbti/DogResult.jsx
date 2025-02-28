import React from 'react';
import { Box, Button } from '@mui/material';
import { FaSave, FaLink } from 'react-icons/fa';
import useMediaQuery from '@mui/material/useMediaQuery';

const DogResult = ({ resultName, onCapture, onCopyLink, copied }) => {
  // 600px 이하인 경우 모바일로 간주
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      {/* 제목 영역 */}
      <Box sx={{ my: 4 }}>
        <p className="uppercase text-4xl font-sans font-bold">
          우리 강아지는 {resultName}야~
        </p>
      </Box>
      {/* 결과 이미지 */}
      <Box>
        <img
          id="result"
          style={{ maxWidth: '100%', height: 'auto' }}
          alt="result"
          src={`${process.env.PUBLIC_URL}/images/results/${resultName}_result.png`}
        />
      </Box>
      {/* 버튼 영역 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mt: 3,
        }}
      >
        <Button
         className='bg-accent'
          onClick={onCapture}
          variant="contained"
          sx={{
            px: 3,
            py: isMobile ? 1.5 : 2,
            fontSize: isMobile ? '0.8rem' : '1rem',
          }}
          startIcon={<FaSave size={isMobile ? 20 : 24} />}
        >
          결과 저장하기
        </Button>
        <Button
              className='bg-accent'
          onClick={onCopyLink}
          variant="contained"
          sx={{
            px: 3,
            py: isMobile ? 1.5 : 2,
            fontSize: isMobile ? '0.8rem' : '1rem',
          }}
          startIcon={<FaLink size={isMobile ? 20 : 24} />}
        >
          {copied ? "복사 완료!" : "결과 공유하기"}
        </Button>
      </Box>
    </Box>
  );
};

export default DogResult;
