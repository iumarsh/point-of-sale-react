import { Button } from '@mui/base'
import { TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import Header from '../../components/Header'
import _ from "lodash"
import { RowSection, FetchButton } from './ledger.styles'

const Ledger = () => {
    const [contactNo, setContactNo] = useState('')

    const fetchCustomerLedger = () => {

    }
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
                <FetchButton disabled={_.isEmpty(contactNo)} size="medium" variant="contained" onClick={fetchCustomerLedger}>Fetch Details</FetchButton>
            </RowSection>
    </Box>
  )
}

export default Ledger