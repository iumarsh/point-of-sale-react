import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { _categoryList } from "../../data/CategoryList";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const CategoryList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories , setCategories] = useState([])
  console.log('categories: ', categories);
  const columns = [
    { field: "_id", headerName: "ID", flex:1},
    {
      field: "name",
      headerName: "Name",
      headerAlign: "left",
      align: "left",
      flex: 1.5,
    },
    {
      field: "categoryType",
      headerName: "Type",
      cellClassName: "name-column--cell",
      flex: 1,

    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,

    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      flex: 1,

    },
    
    // {
    //   field: "accessLevel",
    //   headerName: "Access Level",
    //   flex: 1,
    //   renderCell: ({ row: { access } }) => {
    //     return (
    //       <Box
    //         width="60%"
    //         m="0 auto"
    //         p="5px"
    //         display="flex"
    //         justifyContent="center"
    //         backgroundColor={
    //           access === "admin"
    //             ? colors.greenAccent[600]
    //             : access === "manager"
    //             ? colors.greenAccent[700]
    //             : colors.greenAccent[700]
    //         }
    //         borderRadius="4px"
    //       >
    //         {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
    //         {access === "manager" && <SecurityOutlinedIcon />}
    //         {access === "user" && <LockOpenOutlinedIcon />}
    //         <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
    //           {access}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
  ];

  const BASEURL = 'http://localhost:5000'
  useEffect(()=> {
    fetchCategories();
  },[])

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
      ...x,
      id: x?._id,
    })) || [])
  }

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={categories} columns={columns} />
      </Box>
    </Box>
  );
};

export default CategoryList;
