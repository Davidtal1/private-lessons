import React, { useState } from "react";
import { Grid, Typography, Checkbox, FormControlLabel } from "@mui/material";
import FooterCreate from "../components/FooterCreate";
import Texts from "../components/Texts";
import PayMethod from "../components/PayMethod";
import axios from 'axios';

export default function Create() {
  const [selectedDate, setSelectedDate] = useState({ date: null, lessondate: null });
  const [radioValue, setRadioValue] = useState("Nopayment");
  const [textValues, setTextValues] = useState({
    name: "",
    price: "",
    payment: "",
  });
  const [reception, setReception] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (id === "date" || id === "lessondate") {
      setSelectedDate((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    } else {
      setTextValues((prevValues) => ({
        ...prevValues,
        [id]: value,
      }));
    }
  };

  const fields = [
    { id: "name", label: "Name" },
    { id: "lessondate", label: "Lesson Date" },
    { id: "price", label: "Price for lesson" },
    { id: "payment", label: "Pay in this lesson" },
    { id: "date", label: "Date of payment" },
  ];

  const radiobuttons = [
    { value: "Cash", label: "Cash" },
    { value: "Bit", label: "Bit" },
    { value: "Paybox", label: "Paybox" },
    { value: "Bank transfer", label: "Bank transfer" },
    { value: "Nopayment", label: "No payment" },
  ];

  const handleSubmit = async () => {
    try {
      const data = {
        selectedDate,
        textValues,
        radioValue,
        reception
      };
      const response = await axios.post('http://localhost:5000/add_lesson', data);
      console.log('Document inserted:', response.data);
    } catch (error) {
      console.error('Error inserting document:', error);
    }
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
              value={item.id === "date" || item.id === "lessondate" ? selectedDate[item.id] : textValues[item.id]}
              onChange={handleChange}
              type={item.id === "date" || item.id === "lessondate" ? "date" : "text"}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <PayMethod
            radiobuttons={radiobuttons}
            radioValue={radioValue}
            setRadioValue={setRadioValue}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel 
            label="Reception" 
            control={<Checkbox checked={reception} onChange={(e) => setReception(e.target.checked)} />} 
          />
        </Grid>
      </Grid>
      <FooterCreate handleSubmit={handleSubmit} />
    </div>
  );
}
