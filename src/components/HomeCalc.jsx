import React from "react";
import { Typography, Box } from "@mui/material";
import PaymentDistribution from "./PaymentDistribution"; // Make sure to adjust the import path if necessary

const HomeCalc = ({ paymentData, startDate, endDate }) => {
    const calculateProfit = () => {
        return paymentData.reduce((sum, item) => sum + item.amount, 0);
    };

    return (
        <div>
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
                    Profit from {startDate ? startDate.format('MM/DD/YYYY') : ''} to {endDate ? endDate.format('MM/DD/YYYY') : ''}: ₪{calculateProfit()}
                </Typography>
            </Box>
            <PaymentDistribution key={paymentData.name} paymentData={paymentData} />
        </div>
    );
};

export default HomeCalc;
