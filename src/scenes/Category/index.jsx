import React, { useState } from 'react';
import { Box, Typography, useTheme, TextField, Autocomplete, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from '../../data/endpoints';
const AddCategory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [name, setName] = useState('');
  const [type, setType] = useState('meter');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async () => {
    try {
      setLoading(true);
    const category = {
        name,
        categoryType: type,
        quantity,
        additionalInfo,
        price,
        
    }
    const url = new URL('/api/category',BASEURL)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if(response.ok){
      navigate('/');
    }
    setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error adding category:', error);
    }
  };

  // const handleAddCategory = async () => {
  //   const category = {
  //           name,
  //           categoryType: type,
  //           quantity,
  //           additionalInfo,
  //           price,
            
  //       }
  //   const response = await axios.post(`${BASEURL}/api/category`, category, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   console.log('response: ', response);
  // }


  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.greenAccent[600]
                : access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {access === "manager" && <SecurityOutlinedIcon />}
            {access === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Mahmood Dari House" subtitle="Add Category Section" />
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
        />
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="meter">Meter</MenuItem>
              <MenuItem value="dozen">Dozen</MenuItem>
              <MenuItem value="pair">Pair</MenuItem>
              <MenuItem value="set">Set</MenuItem>
              <MenuItem value="piece">Piece</MenuItem>
            </Select>
        </FormControl>
        <TextField
            type="number"
            label="Quantity"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mt: 2 }}
        />
        <TextField
            type="number"
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ mt: 2 }}
        />
        <TextField
            label="Additional Info"
            variant="outlined"
            fullWidth
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            sx={{ mt: 2 }}
        />
        <Button disabled={loading} variant="contained" color="primary" onClick={handleAddCategory} sx={{ mt: 2 }}>
           {loading ? "Loading..." : "Add Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddCategory;
