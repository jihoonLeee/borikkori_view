import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [messageType, setMessageType] = useState('ENTER'); // 메시지 유형 상태 추가

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080/ws/chat/message');
    websocket.onopen = () => {
      console.log('WebSocket 연결 성공');
      sendMessage('ENTER');
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    websocket.onclose = () => console.log('WebSocket 연결 종료');
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (type) => {
    if (ws && inputMessage) {
      const messageData = {
        messageType: type, 
        chatRoomId: 1,
        senderId: 101,
        message: inputMessage,
      };
      console.log(JSON.stringify(messageData));
      ws.send(JSON.stringify(messageData));
      setInputMessage('');
      if (type === 'ENTER') {
        setMessageType('TALK'); 
      }
    }
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  // 사용자가 '보내기' 버튼 클릭 시 현재 메시지 유형으로 메시지 전송
  const handleSendMessage = () => {
    sendMessage(messageType);
  };

  return (
    <div>
      <h2>WebSocket Chat</h2>
      <input
        type="text"
        value={inputMessage}
        onChange={handleInputChange}
        placeholder="메시지 입력"
      />
      <button onClick={handleSendMessage}>보내기</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.messageType === "ENTER" ? "[입장] "+ msg.senderId +" 가 입장하였습니다.": ""}</strong>
            <span>{msg.senderId} : {msg.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
