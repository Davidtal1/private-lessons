import { Button, TextField } from "@mui/material";
import React ,{ useState } from "react";

export default function Debts() {

    const [name,updateName]=useState('');

    const onFilterChange = (event) =>{
        updateName(event.target.value)
    }

    return (
        <div>
        <TextField
        label="Filter by Name"
        name="name"
        value={name}
        onChange={onFilterChange}
        sx={{ m: 2, width: 200 }}
        />
        </div>
    );
}
