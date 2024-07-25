import React from "react";
import { TextField } from "@mui/material";

export default function Texts({ id, label, onClick, value, onChange }) {
  return (
    <TextField
      id={id}
      label={label}
      variant="filled"
      onClick={onClick}
      value={value || ''} // Ensure value is always a string
      onChange={onChange} // Add onChange handler to update value
      fullWidth
    />
  );
}
