import React, { useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import ChatRoomList from './ChatRoomList';
import { useMediaQuery } from '@mui/material';
import { Drawer, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const ChatLayout = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerStyle = {
    width: 250,
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    backgroundColor: 'white',
  };

  const drawerPointer = {
    position: 'absolute',
    top: '10px',
    left: '-20px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    transform: 'rotate(45deg)',
    boxShadow: '-3px -3px 10px rgba(0, 0, 0, 0.1)',
  };

  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {isMobile ? (
        <>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            style={{
              position: 'fixed',
              top: '20%',
              left: 0,
              zIndex: 1300,
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // 반투명
              borderRadius: '0 10px 10px 0', // 오른쪽 모서리 둥근 사각형
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // 그림자 효과
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
            PaperProps={{
              style: {
                ...drawerStyle,
              },
            }}
          >
            <div style={drawerPointer}></div>
            <div style={{ width: '100%' }}>
              <IconButton onClick={toggleDrawer} style={{ marginLeft: 'auto' }}>
                <CloseIcon />
              </IconButton>
              <ChatRoomList onSelectRoom={toggleDrawer} />
            </div>
          </Drawer>
          <div style={{ flexGrow: 1, padding: '20px', marginTop: '64px' }}>
            <Outlet />
          </div>
        </>
      ) : (
        <>
          {isChatPage && (
            <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
              <ChatRoomList />
            </div>
          )}
          <div style={{ flexGrow: 1, padding: '20px' }}>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatLayout;
