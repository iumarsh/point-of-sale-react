import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import styled from '@emotion/styled';

export const FooterSection = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: "20px"
}));
const BASEURL = 'http://localhost:5000'
const UserDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableData, setTableData] = useState([]);
  console.log('tableData: ', tableData);
  const [categories,setCategories] = useState([])
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
  const performTransaction = async () => {
    let _transactions = {
      items: tableData,
      grandTotal: calculateGrandTotal(),
      customerName: customerName
    }

    const url = new URL('/api/transaction',BASEURL)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_transactions),
    });
    console.log('response: ', response);

    
  }
  const fetchCategories = async () => {
    const url = new URL('/api/category',BASEURL)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const _categories = await response?.json()
    setCategories(_categories?.categories?.map(x => ({
      name: x?.name,
      price: x?.price,
      id: x?._id,
      type: x?.categoryType
    })) || [])
  }

  ///transactions

  const fetchTransactions = async () => {
    const url = new URL('/api/transaction',BASEURL)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const _transactions = await response?.json()
    console.log('_transactions: ', _transactions);
    
  }
  useEffect(()=> {
    fetchCategories();
    fetchTransactions();
  },[])
  const CategoryLabels = {
    meter: "Meters",
    dozen: "Dozens",
    pair: "Pairs",
    set: "Sets",
    piece: "Pieces"
  }
  return (
    <div style={{
            margin: "10px"
    }}>
      <Autocomplete
        sx={{
            width: "40%",
            marginBottom: "10px"
        }}
        size='small'
        options={categories} // Replace with your actual options
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
        size='small'
        label={CategoryLabels?.[selectedItem?.type] || "Quantity"} 
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Button sx={{height: "36px", marginLeft: "10px"}} size="small" variant="contained" onClick={handleAdd}>
        Add
      </Button>
      <FooterSection>
          <TextField
            sx={{
                width: "40%",
                marginBottom: "10px"
            }}
            size='small'
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
       </FooterSection>

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

      <FooterSection>
            <Button size="medium" variant="contained" onClick={performTransaction}>Perform Transaction</Button>
      </FooterSection>
    </div>
  );
};

export default UserDashboard;
