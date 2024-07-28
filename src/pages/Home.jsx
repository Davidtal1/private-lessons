import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import PaymentDistribution from "../components/PaymentDistribution";
import HomeCalc from "../components/HomeCalc";

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
            <HomeCalc
            key={currentYear}
            years={years}
            currentYear={currentYear}
            setYear={setYear}
            months={months}
            setMonth={setMonth} 
            currentMonth={currentMonth} 
            handleCalculate={handleCalculate}
            ></HomeCalc>

            {showResult && (
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
                        Profit for {currentMonth}/{currentYear}: ₪{calculateProfit()}
                    </Typography>
                </Box>
                <PaymentDistribution key={paymentData.name} paymentData={paymentData}/>
            </div>
                )}
        </div>
    );
}
