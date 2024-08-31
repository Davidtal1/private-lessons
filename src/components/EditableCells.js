// src/components/EditableCells.js
import React from "react";
import { TextField, Select, MenuItem, Checkbox } from "@mui/material";
import { PAYMENT_METHODS } from "../constants";
import { formatDate } from "../utils";

export const EditableTextCell = ({ name, value, onChange, type = "text" }) => (
  <TextField
    name={name}
    type={type}
    value={value || ""}
    onChange={onChange}
    sx={{ width: "100%" }}
  />
);

export const EditableDateCell = ({ name, value, onChange }) => (
  <TextField
    name={name}
    type="date"
    value={formatDate(value)}
    onChange={onChange}
    sx={{ width: "100%" }}
  />
);

export const EditableSelectCell = ({ name, value, onChange }) => (
  <Select
    name={name}
    value={value || ""}
    onChange={onChange}
    sx={{ width: "100%" }}
  >
    {PAYMENT_METHODS.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
);

export const EditableCheckbox = ({ name, checked, onChange }) => (
  <Checkbox name={name} checked={checked || false} onChange={onChange} />
);
