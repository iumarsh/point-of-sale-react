import React, { useState } from 'react';
import { Box, Typography, useTheme, TextField, Autocomplete, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import { BASEURL } from '../../data/endpoints';
import { tokens } from '../../theme';
const Cheques = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

 
  return (
    <Box m="20px">
      <Header title="Mahmood Dari House" subtitle="Cheques Details" />
      Coming Soon...
    </Box>
  );
};

export default Cheques;
