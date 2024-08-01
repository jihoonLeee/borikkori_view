import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Typography, CssBaseline, Box } from '@mui/material';

const theme = createTheme();

const ChatRoomList = ({ onSelectRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 임의의 채팅방 데이터 생성
    const mockChatRooms = [
      { id: '1', name: '일반 채팅방' },
      { id: '2', name: '강아지 채팅방' },
      { id: '3', name: '고양이 채팅방' },
      { id: '4', name: '반려동물 정보 공유방' },
      { id: '5', name: '잡담방' },
    ];
    setChatRooms(mockChatRooms);
  }, []);

  const handleJoinRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
    if (onSelectRoom) {
      onSelectRoom();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            채팅방 목록
          </Typography>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {chatRooms.map((room) => (
              <ListItem key={room.id} button onClick={() => handleJoinRoom(room.id)}>
                <ListItemText primary={room.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ChatRoomList;
