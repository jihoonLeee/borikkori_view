import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinUser, sendEmailVerification } from '../../api/userApi';
import JoinForm from '../../components/user/JoinForm';
import BasicAlert from '../../components/common/BasicAlert';
import { AuthContext } from '../../contexts/AuthProvider';

const UserJoinContainer = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (authenticated) {
      alert('접근할 수 없습니다.');
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (formData) => {
    try {
      await joinUser(formData);
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (error) {
      alert(`회원가입에 실패했습니다: ${error}`);
    }
  };

  const handleVerify = async (email) => {
    try {
      await sendEmailVerification(email);
      setShowAlert(true);
      return true;
    } catch (error) {
      alert('인증메일 전송에 실패하였습니다.');
      return false;
    }
  };

  return (
    <div>
      {showAlert && <BasicAlert msg="이메일이 전송되었습니다." />}
      <JoinForm onSubmit={handleSubmit} onVerify={handleVerify} />
    </div>
  );
};

export default UserJoinContainer;
