import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import styled from '@emotion/styled';
import { BASEURL } from '../../data/endpoints';
import Header from '../../components/Header';
import moment from 'moment'
import { useParams } from 'react-router-dom';
import axios from '../../utility/axiosConfig'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-invoice-template';
import Button from '@mui/material/Button';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

export const RowSection = styled(Box)(({ theme, border = false }) => ({
    display: 'flex',
    padding: "20px",
    gap: "10px",
    marginBottom: "10px",
    border: border && ".5px solid #909090",
}));

export const FooterSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "20px"
}));

const ViewTransaction = () => {
    const { transactionID } = useParams();
    const [transaction, setTransaction] = useState({});

    useEffect(() => {
        fetchTransaction(transactionID)
    }, [])

    useEffect(() => {
        setCustomerName(transaction?.customerName)
        setCnic(transaction?.cnic)
        setContact(transaction?.contact)
        setInvoiceDate(moment.utc(transaction.createdAt, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('YYYY-MM-DD'))
        setCustomerName(transaction?.customerName)
        setBuilty(transaction?.builty)
        setContact(transaction?.contact)
        setReceiving(transaction?.receiving)
        if(transaction?.transactionType == "Booking"){
            setBookingFlag(true);
            setCashFlag(false)
        }else {
            setBookingFlag(false);
            setCashFlag(true)
        }
        setCnic(transaction?.cnic)
        setTableData(transaction.items !== undefined ? transaction?.items?.map(x => ({
            ...x,
            quantity: x?.quantity/x?.than
        })) : []);
    }, [transaction])

    const fetchTransaction = async (id) => {
        try {
            const response = await axios.get(`/transaction/${id}`);
            console.log('Data ****: ', response.data.transaction);
            setTransaction(response.data.transaction)
        } catch (error) {
            alert('Error')
        }
    }

    const [customerName, setCustomerName] = useState('');
    const [builty, setBuilty] = useState('')
    const [cnic, setCnic] = useState('');
    const [receiving,setReceiving] = useState(0);
    const [cashFlag, setCashFlag] = useState(false);
    const [bookingFlag, setBookingFlag] = useState(false)
    const [contact, setContact] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(moment().format('YYYY-MM-DD'));
    const [tableData, setTableData] = useState([]);


    const calculateGrandTotal = () => {
        return tableData.reduce((total, item) => total + item.price * (item.quantity * item.than), 0);
    };

    const handleTransactionAndPDF = async () => {
        generatePDF();
    }

    const generatePDF = () => {

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
        doc.text(`Client Name: ${customerName}`, 16, 25);
        doc.text(`CNIC: ${cnic}`, 16, 30);
        doc.text(`Contact No: ${contact}`, 16, 35);
        doc.text(`Date: ${invoiceDate}`, 16, 40);
        doc.text(`Shop No: 0324-7416565 `, 16, 45);
        doc.text('Address: Mehmood Dari Store, Salman Heights, GT. Road near HBL bank Gujranwnala', 16, 50)

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
            console.log(item, "item")
            const key = `${item.category.name}-${item.type}`; // Unique key based on name and type
            const repeatedQuantity = Array.from({ length: parseInt(item.than) }, () => item.quantity);
            // const repeatedQuantity = Array(parseInt(item.than)).fill(item.quantity);  // => than times quantity => 2 than and 30m => [30,30]
            if (accumulation[key]) {
                accumulation[key].quantity = accumulation[key].quantity.concat(repeatedQuantity);
                accumulation[key].than = parseInt(accumulation[key].than) + parseInt(item.than);
            } else {
                accumulation[key] = {
                    name: item.category.name,
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
                Total: (parseFloat(item.quantity?.reduce((acc, curr) => acc + curr, 0)) * parseFloat(item.price))?.toLocaleString(),
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
                id: index + 1,
                name: x.Description,
                quantity: x.Quantity,
                type: x.UnitOfMeasurement,
                than: x.UnitOfMeasurement === "meter" ? x.Than : x.Quantity,
                uom: x.UnitOfMeasurement === "meter" ? 'Th' : x.UnitOfMeasurement,
                price: x.Price,
                total: x.Total,
            })).map(row => {
                return Object.values(row)
            }),
            startY: 60, // Adjust the starting position based on your header size
            // theme: 'grid', // Choose a table theme (optional)
        });

        // Add pricing information
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80); // Reset text color
        let grandTotal = calculateGrandTotal()?.toLocaleString();
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

    return (
        <div style={{
            margin: "10px"
        }}>
            <Box m="20px">
                <Header title="Mahmood Dari House" />
            </Box>
            <RowSection border className='view-transaction-fields'>
                <TextField
                    sx={{
                        width: "30%",
                    }}
                    size='small'
                    label="Builty No."
                    value={builty}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setBuilty(e.target.value)}
                    disabled
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
                    disabled
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
                    disabled
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
                    disabled
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
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    disabled
                />
            </RowSection>
            <RowSection padding="0px 0px 0px 20px !important">
              <TextField
                  sx={{
                      width: "60%",
                  }}
                  size='small'
                  label="Receiving Amount"
                  value={receiving}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setReceiving(e.target.value)}
              />
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={cashFlag} disabled/>} label="Cash" />
              </FormGroup>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={bookingFlag} disabled/>} label="Booking" />
              </FormGroup>
            </RowSection>

            <Table sx={{ maxHeight: "100vh", overflowY: "scroll" }}>
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item?.category?.name}</TableCell>
                            <TableCell>{`${item.quantity} ${item?.type}`} </TableCell>
                            <TableCell>{item.than} </TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{(item.price * item.quantity * item.than).toLocaleString()}</TableCell>
                            <TableCell>{item.discount}</TableCell>
                            <TableCell>{((item.price * item.quantity * item.than) - (item.price * item.quantity * item.than * item.discount / 100)).toLocaleString()}</TableCell>
                        </TableRow>

                    ))}
                    <TableRow>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell colSpan={4}>Grand Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{calculateGrandTotal().toLocaleString()}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <FooterSection>
                <Button size="medium" variant="contained" onClick={handleTransactionAndPDF}>Download</Button>
            </FooterSection>
        </div>
    );
};

export default ViewTransaction;