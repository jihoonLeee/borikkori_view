import React, { useState, useEffect } from 'react';
import KakaoMapContainer from '../../containers/map/KakaoMapContainer';
import { Box, CircularProgress, Typography } from '@mui/joy';

const KakaoMapPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2초 후 로딩 상태 해제
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#FAF8F5',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}
      >
        <img 
          src="/images/borikkori_cartoon_1.png" 
          alt="보리꼬리 로딩" 
          style={{ 
            maxWidth: '300px',
            marginBottom: '20px',
            animation: 'bounce 1s infinite alternate'
          }} 
        />
        <Typography 
          level="title-lg" 
          sx={{ 
            color: '#8B5E3C', 
            fontWeight: 'bold',
            marginTop: '16px'
          }}
        >
          지도를 불러오는 중입니다...
        </Typography>
        <CircularProgress 
          size="sm" 
          sx={{ 
            color: '#8B5E3C', 
            marginTop: '16px' 
          }} 
        />
        
        <style jsx="true">{`
          @keyframes bounce {
            from { transform: translateY(0px); }
            to { transform: translateY(-15px); }
          }
        `}</style>
      </Box>
    );
  }

  return <KakaoMapContainer />;
};

export default KakaoMapPage;
