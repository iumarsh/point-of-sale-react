import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { BASEURL } from '../../../data/endpoints';
import axios from 'axios'
const LedgerUpdate = ({
    setOpen = "",
    open = "",
    editedItem,
    fetchLedgerDetails,
}) => {
  const [receivingAmount, setReceivingAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateBill = async () => {
    try {
      setLoading(true)
      let _transactions = {
          ...editedItem,
          deletedItems:[],
          receiving: parseFloat(editedItem?.receiving) + parseFloat(receivingAmount) 
      }
      const response = await axios.put(`${BASEURL}/api/transaction/${editedItem?._id}`, _transactions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
    setOpen(false);
    fetchLedgerDetails();
    setLoading(false)

  } catch (error) {
      setLoading(false)
      alert(error)
      console.log('error: ', error);
  }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Bill</DialogTitle>
        <DialogContent>
          <Box m="20px">
            <TextField
                sx={{
                    width: "100%",
                }}
                size='small'
                label="Receiving Amount"
                value={receivingAmount}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setReceivingAmount(e.target.value)}
                />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleUpdateBill} color="primary">
            { loading ? "Loading..." : "Updating Bill"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LedgerUpdate;