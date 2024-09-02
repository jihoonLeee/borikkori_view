import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../modules/AuthProvider';
import { useParams } from "react-router-dom";

const ChatRoom = () => {
  const { roomId } = useParams(); // URL 파라미터로부터 roomId를 가져옵니다.
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messageType, setMessageType] = useState('ENTER');
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const websocket = new WebSocket(`wss://api.bokko.kr/ws/chat/message/${roomId}`);
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [roomId]);

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log('WebSocket 연결 성공');
        sendMessage('ENTER', true);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };
      ws.onclose = () => console.log('WebSocket 연결 종료');
    }
  }, [ws]);

  const sendMessage = (type, initial = false) => {
    if (ws && (inputMessage || initial)) {
      const messageData = {
        messageType: type,
        message: inputMessage,
      };
      ws.send(JSON.stringify(messageData));
      setInputMessage('');
      setMessageType('TALK');
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(messageType);
  };

  const styles = {
    messageContainer: (isCurrentUser) => ({
      display: 'flex',
      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      margin: '5px 0',
    }),
    message: (isCurrentUser) => ({
      maxWidth: '60%',
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: isCurrentUser ? '#D1FFC6' : '#F1F0F0',
      color: 'black',
    }),
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '80vh',
      width: '100%',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '10px',
      backgroundColor: '#fff',
    },
    inputArea: {
      display: 'flex',
      marginTop: '10px',
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '20px',
      border: '1px solid #ccc',
      marginRight: '10px',
    },
    button: {
      padding: '10px 20px',
      borderRadius: '20px',
      border: 'none',
      backgroundColor: '#fec107',
      color: 'white',
      cursor: 'pointer',
    },
    messageArea: {
      flexGrow: 1,
      overflowY: 'auto',
      marginBottom: '10px',
    },
    enterMessageContainer: {
      textAlign: 'center',
      width: '100%',
      margin: '10px 0',
    },
    enterMessage: {
      display: 'inline-block',
      padding: '10px',
      borderRadius: '20px',
      fontWeight: 'bold',
      backgroundColor: '#AED581',
      color: 'white',
    },
  };

  return (
    <div style={styles.chatContainer}>
      <h2>채팅하기</h2>
      <div style={styles.messageArea}>
        {messages.map((msg, index) => (
          msg.messageType === "ENTER" ? (
            <div key={index} style={styles.enterMessageContainer}>
              <div style={styles.enterMessage}>
                <strong>{msg.sender} 님이 입장하였습니다.</strong>
              </div>
            </div>
          ) : (
            <div key={index} style={styles.messageContainer(userInfo && msg.sender === userInfo.nickName)}>
              <div style={styles.message(userInfo && msg.sender === userInfo.nickName)}>
                <span>{msg.sender}: {msg.message}</span>
              </div>
            </div>
          )
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="메시지 입력"
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>보내기</button>
      </div>
    </div>
  );
};

export default ChatRoom;
