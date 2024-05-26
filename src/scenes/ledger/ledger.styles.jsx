import styled from "@emotion/styled";
import { Box, Button, Paper } from "@mui/material";

export const RowSection = styled(Box)(({theme, border=false}) => ({
    display: 'flex',
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
    justifyContent: "center"
    
  }));
export const FetchButton = styled(Button)(({theme, border=false}) => ({
   width: "200px",
   size: "small",
   height: "36px",
  }));

export const BillItem = styled(Paper)(({theme, border=false, paymentPending=false}) => ({
    padding: "12px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: paymentPending ? '#FF7F7F' : '#82f28f'
}));

export const ActionItems = styled(Box)(({theme, border=false}) => ({
    display: "flex",
    gap: "10px",
    alignItems: "center"
}));
