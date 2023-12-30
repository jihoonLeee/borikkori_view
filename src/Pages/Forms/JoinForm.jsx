import React from 'react';
import { TextField, Button, Grid, Link, Box } from '@mui/material';

const JoinForm = ({ onSubmit }) => {
  return (
    <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField required fullWidth id="NickName" label="닉네임" name="lastName" autoComplete="family-name" />
        </Grid>
        <Grid item xs={10}>
          <TextField required fullWidth id="email" label="이메일" name="email" autoComplete="email" />
        </Grid>
        <Grid item xs={2}>
          <Button type="submit" fullWidth variant="contained" sx={{ height:55 ,mt: 0 ,ml : -1, backgroundColor: '#936e79', '&:hover': { backgroundColor: '#56434c' } }}> 인증</Button>
        </Grid>
        <Grid item xs={12}>
          <TextField required fullWidth name="password" label="비밀번호" type="password" id="password" autoComplete="new-password" />
        </Grid>
        <Grid item xs={12}>
          <TextField required fullWidth name="password Check" label="비밀번호 확인" type="password" id="passwordCheck" autoComplete="passwordCheck" />
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
