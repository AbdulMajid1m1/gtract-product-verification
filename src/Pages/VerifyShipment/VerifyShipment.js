import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import newRequest from '../../utils/userRequest';
import { RiseLoader } from 'react-spinners';
// import { SnackbarContext } from '../../Contexts/SnackbarContext';
import gs1logo from "../../Images/gs1.png";
import Swal from 'sweetalert2';
import { phpImagesBaseUrl } from '../../utils/config';
import AddProducts from '../../Components/AddProducts/AddProducts';

const VerifyShipment = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [cardData, setCardData] = useState([]);
    const [showCustomerId, setShowCustomerId] = useState(false);
    const [clickedCardData, setClickedCardData] = useState(null);


    // when i click the image i want to open the popup
    // const [isAddProductsOpen, setIsAddProductsOpen] = useState(false);
    // const handleOpenAddProducts = () => {
    //     setIsAddProductsOpen(true);
    // };

     // Create an array of boolean states, one for each card
     const [isAddProductsOpenArray, setIsAddProductsOpenArray] = useState([]);

     // Initialize the state array based on the number of cards
     useEffect(() => {
         setIsAddProductsOpenArray(new Array(cardData.length).fill(false));
     }, [cardData]);
 
     // Function to open the popup for a specific card
     const handleOpenAddProductsForItem = (index) => {
         const updatedArray = [...isAddProductsOpenArray];
         updatedArray[index] = true;
         setClickedCardData(cardData[index]);
         setIsAddProductsOpenArray(updatedArray);
     };
 
     // Function to close the popup for a specific card
     const handleCloseAddProductsForItem = (index) => {
         const updatedArray = [...isAddProductsOpenArray];
         updatedArray[index] = false;
         setIsAddProductsOpenArray(updatedArray);
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
    const getRowData = sessionStorage.getItem("shipmentVerification");
    const parsedRowData = JSON.parse(getRowData);
    console.log(parsedRowData);

    let shipmentId = parsedRowData?.shipment_id
    let customerId = parsedRowData?.customer_id

    useEffect(() => {
        const fetcShipmentProducts = async () => {
            try {
                const response = await newRequest.get(`/getShipmentProductByShipmentId?shipmentId=${shipmentId}`)

                console.log(response?.data);
                setCardData(response?.data ?? [])
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error?.response?.data?.message ?? 'Something went wrong!',
                })
                setCardData([]);

            }
        }

        // customer id api
        const fetchCustomerId = async () => {
            try {
                const response = await newRequest.get(`/getGs1userById?id=${customerId}`)
                // console.log(response?.data);
                setShowCustomerId(response?.data ?? [])
                
            } catch (error) {
                console.log(error);
            }
        }

        
        fetcShipmentProducts();
        fetchCustomerId();
    }, [])


    const handleRefetch = async () => {
        try {
            const response = await newRequest.get(`/getShipmentProductByShipmentId?shipmentId=${shipmentId}`)

            console.log(response?.data);
            setCardData(response?.data ?? [])
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message ?? 'Something went wrong!',
            })
            setCardData([]);

        }
    }


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
                                            <p className='font-semibold'>Shipment Id</p>
                                        </div>
                                        <div className='flex w-[50%] gap-2'>
                                            <p>:</p>
                                            <p className='font-semibold'>{parsedRowData?.shipment_id}</p>
                                        </div>
                                    </div>
                                    <div className='flex justify-between -mt-1'>
                                        <div className='w-[50%]'>
                                            <p className='font-semibold'>Customer Id</p>
                                        </div>
                                        <div className='flex w-[50%] gap-2'>
                                            <p>:</p>
                                            <p className='font-semibold'>{parsedRowData?.customer_id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='sm:text-2xl text-sm font-semibold text-red-600'>
                                <p>{showCustomerId?.company_name_eng}</p>
                            </div>
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
                                            <img 
                                                className='' 
                                                src={phpImagesBaseUrl + "/" + item?.front_image} alt="image"
                                                // onClick={handleOpenAddProducts}
                                                onClick={() => handleOpenAddProductsForItem(index)}
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
                                                    navigate('/shipment-docs/' + item?.id);
                                                }}
                                                className='h-auto w-auto px-4 py-1 text-sm bg-primary rounded-md text-white'>Verify Documents</button>
                                                <p className={`text-sm font-bold ${
                                                    item?.is_verified === true ? 'bg-green-500' : 
                                                    item?.is_verified === false ? 'bg-red-500' : ''
                                                } text-white py-1 px-2 rounded-md`}
                                                >{item?.barcode}</p>
                                        </div>
                                        {/* </a> */}
                                        
                                        {/* When User Click on image i show the Popup */}
                                        {/* {isAddProductsOpen && (
                                            <div className="flex gap-3 justify-end">
                                                <AddProducts
                                                    handleClose={() => setIsAddProductsOpen(false)}
                                                    handleOpen={handleOpenAddProducts}
                                                    open={isAddProductsOpen}
                                                    barcode={item?.barcode}
                                                />
                                            </div>
                                        )} */}
                                        {isAddProductsOpenArray[index] && (
                                            <div className="flex gap-3 justify-end">
                                                <AddProducts
                                                    handleClose={() => handleCloseAddProductsForItem(index)}
                                                    handleOpen={() => handleOpenAddProductsForItem(index)}
                                                    open={isAddProductsOpenArray[index]}
                                                    barcode={clickedCardData}
                                                    handleRefetch={handleRefetch}
                                                />
                                            </div>
                                        )}
                                    </article>
                                )
                            })
                            }

                        </div>
                    </section>

                </div>

            </div>
        </div>
    )
}

export default VerifyShipment