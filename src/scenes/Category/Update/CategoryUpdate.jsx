import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { tokens } from '../../../theme';

const CategoryUpdate = ({
    setOpen = "",
    open = "",
    categoryName = "",
    categoryType = "",
    categoryPrice = "",
    categoryQuantity = "",
    categoryAdditionalInfo = "",
    categoryId=""
}) => {
  const [name, setName] = useState(categoryName);
  const [type, setType] = useState(categoryType);
  const [price, setPrice] = useState(categoryPrice);
  const [quantity, setQuantity] = useState(categoryQuantity);
  const [additionalInfo, setAdditionalInfo] = useState(categoryAdditionalInfo);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const BASEURL = 'http://localhost:5000'
  const handleUpdateCategory = async () => {
    try {
    const category = {
        name,
        categoryType: type,
        quantity,
        additionalInfo,
        price,
        
    }
    const url = new URL(`/api/category/${categoryId}`, BASEURL); 
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    console.log('response: ', response);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  useEffect(() => {
    // Update state when prop values change
    if(open){
        setName(categoryName);
        setType(categoryType);
        setPrice(categoryPrice);
        setQuantity(categoryQuantity);
        setAdditionalInfo(categoryAdditionalInfo);
    }
   
  }, [open]);


  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <Box m="20px">
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} color="primary">
            Update Category
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoryUpdate;
