import { Box, TextField, Typography, CircularProgress, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Debts() {
    const [name, updateName] = useState('');
    const [lessons, setLessons] = useState([]);
    const [debt, setDebt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_lessons');
                setLessons(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lessons data:", error);
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const onFilterChange = (event) => {
        const enteredName = event.target.value;
        updateName(enteredName);

        const personLessons = lessons.filter(lesson => lesson.name.toLowerCase() === enteredName.toLowerCase());
        const totalDebt = personLessons.reduce((sum, lesson) => sum + (lesson.price - lesson.payment), 0);
        setDebt(personLessons.length > 0 ? totalDebt : null);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 4
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                }}
            >
                <TextField
                    label="Filter by Name"
                    name="name"
                    value={name}
                    onChange={onFilterChange}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2, '& .MuiInputLabel-root': { color: '#3f51b5' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#3f51b5' }, '&:hover fieldset': { borderColor: '#303f9f' }, '&.Mui-focused fieldset': { borderColor: '#1a237e' } } }}
                />
                {name && (
                    <Typography variant="h6" sx={{ mt: 2, color: debt !== null ? '#4caf50' : '#f44336' }}>
                        {debt !== null ? `${name} needs to pay you ₪${debt}` : `No lessons found for ${name}`}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}
