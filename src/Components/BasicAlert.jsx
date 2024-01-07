import * as React from 'react';
import { useState, useEffect } from 'react'; 
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function BasicAlert({ msg }) {
  const [open, setOpen] = useState(true);  

  useEffect(() => { 
    const timer = setTimeout(() => {
      setOpen(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    open ? ( 
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="success">{msg}</Alert>
      </Stack>
    ) : null
  );
}
