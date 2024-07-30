import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, Box } from "@mui/material";

const getBarColor = (name) => {
    return name === 'Nopayment' ? '#ff4d4d' : '#82ca9d'; 
};

const preprocessData = (data) => {
    return data.map(entry => ({
        ...entry,
        fill: getBarColor(entry.name),
    }));
};

export default function PaymentDistribution({ paymentData }) {
    const dataWithColors = preprocessData(paymentData);

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
                <BarChart data={dataWithColors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill={({ payload }) => payload.fill} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}
