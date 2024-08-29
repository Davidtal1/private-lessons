import React, { useState } from "react";
import { Alert ,Grid, Typography, Checkbox, FormControlLabel } from "@mui/material";
import FooterCreate from "../components/FooterCreate";
import Texts from "../components/Texts";
import PayMethod from "../components/PayMethod";
import axios from 'axios';
import dayjs from 'dayjs';


export default function Create() {
  const [selectedDate, setSelectedDate] = useState({ payment_date: null, lesson_date: null });
  const [showAlert, setShowAlert] = useState(false);
  const [nameAlert, setnameAlert] = useState('');
  const [payment_method, setRadioValue] = useState("No payment");
  const [textValues, setTextValues] = useState({
    name: "",
    price: "",
    payment: "",
  });
  const [reception, setReception] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (id === "payment_date" || id === "lesson_date") {
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
    { id: "lesson_date", label: "Lesson Date" },
    { id: "price", label: "Price for lesson" },
    { id: "payment", label: "Pay in this lesson" },
    { id: "payment_date", label: "Date of payment" },
  ];

  const radiobuttons = [
    { value: "Cash", label: "Cash" },
    { value: "Bit", label: "Bit" },
    { value: "Paybox", label: "Paybox" },
    { value: "Bank transfer", label: "Bank transfer" },
    { value: "No payment", label: "No payment" },
  ];



const handleSubmit = async () => {
  try {
    const { lesson_date, payment_date } = selectedDate;
    const { name, price, payment } = textValues;
    
    
    const data = {
      lesson_date: lesson_date ? new Date(dayjs(lesson_date).format('YYYY-MM-DD')) : null,
      payment_date : payment_date ? new Date(dayjs(lesson_date).format('YYYY-MM-DD')) : null,
      name,
      price: Number(price),
      payment: Number(payment),
      payment_method,
      reception
    };
    
    const response = await axios.post('http://localhost:5000/lessons', data);
    setShowAlert(true)
    setnameAlert(data.name)
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
              value={item.id === "payment_date" || item.id === "lesson_date" ? selectedDate[item.id] : textValues[item.id]}
              onChange={handleChange}
              type={
                item.id === "payment" || item.id === "price"
                  ? "number"
                  : item.id === "payment_date" || item.id === "lesson_date"
                  ? "date"
                  : item.id === "reception"
                  ? "checkbox"
                  : "text"
              }
              
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <PayMethod
            radiobuttons={radiobuttons}
            radioValue={payment_method}
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
      {showAlert && 
      <Alert severity="success">The lesson for {nameAlert} is inserted</Alert>}
      <FooterCreate handleSubmit={handleSubmit} />
    </div>
  );
}
