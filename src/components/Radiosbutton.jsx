import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export default function Radiobutton({ value, label }) {
  return (
    <FormControlLabel
      value={value}
      control={<Radio color="primary" />}
      label={label}
    />
  );
}
