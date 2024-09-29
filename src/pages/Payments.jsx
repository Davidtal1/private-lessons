import { Box, TextField, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Payments() {
  const [name, setName] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

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

  const calculatePayments = useCallback(() => {
    const payers = lessons.reduce((acc, lesson) => {
      const { name, payment } = lesson;

      const existingPayer = acc.find(payer => payer.name.toLowerCase() === name.toLowerCase());
      if (existingPayer) {
        existingPayer.totalPaid += payment;
      } else {
        acc.push({ name, totalPaid: payment });
      }

      return acc;
    }, []);

    setPayments(payers);
  }, [lessons]);

  useEffect(() => {
    calculatePayments();
  }, [lessons, calculatePayments]);

  const onFilterChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
  };

  if (loading) {
    return <CircularProgress />;
  }

  const filteredPayments = payments.filter(payer => payer.name.toLowerCase().includes(name.toLowerCase()));

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
          maxWidth: 600,
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
        {filteredPayments.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h6">Name</Typography></TableCell>
                  <TableCell><Typography variant="h6">Total Paid (₪)</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payer, index) => (
                  <TableRow key={index}>
                    <TableCell>{payer.name}</TableCell>
                    <TableCell>{payer.totalPaid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" sx={{ mt: 2, color: '#f44336' }}>
            {name ? `No payments found for ${name}` : "No payments found"}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
