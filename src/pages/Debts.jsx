import { Box, TextField, Typography, CircularProgress, Paper } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Debts() {
  const [name, setName] = useState('');
  const [lessons, setLessons] = useState([]);
  const [debt, setDebt] = useState(null);
  const [totalPaid, setTotalPaid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lessons');
        setLessons(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lessons data:", error);
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const calculateDebt = useCallback((enteredName) => {
    const personLessons = lessons.filter(lesson => lesson.name.toLowerCase() === enteredName.toLowerCase());
    const totalDebt = personLessons.reduce((sum, lesson) => sum + (lesson.price - lesson.payment), 0);
    const totalPaidAmount = personLessons.reduce((sum, lesson) => sum + lesson.payment, 0);
    setDebt(personLessons.length > 0 ? totalDebt : null);
    setTotalPaid(personLessons.length > 0 ? totalPaidAmount : null);
  }, [lessons]);

  const onFilterChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
    calculateDebt(enteredName);
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
          sx={{
            mb: 2,
            '& .MuiInputLabel-root': { color: '#3f51b5' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#3f51b5' },
              '&:hover fieldset': { borderColor: '#303f9f' },
              '&.Mui-focused fieldset': { borderColor: '#1a237e' }
            }
          }}
        />
        {name && (
          <>
            <Typography variant="h6" sx={{ mt: 2, color:  '#f44336' }}>
              {debt !== null ? `${name} needs to pay you ₪${debt}` : `No lessons found for ${name}`}
            </Typography>
            {totalPaid !== null && (
              <Typography variant="h6" sx={{ mt: 2, color: '#4caf50' }}>
                {name} has paid you a total of ₪{totalPaid}
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
