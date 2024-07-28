import React, { useState } from "react";
import { TextField, Autocomplete, Typography, Button, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
    const years = Array.from({ length: 51 }, (_, i) => 2000 + i);
    const [currentYear, setYear] = useState(new Date().getFullYear());

    const months = Array.from({ length: 12 }, (_, i) => 1 + i);
    const [currentMonth, setMonth] = useState(new Date().getMonth() + 1);

    // State for controlling visibility of the result section
    const [showResult, setShowResult] = useState(false);

    // Handler for button click
    const handleCalculate = () => {
        setShowResult(true);
        // Add logic to calculate profit here
    };

    // Sample profit calculation (replace with actual logic)
    const calculateProfit = () => {
        return 1000; // Replace this with actual calculation
    };

    // Sample amounts received via different payment methods (replace with actual data)
    const paymentData = [
        { name: 'Bit', amount: 2000 },
        { name: 'Cash', amount: 300 },
        { name: 'Paybox', amount: 150 },
        { name: 'Bank Transfer', amount: 350 }
    ];

    return (
        <div style={{ backgroundColor: '#b2dfdb', padding: '16px' }}>
            <Typography
                variant="h4"
                color="textSecondary"
                gutterBottom
                component="h2"
                sx={{ textAlign: 'center' }} // Center align the heading
            >
                Calculate the profit
            </Typography>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Autocomplete
                    disablePortal
                    id="year-combo-box"
                    options={years}
                    value={currentYear}
                    onChange={(event, newValue) => {
                        setYear(newValue);
                    }}
                    sx={{ width: '100%' }} // Make input full width
                    renderInput={(params) => <TextField {...params} label="Year" fullWidth />}
                />

                <Autocomplete
                    disablePortal
                    id="month-combo-box"
                    options={months}
                    value={currentMonth}
                    onChange={(event, newValue) => {
                        setMonth(newValue);
                    }}
                    sx={{ width: '100%' }} // Make input full width
                    renderInput={(params) => <TextField {...params} label="Month" fullWidth />}
                />

                <Button variant="contained" onClick={handleCalculate} sx={{ backgroundColor: '#397145', color: 'black', width: '100%' }}>
                    Calc
                </Button>
            </div>

            {showResult && (
                <>
                    <Box
                        sx={{
                            marginTop: '16px',
                            padding: '16px',
                            backgroundColor: '#ffffff',
                            borderRadius: '4px',
                            textAlign: 'center',
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h6" color="textPrimary">
                            Profit for {currentMonth}/{currentYear}: ₪{calculateProfit()}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            marginTop: '16px',
                            padding: '16px',
                            backgroundColor: '#e0f7fa',
                            borderRadius: '4px',
                            textAlign: 'center',
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            Payment Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={paymentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </>
            )}
        </div>
    );
}
