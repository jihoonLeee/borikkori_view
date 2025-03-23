import * as React from 'react';
import { Avatar, Chip } from "@mui/material";

export default function UserAvatar({ userName }) {
  return (
    <Chip
      avatar={<Avatar alt="logo" src="/images/borikkori_logo.png" />}
      label={userName}
      variant="outlined"
      sx={{ 
        fontWeight: "bold",   
        color: "white",
        fontSize: "0.875rem" }} 
    />
  );
}
