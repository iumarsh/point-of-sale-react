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
// import UpdateBillingModal from '../dashboard/UpdateBillingModal';
import EditTransactionItemModal from './editTransactionItemModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf-invoice-template';
import ActionDialog from '../../components/ActionDialog';
import { BASEURL } from '../../data/endpoints';
import _ from "lodash"
import Header from '../../components/Header';
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

export const FooterSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: "20px"
}));
export const RowSection = styled(Box)(({ theme, border = false }) => ({
    display: 'flex',
    padding: "20px",
    gap: "10px",
    marginBottom: "10px",
    border: border && ".5px solid #909090",
}));
export const ColumnSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: "column"
}));
const invoiceData = [
    { name: 'Item 1', quantity: 2, price: 10, total: 20 },
    { name: 'Item 2', quantity: 1, price: 15, total: 15 },
    // Add more items as needed
];

const EditTransaction = () => {
    const navigate = useNavigate();

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
        setTableData(transaction.items !== undefined ? transaction?.items?.map(x => ({
            ...x,
            quantity: x?.quantity/x?.than
        })) : []);
    }, [transaction])

    const fetchTransaction = async (id) => {
        try {
            const response = await axios.get(`${BASEURL}/api/transaction/${id}`);
            console.log('Data ****: ', response.data.transaction);
            setTransaction(response.data.transaction)
        } catch (error) {
            alert('Error')
        }
    }

    const [selectedItem, setSelectedItem] = useState(null);
    console.log('selectedItem: ', selectedItem);
    const [quantity, setQuantity] = useState('');
    const [than, setThan] = useState(1);
    const [rate, setRate] = useState("")
    const [discount, setDiscount] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [builty, setBuilty] = useState("")
    const [cnic, setCnic] = useState('');
    const [contact, setContact] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(moment().format('YYYY-MM-DD'));
    const [tableData, setTableData] = useState([]);
    console.log('tableData: ', tableData);
    const [deletedItems, setDeletedItems] = useState([]);
    const [openBillingModal, setOpenBillingModal] = useState(false);
    const [updatedItem, setUpdatedItem] = useState({})
    const [currentId, setCurrentId] = useState(1)
    const [categories, setCategories] = useState([])
    const [openPDFDialog, setOpenPDFDialog] = useState(false)

    useEffect(() => {
        if (selectedItem) {
            setRate(selectedItem?.price);
            setThan(1);
            setDiscount(0);
            setQuantity(1)
        }
    }, [selectedItem?.name])
    const handleAdd = () => {
        if (selectedItem && quantity !== '') {
            const newItem = {
                id: selectedItem?.id,
                category: selectedItem?.id, //need to change
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
        doc.text(`Builty: ${builty} `, 16, 60);
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
            const key = `${item?.category?.name || item?.name}-${item?.category?.categoryType || item?.type}`; // Unique key based on name and type
            const repeatedQuantity = Array.from({ length: parseInt(item.than) }, () => item.quantity);
            // const repeatedQuantity = Array(parseInt(item.than)).fill(item.quantity);  // => than times quantity => 2 than and 30m => [30,30]
            if (accumulation[key]) {
                accumulation[key].quantity = accumulation[key].quantity.concat(repeatedQuantity);
                accumulation[key].than = parseInt(accumulation[key].than) + parseInt(item.than);
            } else {
                accumulation[key] = {
                    name: item?.category?.name || item?.name,
                    quantity: repeatedQuantity,
                    than: parseInt(item.than), // Convert to integer if needed
                    type: item?.category?.categoryType || item?.type,
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
                id: index,
                name: x.Description,
                quantity: x.Quantity,
                type: x.UnitOfMeasurement,
                than: x.UnitOfMeasurement === "meter" ? x.Than : 1,
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
        let grandTotal = calculateGrandTotal()?.toLocaleString();
        doc.text(`Grand Total: ${grandTotal} pkr`, 140, doc.autoTable.previous.finalY + 10);

        // Add precautions and signature
        // doc.text('Precautions:', 20, doc.autoTable.previous.finalY + 40);
        // doc.text('1. This is a sample invoice.', 20, doc.autoTable.previous.finalY + 45);
        // doc.text('2. Payment is due within 30 days.', 20, doc.autoTable.previous.finalY + 50);

        // Add signature line
        doc.setFontSize(11);
        doc.text('Signature', 20, doc.autoTable.previous.finalY + 60);
        doc.text('Cash Received By: ', 20, doc.autoTable.previous.finalY + 70);


        return doc.save(`${customerName}-${invoiceDate}.pdf`);
    };

    const handleDelete = (index, item) => {
        const updatedData = [...tableData];
        updatedData.splice(index, 1);
        setTableData(updatedData);
        if (item !== null) setDeletedItems((prevItems) => [...prevItems, item])
    };
    const calculateGrandTotal = () => {
        return tableData.reduce((total, item) => total + item.price * (item.quantity * item.than), 0);
    };
    const updateItem = (id) => {
        setOpenBillingModal(true);
        let _editItem = tableData?.find(x => x?._id === id);
        setUpdatedItem(_editItem);
    }
    const handleUpdateCategory = (price, quantity, discount) => {
        setTableData(tableData?.map(x => {
            if (x?._id === updatedItem?._id) {
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
    const handleTransaction = async (pdfFlag = false) => {
        try {
            let _transactions = {
                items: tableData?.map(x => ({
                    ...x,
                    quantity: x?.quantity * x?.than,
                })),
                grandTotal: calculateGrandTotal(),
                customerName: customerName,
                deletedItems: deletedItems,
                builty: builty,
                contact: contact,
                cnic: cnic
            }


            //
            const response = await axios.put(`${BASEURL}/api/transaction/${transactionID}`, _transactions, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            //
            if (response) {
                console.log('response: ', response);
                pdfFlag && generatePDF(response?.data?.transaction?._id)
                clearData();
                setOpenPDFDialog(false);
                navigate('/transactions');
            } else {
                throw new Error("Something went wrong!");
            }

        } catch (error) {
            alert(error)
            console.log('error: ', error);
        }



    }
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
        setBuilty('')
    }
    // const onlyPerformTransaction = async () => {
    //     await performTransaction();
    //     clearData();
    //     setOpenPDFDialog(false);

    // }
    // const handleTransactionAndPDF = async () => {
    //     await performTransaction();
    //     generatePDF();
    //     clearData();
    //     setOpenPDFDialog(false);
    // }

    const fetchCategories = async () => {
        const url = new URL('/api/category', BASEURL)
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
        console.log(categories, "categories")
    }

    useEffect(() => {
        fetchCategories();
    }, [])
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
            <Box m="20px">
                <Header title="Mahmood Dari House" />
            </Box>
            <RowSection border>
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
                    disabled
                    InputLabelProps={{ shrink: true }}
                    size='small'
                    label="Invoice Date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                />
            </RowSection>
            <RowSection>
                <Autocomplete
                    sx={{
                        width: "70%",
                    }}
                    size='small'
                    options={categories} // Replace with your actual options
                    getOptionLabel={(option) => option.name}
                    value={selectedItem}
                    onChange={(event, newValue) => setSelectedItem(newValue)}
                    renderInput={(params) => <TextField  {...params} InputLabelProps={{ shrink: true }} label="Select Item" />}
                />

                <TextField
                    sx={{
                        width: "30%",
                    }}
                    type="number"
                    size='small'
                    label={CategoryLabels?.[selectedItem?.type] ? `Quantity (${CategoryLabels?.[selectedItem?.type]}) ` : "Quantity"}
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
                        if (e.target.value <= 0)
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

                <Button disabled={_.isEmpty(selectedItem)} sx={{ height: "36px", marginLeft: "10px" }} size="small" variant="contained" onClick={handleAdd}>
                    Add
                </Button>
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
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item._id !== undefined ? item?.category?.name : item.name}</TableCell>
                            <TableCell>{`${item.quantity} ${item?.type}`} </TableCell>
                            <TableCell>{item.than} </TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{(item.price * item.quantity * item.than).toLocaleString()}</TableCell>
                            <TableCell>{item.discount}</TableCell>
                            <TableCell>{((item.price * item.quantity * item.than) - (item.price * item.quantity * item.than * item.discount / 100)).toLocaleString()}</TableCell>
                            <TableCell>
                                <EditIcon data-item-id={item?._id} cursor="pointer" variant="contained" onClick={() => updateItem(item?._id)} />
                            </TableCell>
                            <TableCell>
                                <DeleteIcon cursor="pointer" variant="contained" onClick={() => handleDelete(index, item._id !== undefined ? item?._id : null)} />
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={2}></TableCell>
                        <TableCell colSpan={4}>Grand Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{calculateGrandTotal().toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <FooterSection>
                <Button disabled={tableData?.length === 0} size="medium" variant="contained" onClick={() => setOpenPDFDialog(true)}>Perform Transaction</Button>
            </FooterSection>
            <EditTransactionItemModal
                open={openBillingModal}
                setOpen={setOpenBillingModal}
                categoryName={updatedItem?.category?.name}
                categoryType="Hamza"
                categoryPrice={updatedItem?.price}
                categoryQuantity={updatedItem?.quantity}
                categoryTotal={(updatedItem?.price * updatedItem?.quantity).toLocaleString()}
                categoryDiscount={updatedItem?.discount}
                categoryId=""
                handleUpdateCategory={handleUpdateCategory}
            />
            <ActionDialog
                open={openPDFDialog}
                desc="Do you want the PDF as well"
                title="Transaction Dialog"
                handleClose={handleTransaction}
                submitHandler={() =>handleTransaction(true)} />
        </div>
    );
};

export default EditTransaction;