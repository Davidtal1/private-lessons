import {
  Box,
  Button,
  FormLabel,
  Grid,
  RadioGroup,
  Typography,
} from "@mui/material";
import { React, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { format } from "date-fns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Radiosbutton from "../components/Radiosbutton";
import Texts from "../components/Texts";

export default function Create() {
  const [selectedDate, updateDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("Cash");

  const fields = [
    { id: "name", label: "Name", variant: "filled" },
    { id: "date", label: "Date of payment", variant: "filled" },
    { id: "price", label: "Price for lesson", variant: "filled" },
    { id: "payment", label: "Pay in this lesson", variant: "filled" },
  ];

  const radiobuttons = [
    { value: "Cash", label: "Cash" },
    { value: "Bit", label: "Bit" },
    { value: "Paybox", label: "Paybox" },
    { value: "Transktion", label: "Transktion" },
    { value: "Nopayment", label: "No payment" },
  ];

  const handleDateClick = () => {
    setCalendarOpen(true);
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
              onClick={item.id === "date" ? handleDateClick : undefined}
              value={item.id === "date" ? selectedDate : ""}
            />
          </Grid>
        ))}
        {calendarOpen && (
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <DateCalendar
                  onChange={(date) => {
                    updateDate(format(new Date(date), "yyyy-MM-dd"));
                    setCalendarOpen(false);
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Grid>
        )}
      </Grid>
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
            ></Radiosbutton>
          ))}
        </RadioGroup>
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
        >
          Submit
        </Button>
      </Box>
    </div>
  );
}
