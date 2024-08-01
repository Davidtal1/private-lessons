import { TextField, Autocomplete, Typography, Button } from "@mui/material";

export default function HomeCalc({years, currentYear, setYear, months, setMonth, currentMonth, handleCalculate}) {
    
    return (
        <div>
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
        </div>
    );
  }
         