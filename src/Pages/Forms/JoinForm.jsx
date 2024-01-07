import React, { useState, useRef } from 'react';
import { TextField, Button, Grid, Link, Box } from '@mui/material';
import Fade from '@mui/material/Fade';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const JoinForm = ({ onSubmit, onVerify }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState(''); 
  const nodeRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      nickName: '',
      email: '',
      verificationNumber: '',
      password: '',
      passwordCheck: ''
    },
    validationSchema: Yup.object({
      nickName: Yup.string().required('필수 항목입니다.'),
      email: Yup.string().email('이메일 형식이 틀렸습니다.').required('필수 항목입니다.'),
      password: Yup.string().required('필수 항목입니다.'),
      passwordCheck: Yup.string()
        .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
        .required('필수 항목입니다.'),
    }),
    onSubmit: values => {
      if (!isVerified) {
        alert("이메일 인증이 필요합니다.");
        return;
      }

      onSubmit({
        email: values.email,
        password: values.password,
        name: values.nickName, 
        verificationNumber: values.verificationNumber, 
      });
    },
  });

  const handleVerify = async () => {
    const result = await onVerify(email);
    if (result) {
      setIsVerified(true); 
    }
  };

  return (
    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField required fullWidth id="nickName" label="닉네임" name="nickName" autoComplete="family-name" onChange={formik.handleChange} value={formik.values.nickName}/>
          {formik.touched.nickName &&formik.errors.nickName ? <div style={{ color: 'red', textAlign: 'left',fontSize:'12px' }}>{formik.errors.nickName}</div> : null}
        </Grid>
        <Grid item xs={10}>
          <TextField 
            required 
            fullWidth 
            id="email" 
            label="이메일" 
            name="email" 
            autoComplete="email" 
            value={formik.values.email} 
            onChange={(event) => {
              formik.handleChange(event); 
              setEmail(event.target.value);
            }} 
          />
          {formik.touched.nickName &&formik.errors.email ? <div style={{ color: 'red', textAlign: 'left',fontSize:'12px' }}>{formik.errors.email}</div> : null}
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleVerify} type="button" fullWidth variant="contained" sx={{ height:55 ,mt: 0, ml: -1, backgroundColor: '#936e79', '&:hover': { backgroundColor: '#56434c' } }}> 인증</Button>
        </Grid>
        {isVerified &&
        <Fade  in={isVerified}>
          <Grid item xs={12} ref={nodeRef}>
            <TextField required fullWidth id="verificationNumber" label="인증번호" name="verificationNumber" onChange={formik.handleChange} value={formik.values.verificationNumber}/>
          </Grid>
        </Fade>
        }
        <Grid item xs={12}>
          <TextField required fullWidth name="password" label="비밀번호" type="password" id="password" autoComplete="new-password" 
            onChange={formik.handleChange} 
            value={formik.values.password}
          />
          {formik.touched.nickName &&formik.errors.password ? <div style={{ color: 'red', textAlign: 'left' ,fontSize:'12px'}}>{formik.errors.password}</div> : null}
        </Grid>
        <Grid item xs={12}>
          <TextField required fullWidth name="passwordCheck" label="비밀번호 확인" type="password" id="passwordCheck" autoComplete="passwordCheck" 
            onChange={formik.handleChange} 
            value={formik.values.passwordCheck}
          />
          {formik.touched.nickName &&formik.errors.passwordCheck ? <div style={{ color: 'red', textAlign: 'left',fontSize:'12px' }}>{formik.errors.passwordCheck}</div> : null}
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: '#fa7477', '&:hover': { backgroundColor: '#a52921' } }}>회원가입</Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="/login" variant="body2">이미 가입하셨나요?</Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JoinForm;
