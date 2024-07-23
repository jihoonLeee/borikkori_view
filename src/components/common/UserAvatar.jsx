import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


export default function UserAvatar({userName}) {
  return (
    <Stack direction="row" spacing={1} className="flex items-center justify-center">
      <Chip
        avatar={<Avatar alt="Natacha" src="../images/dog_freinds_logo.png" />}
        label={userName}
        variant="outlined"
      />
    </Stack>
  );
}