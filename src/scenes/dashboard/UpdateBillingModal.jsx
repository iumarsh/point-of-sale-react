import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const UpdateBillingModal = ({
    setOpen = "",
    open = "",
    categoryName = "",
    categoryType = "",
    categoryPrice = "",
    categoryQuantity = "",
    categoryTotal = "",
    categoryDiscount = 0,
    categoryId="",
    handleUpdateCategory
}) => {
  const [name, setName] = useState(categoryName);
  const [type, setType] = useState(categoryType);
  const [price, setPrice] = useState(categoryPrice);
  const [quantity, setQuantity] = useState(categoryQuantity);
  const [total, setTotal] = useState(categoryTotal);
  const [discount, setDiscount] = useState(categoryDiscount)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Update state when prop values change
    if(open){
        setName(categoryName);
        setType(categoryType);
        setPrice(categoryPrice);
        setQuantity(categoryQuantity);
        setTotal(categoryTotal)
        setDiscount(0)
    }
   
  }, [open]);
  useEffect(()=> {
    setTotal((price * quantity) -  (price * quantity * discount/100) )
  },[price, quantity,discount])

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Update Billing</DialogTitle>
        <DialogContent>
          <Box m="20px">
            <TextField
              type="text"
              label="Category Name"
              variant="outlined"
              fullWidth
              disabled={true}
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mt: 2 }}
            />
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
              type="number"
              label="Discount"
              variant="outlined"
              fullWidth
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              sx={{ mt: 2 }}
            />
             <TextField
              type="text"
              label="Total"
              variant="outlined"
              fullWidth
              disabled={true}
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={()=> handleUpdateCategory(price, quantity, discount)} color="primary">
            Update Billing
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBillingModal;
