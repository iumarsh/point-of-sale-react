import { Button } from '@mui/base'
import { Grid, TextField, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import _ from "lodash"
import { RowSection, FetchButton, BillItem, ActionItems } from './ledger.styles'
import { BASEURL } from '../../data/endpoints'
import axios from '../../utility/axiosConfig'
import Visibility from '@mui/icons-material/Visibility'
import { useNavigate, useLocation } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from '../../theme'
import LedgerUpdate from './update/LedgerUpdate'
import moment from 'moment'



const Ledger = () => {
    const navigate = useNavigate();

    const savedState = JSON.parse(localStorage.getItem('ledgerState')) || {};

    const [contactNo, setContactNo] = useState(savedState.contactNo || '');
    const [ledgerDetails, setLedgerDetails] = useState(savedState.ledgerDetails || []);
    const [ledgerUpdate, setLedgerUpdate] = useState(false)
    const [editedItem , setEditedItem] = useState({})
    const [loading,setLoading] = useState(false);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const fetchCustomerLedger = async () => {
        try {
            setLoading(true);
            let _contactNumner = contactNo?.replace(/\D/g, '')
            const response = await axios.get(`/transaction/contact/${_contactNumner}`);
            setLedgerDetails(response?.data?.transactions)
            localStorage.removeItem('ledgerState')
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert('Error')
        }
    }
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('ledgerState')) || {};

        setContactNo(savedState.contactNo || '');
        setLedgerDetails(savedState.ledgerDetails || []);
        // if (contactNo && _.isEmpty(ledgerDetails)) {
        //     fetchCustomerLedger();
        // }

        // return () => localStorage.removeItem('ledgerState');
    }, []);

    const handleViewTransaction = (id) => {
        localStorage.setItem('ledgerState', JSON.stringify({ contactNo, ledgerDetails }));
        navigate(`/transaction/view/${id}`)
      }
    const editLedger = (id) => {
        setLedgerUpdate(true);
        setEditedItem(ledgerDetails?.find(tran => tran?._id === id))

    }
      const totalRemainingBalance = ledgerDetails?.reduce((total, transaction) => {
        return total + (transaction.grandTotal - transaction.receiving);
      }, 0);
  return (
    <Box m="20px">
        <Header title="Mahmood Dari House" subtitle="Get complete ledger of customer"/>
            <RowSection>
                <TextField
                    label="Enter the contact no."
                    variant="outlined"
                    fullWidth
                    size='small'
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                />
                <FetchButton disabled={_.isEmpty(contactNo) || loading} size="medium" variant="contained" onClick={fetchCustomerLedger}> {loading ? 'Fetching Details...' : 'Fetch Details'}</FetchButton>
            </RowSection>

            {
                loading ? 
                    'Loading...' 
                        : _.isEmpty(ledgerDetails) ? 
                            "No Record Found!!!" 
                            :
                <Grid container spacing={2} columns={12}>
                <Grid item xs={12}>
                    {
                        ledgerDetails?.map(transaction => {
                           return (
                            <BillItem paymentPending= {transaction?.receiving != transaction?.grandTotal}>
                                <span>
                                    <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">ID: {transaction._id}</Typography>
                                    <Typography variant="h6" color={colors.grey[100]}>Name: {transaction.customerName}</Typography>
                                    <Typography variant="h6" color={colors.grey[100]}>Grand Total: {transaction.grandTotal}</Typography>
                                    <Typography variant="h6" color={colors.grey[100]}>Received Amount: {transaction.receiving}</Typography>
                                    <Typography variant="h6" color={colors.grey[100]}>Remaining Balance: {transaction.grandTotal - transaction.receiving}</Typography>
                                    <Typography variant="h6" color={colors.grey[100]}>Date: {moment(transaction.createdAt).format('L')}</Typography>
                                </span>
                                <ActionItems>
                                    <Visibility cursor="pointer" onClick={()=>handleViewTransaction(transaction._id)}/>
                                    <EditIcon cursor="pointer" variant="contained" onClick={()=> editLedger(transaction?._id)}/>
                                </ActionItems>
                            </BillItem>
                           )
                        })
                    }
                </Grid>
                <Grid item xs={12}>
                    <BillItem>
                    <Typography fontWeight="bold" variant="h6" color={colors.grey[100]}>Total Remaining Balance: {totalRemainingBalance}</Typography>
                    </BillItem>
                </Grid>
                </Grid>
            }

            <LedgerUpdate
                open={ledgerUpdate} 
                setOpen={setLedgerUpdate} 
                editedItem = {editedItem}
                fetchLedgerDetails={fetchCustomerLedger}
            />
    </Box>
  )
}

export default Ledger