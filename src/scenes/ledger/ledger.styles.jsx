import styled from "@emotion/styled";
import { Box, Button } from "@mui/material";

export const RowSection = styled(Box)(({theme, border=false}) => ({
    display: 'flex',
    gap: "10px",
    marginBottom: "10px",
    alignItems: "center",
    justifyContent: "center"
    
  }));
export const FetchButton = styled(Button)(({theme, border=false}) => ({
   width: "150px",
   size: "small",
   height: "36px",
  }));