import React from "react";
import { TextField } from "@mui/material";

export default function Texts({ id, label, onClick, value }) {
  return (
    <TextField
      id={id}
      label={label}
      variant="filled"
      onClick={onClick}
      value={value}
      fullWidth
    />
  );
}
