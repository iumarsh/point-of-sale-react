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


export const FooterSection = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: "20px"
}));
const invoiceData = [
  { name: 'Item 1', quantity: 2, price: 10, total: 20 },
  { name: 'Item 2', quantity: 1, price: 15, total: 15 },
  // Add more items as needed
];

const UserDashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [openBillingModal,setOpenBillingModal] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({})
  const [currentId, setCurrentId] = useState(1)
  const [categories,setCategories] = useState([])
  const [openPDFDialog, setOpenPDFDialog] = useState(false)
  const handleAdd = () => {
    if (selectedItem && quantity !== '') {
      const newItem = {
        id: currentId,
        name: selectedItem.name,
        quantity: parseFloat(quantity),
        price: selectedItem.price,
        type: selectedItem.type,
        discount: 0, // You can implement discount logic here
      };

      setTableData((prevData) => [...prevData, newItem]);
      setCurrentId(prev => prev + 1)
      // Clear inputs after adding
      setSelectedItem(null);
      setQuantity('');
    }
  };
  //PDF
  const generatePDF = () => {
  //   const doc = new jsPDF();

  //   // Example data
  //   const data = {
  //     outputType: 'save',
  //     returnJsPDFDocObject: true,
  //     fileName: 'Invoice_2022.pdf',
  //     orientationLandscape: false,
  //     compress: true,
  //     logo: {
  //       src: 'https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png',
  //       width: 53.33,
  //       height: 26.66,
  //       margin: { top: 0, left: 0 },
  //     },
  //     stamp: {
  //       inAllPages: true,
  //       src: 'https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg',
  //       width: 20,
  //       height: 20,
  //       margin: { top: 0, left: 0 },
  //     },
  //     business: {
  //       name: 'Business Name',
  //       address: 'Albania, Tirane ish-Dogana, Durres 2001',
  //       phone: '(+355) 069 11 11 111',
  //       email: 'email@example.com',
  //       email_1: 'info@example.al',
  //       website: 'www.example.al',
  //     },
  //     contact: {
  //       label: 'Invoice issued for:',
  //       name: 'Client Name',
  //       address: 'Albania, Tirane, Astir',
  //       phone: '(+355) 069 22 22 222',
  //       email: 'client@website.al',
  //       otherInfo: 'www.website.al',
  //     },
  //     invoice: {
  //       label: 'Invoice #: ',
  //       num: 19,
  //       invDate: 'Payment Date: 01/01/2021 18:12',
  //       invGenDate: 'Invoice Date: 02/02/2021 10:17',
  //       headerBorder: true,
  //       tableBodyBorder: true,
  //       header: [
  //         { title: '#', style: { width: 10 } },
  //         { title: 'Title', style: { width: 30 } },
  //         { title: 'Description', style: { width: 80 } },
  //         { title: 'Price' },
  //         { title: 'Quantity' },
  //         { title: 'Unit' },
  //         { title: 'Total' },
  //       ],
  //       table: Array.from(Array(15), (item, index) => [
  //         index + 1,
  //         'There are many variations ',
  //         'Lorem Ipsum is simply dummy text dummy text ',
  //         200.5,
  //         4.5,
  //         'm2',
  //         400.5,
  //       ]),
  //       additionalRows: [
  //         {
  //           col1: 'Total:',
  //           col2: '145,250.50',
  //           col3: 'ALL',
  //           style: { fontSize: 14 },
  //         },
  //         {
  //           col1: 'VAT:',
  //           col2: '20',
  //           col3: '%',
  //           style: { fontSize: 10 },
  //         },
  //         {
  //           col1: 'SubTotal:',
  //           col2: '116,199.90',
  //           col3: 'ALL',
  //           style: { fontSize: 10 },
  //         },
  //       ],
  //       invDescLabel: 'Invoice Note',
  //       invDesc:
  //         'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.',
  //     },
  //     footer: {
  //       text: 'The invoice is created on a computer and is valid without the signature and stamp.',
  //     },
  //     pageEnable: true,
  //     pageLabel: 'Page ',
  //   };
  //   const columns = ['ID', 'Name', 'Quantity', 'Price', 'Total'];
  // const alpha = [
  //   [1, 'Item 1', 2, 10, 20],
  //   [2, 'Item 2', 3, 15, 45],
  //   // Add more rows as needed
  // ];


  //   doc.autoTable({
  //     head: [columns],
  //     body: alpha,
  //   });
  
  

  //   // Add additional features if needed

  //   doc.save("da.pdf");

  const doc = new jsPDF();

  // Add header with brand name and background color
  doc.setFillColor(0, 0, 0); // Grey background color
  doc.rect(0, 0, doc.internal.pageSize.width, 20, 'F'); // Header rectangle
  doc.setTextColor(255, 255, 255); // White text color
  doc.setFontSize(18);
  doc.text('Mahmood Dari House', 20, 11);

  // Add customer info
  doc.setTextColor(0, 0, 0); // Reset text color
  doc.setFontSize(9);
  // doc.text('Customer Name: John Doe', 14, 40);
  // doc.text('Address: 123 Main St, City', 14, 45);
  // doc.text('Address: 123 Main St, City', 14, 50);
  // doc.text('Transaction Id: 123 Main St, City', 14, 55)
  

  //smaple

  const header = [
    { title: "#", style: { width: 10 } },
    { title: "Name", style: { width: 30 } },
    { title: "Quantity", style: { width: 20 } },
    { title: "Price", style: { width: 20 } },
    { title: "Discount", style: { width: 20 } },
  
  ]
  //
  // Add items grid
  const columns = ['ID', 'Item', 'Quantity', 'Price', 'UOM'];
  const data = tableData;

  doc.autoTable({
    head: [columns],
    body: tableData.map(x => ({
      id: x.id,
      name: x.name,
      quantity: x.quantity,
      price: x.price.toLocaleString(),
      type: x.type,
    })).map(row => {
      console.log('row: ', row);
      return Object.values(row)
    }),
    startY: 25, // Adjust the starting position based on your header size
    // theme: 'grid', // Choose a table theme (optional)

  });

  // Add pricing information
  const grandTotal = calculateGrandTotal().toLocaleString()
  doc.text(`Grand Total: ${grandTotal} pkr`, 150, doc.autoTable.previous.finalY + 10);

  // Add precautions and signature
  // doc.text('Precautions:', 20, doc.autoTable.previous.finalY + 40);
  // doc.text('1. This is a sample invoice.', 20, doc.autoTable.previous.finalY + 45);
  // doc.text('2. Payment is due within 30 days.', 20, doc.autoTable.previous.finalY + 50);

  // Add signature line
  doc.text('Signature', 20, doc.autoTable.previous.finalY + 60);


  return doc.save('invoice.pdf');
  };

  //

  const handleDelete = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };
  const calculateGrandTotal = () => {
    return tableData.reduce((total, item) => total + item.price * item.quantity, 0);
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
  const performTransaction = async () => {
    try {
      let _transactions = {
        items: tableData,
        grandTotal: calculateGrandTotal(),
        customerName: customerName
      }
  
      const url = new URL('/api/transaction',BASEURL)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_transactions),
      });
      if (response.ok) {
        setTableData([])
      }else{
        throw new Error("Something went wrong!");
      }

    } catch (error) {
      alert(error)
      console.log('error: ', error);
    }
    

    
  }
  const onlyPerformTransaction = async () => {
    performTransaction();
    setOpenPDFDialog(false);
  }
  const handleTransactionAndPDF = async () => {
    await performTransaction();
    generatePDF();
    setOpenPDFDialog(false);
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
    console.log('_transactions: ', _transactions);
    
  }
  useEffect(()=> {
    fetchCategories();
    fetchTransactions();
  },[])
  const CategoryLabels = {
    meter: "Meters",
    dozen: "Dozens",
    pair: "Pairs",
    set: "Sets",
    piece: "Pieces"
  }
  return (
    <div style={{
            margin: "10px"
    }}>
      <Autocomplete
        sx={{
            width: "40%",
            marginBottom: "10px"
        }}
        size='small'
        options={categories} // Replace with your actual options
        getOptionLabel={(option) => option.name}
        value={selectedItem}
        onChange={(event, newValue) => setSelectedItem(newValue)}
        renderInput={(params) => <TextField {...params} label="Select Item" />}
      />

      <TextField
        sx={{
            width: "40%",
            marginBottom: "10px"
        }}
        type="number"
        size='small'
        label={CategoryLabels?.[selectedItem?.type] || "Quantity"} 
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <Button sx={{height: "36px", marginLeft: "10px"}} size="small" variant="contained" onClick={handleAdd}>
        Add
      </Button>
      <FooterSection>
          <TextField
            sx={{
                width: "40%",
                marginBottom: "10px"
            }}
            size='small'
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
       </FooterSection>

      <Table sx={{ maxHeight: "100vh", maxHeight: "100vh", overflowY: "scroll"}}>
        <TableHead>
          <TableRow>
            <TableCell>Sr. No</TableCell>
            <TableCell>Item Description</TableCell>
            <TableCell>Quantity</TableCell>
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
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{(item.price * item.quantity).toLocaleString()}</TableCell>
              <TableCell>{item.discount}</TableCell>
              <TableCell>{(item.price * item.quantity - item.price * item.quantity * item.discount/100).toLocaleString()}</TableCell>
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
          </TableRow>
        </TableBody>
      </Table>

      <FooterSection>
            <Button size="medium" variant="contained" onClick={()=> setOpenPDFDialog(true)}>Perform Transaction</Button>
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
          desc="Do you want the PDF as well" 
          title="Transaction Dialog" 
          handleClose={onlyPerformTransaction} 
          submitHandler={handleTransactionAndPDF}/>
    </div>
  );
};

export default UserDashboard;
