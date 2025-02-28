import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import JoinForm from '../../components/user/JoinForm';
import BasicAlert from '../../components/common/BasicAlert';
import { AuthContext } from '../../contexts/AuthProvider';

const UserJoinContainer = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (authenticated) {
      alert("접근할 수 없습니다.");
      navigate('/');
    }
  }, [authenticated, navigate]);

  // 회원가입 API 호출
  const joinUser = async (credentials) => {
    try {
      const response = await axios.post(
        `/user/join`,
        credentials,
        { withCredentials: true }
      );
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
      return response.data;
    } catch (error) {
      alert(`회원가입에 실패했습니다: ${error}`);
      throw error;
    }
  };

  // 이메일 인증 API 호출
  const emailVerify = async (email) => {
    try {
      const response = await axios.post(
        `/user/sendEmail`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status !== 200) throw new Error('Verification failed');
      setShowAlert(true);
      return true;
    } catch (error) {
      alert("인증메일 전송에 실패하였습니다.");
      return false;
    }
  };

  const handleSubmit = (formData) => {
    joinUser(formData);
  };

  return (
    <div>
      {showAlert && <BasicAlert msg="이메일이 전송되었습니다." />}
      <JoinForm onSubmit={handleSubmit} onVerify={emailVerify} />
    </div>
  );
};

export default UserJoinContainer;
