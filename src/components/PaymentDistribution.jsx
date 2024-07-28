import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, Box } from "@mui/material";


export default function PaymentDistribution({paymentData}) {
  return (
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
  );
}
