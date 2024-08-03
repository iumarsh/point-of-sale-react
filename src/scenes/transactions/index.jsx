import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { _categoryList } from "../../data/CategoryList";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import moment from 'moment'
import { BASEURL } from "../../data/endpoints";
import axios from '../../utility/axiosConfig'

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';


import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false);
  console.log('transactions: ', transactions);

  const navigate = useNavigate();

  const handleEditTransaction = (id) => {
    navigate(`/transaction/edit/${id}`)
  }
  
  const handleViewTransaction = (id) => {
    navigate(`/transaction/view/${id}`)
  }

  const handleDeleteTransaction = (id) => {
    console.log('id: ', id);
    deleteTransaction(id)
  }

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/transaction/${id}`);
      fetchTransactions()
    } catch (error) {
      alert('Error')
    }
  }

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    {
      field: "items",
      headerName: "Items",
      headerAlign: "left",
      align: "left",
      flex: 1.5,
    },
    {
      field: "createdDate",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "customerName",
      headerName: "Customer",
      type: "number",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        // const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="View"
            className="textPrimary"
            onClick={() => handleViewTransaction(id)}
            color="inherit"
          />
          ,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditTransaction(id)}
            color="inherit"
          />
          ,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteTransaction(id)}
            color="inherit"
          />,
        ];
      },
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

  useEffect(() => {
    fetchTransactions();
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      // const url = new URL('/api/transaction', BASEURL)
      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Accept': 'application/json',
      //   },
      // });

      const response = await axios.get('/transaction', {
        headers: {
          'Accept': 'application/json'
        }
      })
      const _transactions = response?.data;
      setTransactions(_transactions?.transactions?.map(x => ({
        ...x,
        items: x?.items?.map(item => item?.category?.name)?.join(", "),
        createdDate: moment(x?.createdAt).format("DD/MM/YYYY"),
        id: x?._id,
        price: x?.grandTotal?.toLocaleString(),
        receiving: x?.receiving || 0,
        transactionType: x?.transactionType,
      })) || [])
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  //  const fetchTransactions = async () => {
  //     const url = new URL('/api/transaction',BASEURL)
  //     // const response = await fetch(url, {
  //       //   method: 'GET',
  //       //   headers: {
  //         //     'Accept': 'application/json',
  //         //   },
  //         // });
  //         // console.log('url: ', url);

  //     let result = await axios.get(url)
  //     console.log('Data: ', result);
  //     // const _transactions = await response?.json()
  //     // console.log('_transactions: ', _transactions);
  //     // console.log('_transactions?.transactions: ', _transactions?.transactions);
  //     // setTransactions(_transactions?.transactions?.map(x => ({
  //     //   ...x,
  //     //   items: x?.items?.map( item => item?.name)?.join(", "),
  //     //   createdDate: moment(x?.createdAt).format("DD/MM/YYYY"),
  //     //   id: x?._id,
  //     //   price: x?.grandTotal?.toLocaleString()

  //   }
  return (
    <Box m="20px">
      <Header title="Mahmood Dari House" subtitle="Transaction Details" />
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
        <DataGrid 
          loading={loading} 
          checkboxSelection 
          rows={transactions} 
          columns={columns}
          // getRowClassName={(params) =>  params?.row?.receiving > 0 ? 'cold': 'cold'}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
