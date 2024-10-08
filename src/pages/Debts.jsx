import { Box, TextField, Typography, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Debts() {
  const [name, setName] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState([]);

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

  const calculateDebts = useCallback(() => {
    const debtors = lessons.reduce((acc, lesson) => {
      const { name, price, payment } = lesson;
      const debtForThisLesson = price - payment; // Could be positive (debt) or negative (overpayment)
  
      const existingDebtor = acc.find(debtor => debtor.name.toLowerCase() === name.toLowerCase());
      if (existingDebtor) {
        existingDebtor.debt += debtForThisLesson;
      } else {
        acc.push({ name, debt: debtForThisLesson });
      }
  
      return acc;
    }, []);
  
    // Only include debtors with non-zero debts (either positive or negative)
    setDebts(debtors.filter(debtor => debtor.debt !== 0));
  }, [lessons]);
  

  useEffect(() => {
    calculateDebts();
  }, [lessons, calculateDebts]);

  const onFilterChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
  };

  const getTotalDebt = () => {
    return debts.reduce((sum, debtor) => sum + debtor.debt, 0);
  };

  if (loading) {
    return <CircularProgress />;
  }

  const filteredDebts = debts.filter(debtor => debtor.name.toLowerCase().includes(name.toLowerCase()));
  const totalDebt = getTotalDebt();

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
        {filteredDebts.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h6">Name</Typography></TableCell>
                  <TableCell><Typography variant="h6">Amount Owed (₪)</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDebts.map((debtor, index) => (
                  <TableRow key={index}>
                    <TableCell>{debtor.name}</TableCell>
                    <TableCell
                      sx={{ color: debtor.debt < 0 ? 'red' : 'inherit' }}
                    >
                      {debtor.debt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell><Typography variant="h6">Total Debt</Typography></TableCell>
                  <TableCell><Typography variant="h6">₪{totalDebt}</Typography></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="h6" sx={{ mt: 2, color: '#f44336' }}>
            {name ? `No debtors found for ${name}` : "No debtors found"}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
