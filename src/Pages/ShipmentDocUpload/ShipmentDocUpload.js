import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { ShipmentDocColumns } from '../../utils/datatablesource'
import DeleteIcon from '@mui/icons-material/Delete';
import { SnackbarContext } from '../../Contexts/SnackbarContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import newRequest from '../../utils/userRequest'

import ShipmentDocUploadPopup from '../../Components/ShipmentDocUploadPopup/ShipmentDocUploadPopup';
import Swal from 'sweetalert2';
import imageLiveUrl from '../../utils/urlConverter/imageLiveUrl';
import gs1logo from "../../Images/gs1.png";
import DataTable from '../../Components/Datatable/Datatable';

const ShipmentDocUpload = () => {
    const [data, setData] = useState([]);
    const { openSnackbar } = useContext(SnackbarContext);
    const [isLoading, setIsLoading] = useState(true);
    const [showCustomerId, setShowCustomerId] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [onClose, setOnClose] = useState(false);
    const navigate = useNavigate()

    // I get the selected Row data in the session storage
    const getRowData = sessionStorage.getItem("shipmentVerification");
    const parsedRowData = JSON.parse(getRowData);
    //  console.log(parsedRowData);
    let vendorId = parsedRowData?.vendor_id;


    // take product id from url
    const productId = useParams().productId;
    console.log(productId);

    const refectDocList = async () => {
        try {
            const response = await newRequest.get("/getDocumentByProductId?productId=" + productId);
            console.log(response.data);
            setData(response?.data || []);
            setIsLoading(false)
        }
        catch (err) {
            console.log(err);
            setIsLoading(false)
        }
    };
    useEffect(() => {
        refectDocList();

        // Vendor_id api to Get the Company Name
        const fetchCustomerId = async () => {
            try {
                const response = await newRequest.get(`/getVendorsById?id=${vendorId}`)
                // console.log(response?.data);
                setShowCustomerId(response?.data[0] ?? [])

            } catch (error) {
                console.log(error);
            }
        }

        fetchCustomerId();
    }, []);





    const handleDownload = async (row) => {
        // get url from row
        const url = row?.document_url;
        const liveUrl = imageLiveUrl(url)
        console.log(liveUrl);
        // download file
        window.open(liveUrl, '_blank').focus();


        console.log(url);


    }

    const handleView = async (row) => {
        // Get the URL from the row
        const url = row?.document_url;

        // Open the URL in a new, smaller window in the top-left corner
        const width = 400; // adjusted width
        const height = 300; // adjusted height
        const left = 0;
        const top = 0;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no`;
        const liveUrl = imageLiveUrl(url);
        window.open(liveUrl, "_blank", windowFeatures).focus();
    };


    // get the cardData from sesstion stoaage
    const cardData = JSON.parse(sessionStorage.getItem('selectedCardData'));
    console.log(cardData);


    const handleDelete = async (row) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            // changes the color of the confirm button to red
            confirmButtonColor: '#1E3B8B',
            cancelButtonColor: '#FF0032',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // convert row id to number
                    const documentId = Number(row.document_id);
                    console.log(row);
                    console.log(documentId);
                    await newRequest.delete("/deleteShipmentDocument?documentId=" + documentId);

                    openSnackbar("Record Deleted Successfully", 'success');
                    // remove the deleted user from the data
                    console.log(data);
                    console.log(documentId);
                    const updatedData = data.filter((item) => item.document_id !== row.document_id);
                    setData(updatedData);
                }
                catch (err) {
                    console.log(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err?.response?.data?.message || 'Something went wrong'
                    })
                    return
                }

                // filter out the deleted user from the data

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                return
            }
        })
    }

    const handleAddDoc = () => {
        setOpenPopup(true)
        setOnClose(false)
    }



    const closeDocPopup = () => {
        setOpenPopup(false)
        setOnClose(true)
    }


    const handleValidate = async (row) => {
        console.log(row)

        try {
            const response = await newRequest.put('/updateDocumentVerificationStatus', {
                document_id: row.document_id,
                is_verified: true,
            });

            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'Okay',
                timer: 2000,
                timerProgressBar: true,
            });

            // for approve, refresh the datagrid to show the updated status
            refectDocList();

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error?.response?.data?.message || 'An error occurred while approving shipment',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }
    }



    const handleValidateAllDoc = async () => {
        console.log("validate all doc")

        try {
            const response = await newRequest.put('/updateAllDocumentsStatusForProduct', {
                product_id: productId,
                is_verified: true,
            });

            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'Okay',
                timer: 2000,
                timerProgressBar: true,
            });

            // for approve, refresh the datagrid to show the updated status
            refectDocList();

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error?.response?.data?.message || 'An error occurred while approving shipment',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        }

    }


    return (
        <div>
            <div className="p-3 h-full sm:ml-72">
                {/* Header */}
                <div className="popup-header -mt-3">
                    <div className="flex justify-between  w-full font-body p-6 shadow-xl rounded-md text-black bg-[#D4EDDA] text-xl mb:2 md:mb-5">
                        <div className='flex justify-start items-center gap-2 text-xs sm:text-sm'>
                            <div>
                                <img src={gs1logo} className='h-10 w-10' alt='' />
                            </div>
                            <div>
                                <p className='font-semibold'>Document Id {productId}</p>
                                <p>Product Name: : <span className='font-semibold'>{cardData?.productnameenglish}</span></p>
                                {/* <p>Member ID: : <span className='font-semibold'>{parsedRowData?.id}</span></p> */}
                            </div>
                        </div>
                        <div className='sm:text-2xl text-sm font-semibold text-red-600'>
                            <p>Company: {showCustomerId?.company_name_English}</p>
                        </div>
                    </div>

                </div>
                <ShipmentDocUploadPopup
                    open={openPopup}
                    closeDocPopup={closeDocPopup}
                    onClose={onClose}
                    refectDocList={refectDocList}
                    productId={productId}


                />
                <div style={{ marginLeft: '-11px', marginRight: '-11px', marginTop: '-15px' }}>

                    <DataTable data={data} title={"Shipment Documents"} columnsName={ShipmentDocColumns} backButton={false}
                        secondaryColor="secondary"
                        loading={isLoading}
                        AddDocBtn={true}
                        handleValidateDoc={true}
                        handleValidateAllDoc={handleValidateAllDoc}
                        handleAddDoc={handleAddDoc}
                        uniqueId="shipmentDocUploadId"
                        dropDownOptions={[

                            {
                                label: "Download",
                                icon: <FileDownloadIcon fontSize="small" style={{ color: '#FF0032' }} />
                                ,
                                action: handleDownload,
                            },
                            {
                                label: "View",
                                icon: (
                                    <VisibilityIcon
                                        fontSize="small"
                                        style={{ color: "rgb(37 99 235)" }}
                                    />
                                ),
                                action: handleView,
                            },
                            {
                                label: "Validate",
                                icon: <VerifiedUserIcon fontSize="small" style={{ color: "rgb(37 99 235)" }} />
                                ,
                                action: handleValidate,
                            },
                            {
                                label: "Delete",
                                icon: <DeleteIcon fontSize="small" style={{ color: '#FF0032' }} />
                                ,
                                action: handleDelete,
                            },

                        ]}
                    />

                </div>
            </div>
        </div>
    )
}

export default ShipmentDocUpload



