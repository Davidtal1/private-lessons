import React from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Texts({ id, label, value, onChange, type}) {
  if (type === "date") {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value ? value : null}
          onChange={(newValue) => onChange({ target: { id, value: newValue ? newValue.format("YYYY-MM-DD") : "" } })}
        />
      </LocalizationProvider>
    );
  }
  
  return (
    <TextField
      id={id}
      label={label}
      variant="standard"
      value={value || ''} // Ensure value is always a string
      onChange={onChange} // Add onChange handler to update value
      fullWidth
      type={type}
    />
  );
}
