import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const initialData = [];

const UserDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [tableData, setTableData] = useState(initialData);

  const handleAdd = () => {
    if (selectedItem && quantity !== '') {
      const newItem = {
        name: selectedItem.name,
        quantity: parseFloat(quantity),
        price: selectedItem.price,
        discount: 0, // You can implement discount logic here
      };

      setTableData((prevData) => [...prevData, newItem]);
      // Clear inputs after adding
      setSelectedItem(null);
      setQuantity('');
    }
  };

  const handleDelete = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };
  const calculateGrandTotal = () => {
    return tableData.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const updateItem = (id) => {
      let _editItem = tableData?.find(x => x?.id === id);
  }

  const stocks = [
    { id: 1, name: "Viscos", price: 80.2 },
    { id: 2, name: "Palachi", price: 600 },
    { id: 3, name: "Sheesha", price: 40 },
    { id: 4, name: "BM Roza", price: 89.2 },
    { id: 5, name: "Armani", price: 123.2 },
    { id: 6, name: "AM Brand", price: 230 },
    { id: 7, name: "Multani RX", price: 190 },
    { id: 8, name: "Diamond", price: 20 },
    { id: 9, name: "Double Bed Sheet", price: 50 },
    { id: 10, name: "Roma Silonika", price: 75 },
  ]
  return (
    <div style={{
        
            margin: "10px"
        
    }}>
      <Autocomplete
        sx={{
            width: "40%",
            marginBottom: "10px"
        }}
        options={stocks} // Replace with your actual options
        getOptionLabel={(option) => option.name}
        value={selectedItem}
        onChange={(event, newValue) => setSelectedItem(newValue)}
        renderInput={(params) => <TextField {...params} label="Select Item" />}
      />

      <TextField
        sx={{
            width: "40%",
            marginBottom: "10px"
        }}
        type="number"
        label="Quantity (meters)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Button variant="contained" onClick={handleAdd}>
        Add
      </Button>

      <Table sx={{ maxHeight: "100vh", maxHeight: "100vh", overflowY: "scroll"}}>
        <TableHead>
          <TableRow>
            <TableCell>Sr. No</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Disc%</TableCell>
            <TableCell>Grand Total</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{(item.price * item.quantity).toLocaleString()}</TableCell>
              <TableCell>{item.discount}</TableCell>
              <TableCell>{(item.price * item.quantity).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => updateItem(item?.id)}>
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>

          ))}
           <TableRow sx={{backgroundColor: "red"}}>
            <TableCell colSpan={2}></TableCell>
            <TableCell colSpan={4}>Grand Total</TableCell>
            <TableCell>{calculateGrandTotal().toLocaleString()}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UserDashboard;
