import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
// import newRequest from '../../utils/userRequest';
import { RiseLoader } from 'react-spinners';
// import { SnackbarContext } from '../../Contexts/SnackbarContext';
import gs1logo from "../../Images/gs1.png";
import Swal from 'sweetalert2';
import { phpImagesBaseUrl } from '../../utils/config';
import AddProducts from '../../Components/AddProducts/AddProducts';

const VerifyShipment = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [cardData, setCardData] = useState([]);

    // when i click the image i want to open the popup
    const [isAddProductsOpen, setIsAddProductsOpen] = useState(false);
    const handleOpenAddProducts = () => {
        setIsAddProductsOpen(true);
    };

    // this is the popup code
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    // I get the selected Row data in the session storage
    // const getRowData = sessionStorage.getItem("customerRowData");
    // const parsedRowData = JSON.parse(getRowData);
    // console.log(parsedRowData);


    // get the session data
    // const parsedVendorData = JSON.parse(sessionStorage.getItem("shipmentRequest"));
    // console.log(parsedVendorData)
    // how i can get the shipment id from the session data

    // let shipmentId = parsedVendorData?.shipment_id


    // useEffect(() => {
    //     const fetcShipmentProducts = async () => {
    //         try {
    //             const response = await newRequest.get(`/getShipmentProductByShipmentId?shipmentId=${shipmentId}`)

    //             console.log(response?.data);
    //             setCardData(response?.data ?? [])
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.log(error);
    //             setIsLoading(false);
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Oops...',
    //                 text: error?.response?.data?.message ?? 'Something went wrong!',
    //             })
    //             setCardData([]);

    //         }
    //     }
    //     fetcShipmentProducts();
    // }, [])

    // const handleRefetch = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await newRequest.get(`/getShipmentProductByShipmentId?shipmentId=${shipmentId}`)

    //         console.log(response?.data);
    //         setCardData(response?.data ?? [])
    //         setIsLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //         setIsLoading(false);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: error?.response?.data?.message ?? 'Something went wrong!',
    //         })
    //         setCardData([]);

    //     }
    // }


    // Function to handle saving card data to session storage
      const saveCardDataToSessionStorage = (item) => {
        sessionStorage.setItem("selectedCardData", JSON.stringify(item));
      };


    return (
        <div>

            {isLoading &&

                <div className='loading-spinner-background'
                    style={{
                        zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed'


                    }}
                >
                    <RiseLoader
                        size={18}
                        color={"#6439ff"}
                        // height={4}
                        loading={isLoading}
                    />
                </div>
            }

            <div className="p-1 h-full sm:ml-72 -mt-6">
                <div className="bg-white">

                    {/* Header I add */}
                    <div className="popup-header">
                        <div className="flex justify-between w-full font-body p-6 shadow-xl rounded-md text-black bg-[#D4EDDA] text-xl mb:2 md:mb-5">
                            <div className='flex justify-start w-[40%] items-center gap-2 text-xs sm:text-sm'>
                                <div>
                                    <img src={gs1logo} className='h-10 w-12' alt='' />
                                </div>
                                <div className='flex flex-col w-full gap-2'>
                                    <div className='flex justify-between -mt-1'>
                                        <div className='w-[50%]'>
                                            <p className='font-semibold'>Customer Name</p>
                                        </div>
                                        <div className='flex w-[50%] gap-2'>
                                            <p>:</p>
                                            <p>03</p>
                                            {/* <p className='font-semibold'>{parsedRowData?.company_name_eng}</p> */}
                                        </div>
                                    </div>
                                    <div className='flex justify-between -mt-1'>
                                        <div className='w-[50%]'>
                                            <p className='font-semibold'>Customer No</p>
                                        </div>
                                        <div className='flex w-[50%] gap-2'>
                                            <p>:</p>
                                            <p>6</p>
                                            {/* <p className='font-semibold'>{parsedRowData?.no}</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Next Button */}
                            {/* <div className='flex gap-3 justify-end'>
                                <AddProducts title={"Add Product"} 
                                    handleClose={handleClose}
                                    handleOpen={handleOpen}
                                    open={open}
                                    // handleRefetch={handleRefetch}
                                    />
                            </div> */}
                        </div>
                    </div>

                    {/* <!-- Product List --> */}
                    <section className="py-1 bg-gray-100">
                        <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-5 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                            {cardData?.map((item, index) => {
                                return (
                                    <article key={index} className="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
                                        {/* <a href="#"> */}
                                        <div className="relative h-56 flex items-end overflow-hidden rounded-xl">
                                            <img className='' src={phpImagesBaseUrl + "/" + item?.front_image} alt="image"
                                                style={{
                                                    objectFit: 'contain',
                                                    height: '100%', margin: 'auto'
                                                }}

                                            />
                                        </div>

                                        <div className="mt-1 p-2 flex flex-col gap-1">
                                            <div className='flex justify-between items-center'>
                                                <p className="text-sm font-semibold text-slate-700">{item?.productnameenglish}</p>
                                                <p className="mt-1 font-semibold text-sm text-slate-700">{item?.productnamearabic}</p>
                                            </div>
                                            <div className='flex justify-between'>
                                                {/* <p className="mt-1 font-semibold text-sm text-slate-700">{item?.model}</p> */}
                                                {/* <p className="mt-1 font-semibold text-sm text-slate-700">{item?.manufacturing_date}</p> */}
                                            </div>
                                            <div className='flex justify-between'>
                                                <p className="mt-1 font-semibold text-sm text-slate-700">{item?.barcode}</p>
                                                <p className="mt-1 font-semibold text-sm text-slate-700">{item?.unit}</p>
                                            </div>
                                            <p className="mt-1 font-semibold text-sm text-slate-700">{item?.BrandName}</p>
                                        </div>
                                        <div className="mt-3 flex justify-between px-2">
                                            <button
                                                onClick={() => {
                                                    // saveCardDataToSessionStorage(item);
                                                    // navigate('/shipment-docs/' + item?.id);
                                                }}
                                                className='h-auto w-auto px-4 py-1 text-sm bg-primary rounded-md text-white'>Verify Documents</button>
                                            <p className="text-sm font-bold text-red-500">{item?.BrandNameAr}</p>
                                        </div>
                                        {/* </a> */}
                                    </article>
                                )
                            })
                            }


                            <article className="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
                                <a href="#">
                                    <div className="relative h-56 flex items-end overflow-hidden rounded-xl">
                                        <img
                                            className=''
                                            onClick={handleOpenAddProducts}
                                            src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Hotel Photo" />
                                    </div>

                                    <div className="mt-1 p-2 flex flex-col gap-1">
                                        <div className='flex justify-between items-center'>
                                            <p className="text-sm font-semibold text-slate-700">Description English</p>
                                            <p className="mt-1 font-semibold text-sm text-slate-700">Description Arabic</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p className="mt-1 font-semibold text-sm text-slate-700">Model</p>
                                            <p className="mt-1 font-semibold text-sm text-slate-700">Manufecturing Date</p>
                                        </div>
                                        <div className='flex justify-between'>
                                            <p className="mt-1 font-semibold text-sm text-slate-700">Serial Number</p>
                                            <p className="mt-1 font-semibold text-sm text-slate-700">Item Price</p>
                                        </div>
                                        <p className="mt-1 font-semibold text-sm text-slate-700">Item Code</p>
                                    </div>
                                    <div className="mt-3 flex justify-between px-2">
                                        <button
                                            onClick={() => {
                                                // saveCardDataToSessionStorage(item);
                                                // navigate('/shipment-docs/' + item?.id);
                                            }}
                                            className='h-auto w-auto px-4 py-1 text-sm bg-primary rounded-md text-white'>View Documents</button>
                                        <p className='h-auto w-auto px-4 py-1 text-sm bg-green-500 rounded-md text-white'>6281000000113</p>
                                    </div>
                                </a>
                            </article>

                            {isAddProductsOpen && ( // Conditionally render AddProducts component
                                <div className="flex gap-3 justify-end">
                                    <AddProducts
                                        handleClose={() => setIsAddProductsOpen(false)}
                                        handleOpen={handleOpenAddProducts}
                                        open={isAddProductsOpen}
                                    />
                                </div>
                            )}

                        </div>
                    </section>

                </div>

            </div>
        </div>
    )
}

export default VerifyShipment