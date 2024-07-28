import React from "react";
import {Box, Button} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function FooterCreate({handleSubmit}) {
    return (
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
          onClick={handleSubmit}
        >
          Submit
        </Button >
      </Box>
    );
  }