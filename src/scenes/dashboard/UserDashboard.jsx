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
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import UpdateBillingModal from './UpdateBillingModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-invoice-template';
import ActionDialog from '../../components/ActionDialog';
import { BASEURL } from '../../data/endpoints';
import _ from "lodash"
import Header from '../../components/Header';
import moment from 'moment'
import axios from 'axios';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';


export const FooterSection = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "20px"
}));
export const RowSection = styled(Box)(({theme, border=false, padding=false}) => ({
  display: 'flex',
  padding: padding && padding || "20px",
  gap: "10px",
  border: border && ".5px solid #909090",
}));
export const ColumnSection = styled(Box)(({theme}) => ({
  display: 'flex',
  flexDirection: "column"
}));
const invoiceData = [
  { name: 'Item 1', quantity: 2, price: 10, total: 20 },
  { name: 'Item 2', quantity: 1, price: 15, total: 15 },
  // Add more items as needed
];

const UserDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [than, setThan] = useState(1);
  const [rate, setRate] = useState("")
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [builty, setBuilty] = useState('')
  const [cnic, setCnic] = useState('');
  const [contact, setContact] = useState('');
  const [transactionLoading, setTransactionLoading] = useState(false)
  // const [invoiceDate, setInvoiceDate] = useState(moment().format('DD-MM-YYYY'));
  const [tableData, setTableData] = useState([]);
  const [openBillingModal,setOpenBillingModal] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({})
  const [currentId, setCurrentId] = useState(1)
  const [categories,setCategories] = useState([])
  const [openPDFDialog, setOpenPDFDialog] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [cashFlag, setCashFlag] = useState(true);
  const [bookingFlag, setBookingFlag] = useState(false)
  const [receivingAmount, setReceivingAmount] = useState('')
  const invoiceDate = moment().format('YYYY-MM-DD');

  


  //

  useEffect(()=> {
      if(selectedItem)
        {
          setRate(selectedItem?.price);
          setThan(1);
          setDiscount(0);
          setQuantity(1)
        }
  }, [selectedItem?.name])
  const handleAdd = () => {
    if (selectedItem && quantity !== '') {
      const newItem = {
        id: currentId,
        category: selectedItem?.id,
        name: selectedItem.name,
        quantity: parseFloat(quantity),
        than: than,
        price: rate,
        type: selectedItem.type,
        discount: discount, // You can implement discount logic here
      };

      setTableData((prevData) => [...prevData, newItem]);
      setCurrentId(prev => prev + 1)
      // Clear inputs after adding
      // setSelectedItem(null);
      // setQuantity('');
      // setThan(1)
    }
  };
  //PDF
  const generatePDF = (transactionId = null) => {

  const pageSize = { width: 210, height: 297 }; 
  const doc = new jsPDF({
    orientation: 'portrait', // or 'landscape'
    unit: 'mm',
    format: [pageSize.width, pageSize.height]
  });

  // Add header with brand name and background color
  doc.setFillColor(0, 0, 0); // Grey background color
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F'); // Header rectangle
  doc.setTextColor(255, 255, 255); // White text color
  doc.setFontSize(18);
  doc.text('Mahmood Dari House', 20, 11);

  // Add customer info
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80); // Reset text color
  
  doc.setFontSize(11);
  doc.text(`Transaction Id: ${transactionId || ""}`, 16, 25);//
  doc.text(`Client Name: ${customerName}`, 16, 30);
  doc.text(`CNIC: ${cnic}`, 16, 35);
  doc.text(`Contact No: ${contact}`, 16, 40);
  doc.text(`Date: ${invoiceDate}`, 16, 45);
  doc.text(`Shop No: 0324-7416565 `, 16, 50);
  doc.text('Address: Mehmood Dari Store, Salman Heights, GT. Road near HBL bank Gujranwnala', 16, 55)
  doc.text(`Builty: ${builty}`, 16, 60)

  doc.setTextColor(0); // Reset text color to black
  doc.setFont('helvetica', 'normal');
  // doc.text('Address: 123 Main St, City', 14, 45);
  // doc.text('Address: 123 Main St, City', 14, 50);
  // doc.text('Transaction Id: 123 Main St, City', 14, 55)
  

  //smaple

  //Data formulation

  let accumulation = {};
  
  

  //
  tableData.forEach(item => {
    const key = `${item.name}-${item.type}`; // Unique key based on name and type
    const repeatedQuantity = Array.from({ length: parseInt(item.than) }, () => item.quantity);  
    // const repeatedQuantity = Array(parseInt(item.than)).fill(item.quantity);  // => than times quantity => 2 than and 30m => [30,30]
    if (accumulation[key]) {
        accumulation[key].quantity = accumulation[key].quantity.concat(repeatedQuantity);
        accumulation[key].than =  parseInt(accumulation[key].than) + parseInt(item.than);
    } else {
        accumulation[key] = {
            name: item.name,
            quantity: repeatedQuantity,
            than: parseInt(item.than), // Convert to integer if needed
            type: item.type,
            price: item.price,
            discount: item.discount
        };
    }
});
// Create the desired output format
const result = Object.values(accumulation || {}).map(item => {
   return {
    Description: `${item.name} (${item.quantity?.map(x => x)?.join(", ")})`,
    Quantity: `${item.quantity?.reduce((acc, curr) => acc + curr, 0)}`,
    Than: item.than,
    UnitOfMeasurement: item.type,
    Price: item.price,
    Total: (parseFloat(item.quantity?.reduce((acc, curr) => acc + curr, 0)) *parseFloat(item.price))?.toLocaleString(),
    // Total: (item.quantity * parseInt(item.price)).toLocaleString()
   }
});


  const header = [
    { title: "#", style: { width: 10 } },
    { title: "Description", style: { width: 80 } },
    { title: "Quantity", style: { width: 10 } },
    { title: "Price", style: { width: 10 } },
    { title: "Discount", style: { width: 10 } },
  
  ]
  //
  // Add items grid
  const columns = ['ID', 'Description', 'Qtn', 'UoM', 'Pack', 'UoM', 'Price', 'Total (Rs)'];
  const data = tableData;

  doc.autoTable({
    head: [columns],
    body: result.map((x, index) => ({
      id: index,
      name: x.Description,
      quantity: x.Quantity,
      type: x.UnitOfMeasurement,
      than: x.UnitOfMeasurement === "meter" ?  x.Than : x.Quantity,
      uom: x.UnitOfMeasurement === "meter" ? 'Th' : x.UnitOfMeasurement,
      price: x.Price,
      total: x.Total,
    })).map(row => {
      return Object.values(row)
    }),
    startY: 70, // Adjust the starting position based on your header size
    // theme: 'grid', // Choose a table theme (optional)

  });

  // Add pricing information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80); // Reset text color
  let grandTotal =  calculateGrandTotal()?.toLocaleString();
  doc.text(`Grand Total: ${grandTotal} pkr`, 140, doc.autoTable.previous.finalY + 10);

  // Add precautions and signature
  // doc.text('Precautions:', 20, doc.autoTable.previous.finalY + 40);
  // doc.text('1. This is a sample invoice.', 20, doc.autoTable.previous.finalY + 45);
  // doc.text('2. Payment is due within 30 days.', 20, doc.autoTable.previous.finalY + 50);

  // Add signature line
  let _packTotal = result.reduce((total, item) => total + (item.UnitOfMeasurement === "meter" ? parseInt(item.Than) : parseInt(item.Quantity)), 0);
  doc.setFontSize(11);
  doc.text(`Pack Total: ${_packTotal}`, 20, doc.autoTable.previous.finalY + 35);
  doc.text('Signature', 20, doc.autoTable.previous.finalY + 60);
  doc.text('Cash Received By: ', 20, doc.autoTable.previous.finalY + 70);


  return doc.save(`${customerName}-${invoiceDate}.pdf`);
  };

  //

  const handleDelete = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };
  const calculateGrandTotal = () => {
    return tableData.reduce((total, item) => total + item.price * (item.quantity * parseInt(item.than)), 0);
  };
  const updateItem = (id) => {
      setOpenBillingModal(true);
      let _editItem = tableData?.find(x => x?.id === id);
      setUpdatedItem(_editItem);
  }
  const handleUpdateCategory = (price, quantity, discount) => {
      setTableData(tableData?.map(x => {
        if(x?.id === updatedItem?.id){
          return {
            ...x,
            price: price,
            quantity: quantity,
            discount: discount
          }
        }
        return {
          ...x
        }
      }))
      setOpenBillingModal(false)
  }
  // const performTransaction = async () => {
  //   try {
  //     let _transactions = {
  //       items: tableData?.map(x => ({
  //         ...x,
  //         quantity: x?.quantity * x?.than,
  //       })),
  //       grandTotal: calculateGrandTotal(),
  //       customerName: customerName
  //     }
  
  //     const response = await axios.post(`${BASEURL}/api/transaction`, _transactions, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     console.log('response: ', response);
  //     if (response) {
        
  //       console.log('response: ', response);
  //       console.log('response?.data?.transaction?._id: ', response?.data?.transaction?._id);
  //       setTransactionId(response?.data?.transaction?._id)
  //     }else{
  //       throw new Error("Something went wrong!");
  //     }

  //   } catch (error) {
  //     alert(error)
  //     console.log('error: ', error);
  //   }
    

    
  // }

  //

    // const handleAddCategory = async () => {
  //   const category = {
  //           name,
  //           categoryType: type,
  //           quantity,
  //           additionalInfo,
  //           price,
            
  //       }
  //   const response = await axios.post(`${BASEURL}/api/category`, category, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   console.log('response: ', response);
  // }
  //
  const clearData = () => {
    setTableData([])
    setThan(1);
    setSelectedItem(null)
    setCustomerName("")
    setContact("")
    setCnic("")
    setRate("")
    setDiscount("")
    setQuantity("")
    setBuilty("")
  }
  // const onlyPerformTransaction = async () => {
  //   await performTransaction();
  //   clearData();
  //   setOpenPDFDialog(false);
    
  // }
  const handleTransaction = async (triggerPdf = false) => {
    try {
      setTransactionLoading(true)
      let _transactions = {
        items: tableData?.map(x => ({
          ...x,
          quantity: x?.quantity * x?.than,
        })),
        grandTotal: calculateGrandTotal(),
        customerName: customerName,
        builty: builty,
        cnic: cnic,
        contact: contact,
        receiving: bookingFlag ? parseFloat(receivingAmount) : 0,
        transactionType: bookingFlag ? "Booking" : "Cash", 
      }
  
      const response = await axios.post(`${BASEURL}/api/transaction`, _transactions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response: ', response);
      if (response) {
        
        console.log('response: ', response);
        console.log('response?.data?.transaction?._id: ', response?.data?.transaction?._id);
        triggerPdf && generatePDF(response?.data?.transaction?._id);
        clearData();
        setOpenPDFDialog(false);
        setTransactionLoading(false)
      }else{
        setTransactionLoading(false)
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      setTransactionLoading(false)
      alert(error)
      console.log('error: ', error);
    }
    

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
    
  }
  useEffect(()=> {
    fetchCategories();
    fetchTransactions();
    // setInvoiceDate(moment().format('DD-MM-YYYY'))
  },[])
  useEffect(()=> {
    if(cashFlag)
      setReceivingAmount('')
  },[cashFlag])
  const CategoryLabels = {
    meter: "Meters",
    dozen: "Dozens",
    pair: "Pairs",
    set: "Sets",
    piece: "Pieces"
  }

  const handleCashFlagChange = () => {
    setCashFlag(prevCashFlag => {
      if (!prevCashFlag) {
        setBookingFlag(false);
      }
      return !prevCashFlag;
    });
  };

  const handleBookingFlagChange = () => {
    setBookingFlag(prevBookingFlag => {
      if (!prevBookingFlag) {
        setCashFlag(false);
      }
      return !prevBookingFlag;
    });
  };


  return (
    <div style={{
            margin: "10px"
    }}>
      <Box m="20px">
        <Header title="Mahmood Dari House"/>
      </Box>
      <RowSection mb={1} border>
        <TextField
              sx={{
                  width: "30%",
              }}
              size='small'
              label="Builty No."
              value={builty}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setBuilty(e.target.value)}
            />
          <TextField
            sx={{
                width: "30%",
            }}
            size='small'
            label="Customer Name"
            value={customerName}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            sx={{
                width: "30%",
            }}
            size='small'
            label="Customer CNIC"
            value={cnic}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setCnic(e.target.value)}
          />
          <TextField
            sx={{
                width: "30%",
            }}
            size='small'
            label="Contact No:"
            InputLabelProps={{ shrink: true }}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <TextField
            sx={{
                width: "30%",
            }}
            type="date"
            InputLabelProps={{ shrink: true }}
            size='small'
            label="Invoice Date"
            value={invoiceDate}
            // onChange={(e) => setInvoiceDate(e.target.value)}
          />
      </RowSection>
      <RowSection mb={1}>
        <Autocomplete
          sx={{
              width: "70%",
          }}
          size='small'
          options={categories} // Replace with your actual options
          getOptionLabel={(option) => option.name}
          value={selectedItem}
          onChange={(event, newValue) => setSelectedItem(newValue)}
          renderInput={(params) => <TextField  {...params} InputLabelProps={{ shrink: true }}  label="Select Item" />}
        />

        <TextField
          sx={{
              width: "30%",
          }}
          type="number"
          size='small'
          label={CategoryLabels?.[selectedItem?.type] ? `Quantity (${CategoryLabels?.[selectedItem?.type]}) `  :  "Quantity"} 
          value={quantity}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setQuantity(e.target.value)}
        />
         
        <TextField
          sx={{
              width: "15%",
          }}
          type="number"
          size='small'
          label={"Packing (Th)"} 
          value={than}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            if(e.target.value <=0)
              setThan(1);
            else
            setThan(e.target.value)
          }}
        />
        <TextField
          sx={{
              width: "30%",
          }}
          type="number"
          size='small'
          label={"Price"} 
          value={rate}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setRate(e.target.value)}
        />
        <TextField
          sx={{
              width: "30%",
          }}
          type="number"
          size='small'
          label={"Discount"} 
          value={discount}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setDiscount(e.target.value)}
        />
        
        <Button disabled={ _.isEmpty(selectedItem)} sx={{height: "36px", marginLeft: "10px"}} size="small" variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </RowSection>
      <RowSection padding="0px 10px 20px 20px">
              <TextField
                  sx={{
                      width: "60%",
                  }}
                  size='small'
                  label="Receiving Amount"
                  value={receivingAmount}
                  disabled={cashFlag}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setReceivingAmount(e.target.value)}
              />
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={cashFlag} onChange={handleCashFlagChange}/>} label="Cash" />
              </FormGroup>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={bookingFlag} onChange={handleBookingFlagChange} />} label="Booking" />
              </FormGroup>
            </RowSection>
      
      

      <Table sx={{ maxHeight: "100vh", maxHeight: "100vh", overflowY: "scroll"}}>
        <TableHead style={{
          backgroundColor: "#BFBF00",
        }}>
          <TableRow>
            <TableCell>Sr. No</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Packing (Than)</TableCell>
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
              <TableCell>{`${item.quantity} ${item?.type}`} </TableCell>
              <TableCell>{item.than} </TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{(item.price * item.quantity * item.than).toLocaleString()}</TableCell>
              <TableCell>{item.discount}</TableCell>
              <TableCell>{((item.price * item.quantity * item.than) - (item.price * item.quantity * item.than  * item.discount/100)).toLocaleString()}</TableCell>
              <TableCell>
                <EditIcon cursor="pointer" variant="contained" onClick={() => updateItem(item?.id)}/>
              </TableCell>
              <TableCell>
                <DeleteIcon cursor="pointer" variant="contained" onClick={() => handleDelete(index)}/>
              </TableCell>
            </TableRow>

          ))}
           <TableRow>
            <TableCell colSpan={2}></TableCell>
            <TableCell colSpan={4}>Grand Total</TableCell>
            <TableCell>{calculateGrandTotal().toLocaleString()}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <FooterSection>
            <Button disabled={tableData?.length === 0} size="medium" variant="contained" onClick={()=> setOpenPDFDialog(true)}>Perform Transaction</Button>
      </FooterSection>
      <UpdateBillingModal 
        open={openBillingModal} 
        setOpen={setOpenBillingModal}
        categoryName = {updatedItem?.name}
        categoryType = "Hamza"
        categoryPrice = {updatedItem?.price}
        categoryQuantity = {updatedItem.quantity}
        categoryTotal = {(updatedItem.price * updatedItem.quantity).toLocaleString()}
        categoryDiscount = {updatedItem.discount}
        categoryId=""
        handleUpdateCategory={handleUpdateCategory}
        />
        <ActionDialog 
          open={openPDFDialog} 
          disabled = {transactionLoading}
          desc="Do you want the PDF as well" 
          title="Transaction Dialog" 
          handleClose={handleTransaction} 
          submitHandler={() => handleTransaction(true)}/>
    </div>
  );
};

export default UserDashboard;
