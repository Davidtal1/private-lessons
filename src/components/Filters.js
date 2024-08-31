import React from "react";
import { TextField } from "@mui/material";

const Filters = ({
  nameFilter,
  setNameFilter,
  monthFilter,
  setMonthFilter,
  yearFilter,
  setYearFilter,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "16px",
    }}
  >
    <TextField
      label="Filter by Name"
      value={nameFilter}
      onChange={(e) => setNameFilter(e.target.value)}
      sx={{ m: 2, width: 200 }}
    />
    <TextField
      label="Filter by Month"
      value={monthFilter}
      onChange={(e) => setMonthFilter(e.target.value)}
      sx={{ m: 2, width: 200 }}
      type="number"
      inputProps={{ min: 1, max: 12, step: 1 }}
    />
    <TextField
      label="Filter by Year"
      value={yearFilter}
      onChange={(e) => setYearFilter(e.target.value)}
      sx={{ m: 2, width: 200 }}
      type="number"
      inputProps={{ min: 1900, max: new Date().getFullYear() }}
    />
  </div>
);

export default Filters;
