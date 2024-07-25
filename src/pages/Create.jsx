import React, { useState } from "react";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  RadioGroup,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Radiosbutton from "../components/Radiosbutton";
import Texts from "../components/Texts";

export default function Create() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [selectedDate, setSelectedDate] = useState({ date: null, lessondate: null });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [radioValue, setRadioValue] = useState("Cash");
  const [textValues, setTextValues] = useState({
    name: "",
    price: "",
    payment: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setTextValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const fields = [
    { id: "name", label: "Name", variant: "filled" },
    { id: "date", label: "Date of payment", variant: "filled" },
    { id: "price", label: "Price for lesson", variant: "filled" },
    { id: "payment", label: "Pay in this lesson", variant: "filled" },
    { id: "lessondate", label: "Lesson Date", variant: "filled" }
  ];

  const radiobuttons = [
    { value: "Cash", label: "Cash" },
    { value: "Bit", label: "Bit" },
    { value: "Paybox", label: "Paybox" },
    { value: "Transktion", label: "Transktion" },
    { value: "Nopayment", label: "No payment" },
  ];

  const handleDateClick = (fieldId) => {
    setActiveDateField(fieldId);
    setCalendarOpen(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate((prevState) => ({
      ...prevState,
      [activeDateField]: date ? date.toISOString().split("T")[0] : null
    }));
    setCalendarOpen(false);
  };

  return (
    <div>
      <Typography
        variant="h4"
        color="textSecondary"
        gutterBottom
        component="h2"
      >
        Add a lesson
      </Typography>
      <Grid container spacing={2} alignItems="flex-start">
        {fields.map((item) => (
          <Grid key={item.id} item xs={12} md={6}>
            <Texts
              id={item.id}
              label={item.label}
              onClick={item.id === "date" || item.id === "lessondate" ? () => handleDateClick(item.id) : undefined}
              value={item.id === "date" || item.id === "lessondate" ? selectedDate[item.id] : textValues[item.id]}
              onChange={handleChange}
            />
          </Grid>
        ))}
      </Grid>
      {calendarOpen && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" justifyContent="center">
                <DateCalendar
                  onChange={(date) => handleDateChange(date)}
                />
              </Box>
            </LocalizationProvider>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <FormLabel>Pay method</FormLabel>
          <RadioGroup
            row
            defaultValue="Cash"
            name="radio-buttons-group"
            value={radioValue}
            onChange={(event) => setRadioValue(event.target.value)}
          >
            {radiobuttons.map((item) => (
              <Radiosbutton
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel label="Reception" control={<Checkbox {...label} />} />
        </Grid>
      </Grid>
      <Box
        component="footer"
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{ padding: "16px", width: "100%" }}
          onClick={() => console.log(textValues.name, textValues.payment, textValues.price, selectedDate.date, selectedDate.lessondate)}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
}
