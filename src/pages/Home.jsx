import React, { useState, useEffect } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import HomeCalc from "../components/HomeCalc";

export default function Home() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [paymentData, setPaymentData] = useState([]);

    const handleCalculate = () => {
        setShowResult(true);
    };

    const fetchPaymentData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/payment_amount', {
                params: {
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                }
            });
            setPaymentData(Object.keys(response.data).map(key => ({
                name: key,
                amount: response.data[key]
            })));
        } catch (error) {
            console.error('Error fetching amount:', error);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchPaymentData();
        }
    }, [startDate, endDate]);

    return (
        <div style={{ backgroundColor: '#b2dfdb', padding: '16px' }}>
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue ? dayjs(newValue).startOf('day') : null)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue ? dayjs(newValue).endOf('day') : null)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculate}
                    disabled={!startDate || !endDate}
                >
                    Calculate
                </Button>
            </Box>

            {showResult && (
                <HomeCalc paymentData={paymentData} startDate={startDate} endDate={endDate} />
            )}
        </div>
    );
}
