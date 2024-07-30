import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import PaymentDistribution from "../components/PaymentDistribution";
import HomeCalc from "../components/HomeCalc";
import axios from "axios";

export default function Home() {
    const years = Array.from({ length: 51 }, (_, i) => 2000 + i);
    const [currentYear, setYear] = useState(new Date().getFullYear());

    const months = Array.from({ length: 12 }, (_, i) => 1 + i);
    const [currentMonth, setMonth] = useState(new Date().getMonth() + 1);

    // State for controlling visibility of the result section
    const [showResult, setShowResult] = useState(false);
    const [paymentData, setPaymentData] = useState([
          { name: 'Bit', amount: 0 },
          { name: 'Cash', amount: 0 },
          { name: 'Paybox', amount: 0 },
          { name: 'Bank Transfer', amount: 0 },
          { name: 'No pay', amount: 0 }
        ]);

    const handleCalculate = () => {
        setShowResult(true);
        // Add logic to calculate profit here
    };

    const calculateProfit = () => {
        var sum=0
        paymentData.map(item=>sum+=item.amount)
        return sum
    };


    useEffect(() => {
        const getAmountPerMonthAndYear = async (currentMonth, currentYear) => {
          try {
            const response = await axios.get('http://localhost:5000/get_amount', {
              params: { currentMonth, currentYear }
            });
            console.log(response.data);
    
            // Map the response data to the paymentData format
            const newPaymentData = Object.keys(response.data).map(key => ({
              name: key,
              amount: response.data[key]
            }));
    
            setPaymentData(newPaymentData);
          } catch (error) {
            console.error('Error fetching amount:', error);
          }
        };
    
        getAmountPerMonthAndYear(currentMonth, currentYear);
      }, [currentMonth, currentYear]);

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
