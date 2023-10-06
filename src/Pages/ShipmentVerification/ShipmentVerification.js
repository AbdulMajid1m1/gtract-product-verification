import React, { useContext, useEffect, useState } from "react";
import { shipmentProductsColumns, shipmentVerificationColumn } from "../../utils/datatablesource";

import { useNavigate } from "react-router-dom";
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import newRequest from "../../utils/userRequest";
import DataTable from "../../Components/Datatable/Datatable";
import { SnackbarContext } from "../../Contexts/SnackbarContext";
import Swal from "sweetalert2";


const ShipmentVerification = () => {
  const [data, setData] = useState([]);
  const [secondGridData, setSecondGridData] = useState([]);
  const [isShipmentProductDataLoading, setIsShipmentProductDataLoading] = useState(false)

  const { openSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]); // for the map markers
  const navigate = useNavigate()



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newRequest.get("/getAllSubmittedShipmentRequests");
        console.log(response.data);
        setData(response?.data || []);
        setIsLoading(false)

      } catch (err) {

        console.log(err);
        setIsLoading(false)
        openSnackbar(err?.response?.data?.message || 'Something Is Wrong', 'error')
      }
    };

    fetchData();

    const getAllShipmentsProducts = async () => {
      setIsShipmentProductDataLoading(true)
      try {

        const response = await newRequest.get("/getAllVerifiedShipmentProducts")

        console.log(response?.data);

        setSecondGridData(response?.data ?? [])
        setFilteredData(response?.data ?? [])
      }
      catch (error) {
        console.log(error);
        // setError(error?.response?.data?.message ?? "Something went wrong")

      }
      finally {
        setIsShipmentProductDataLoading(false)
      }
    };
    getAllShipmentsProducts();
  }, []); // Empty array dependency ensures this useEffect runs once on component mount


  const handleView = (row) => {
    console.log(row)
    // i want to save the row data in sesstion storage
    sessionStorage.setItem('shipmentVerification', JSON.stringify(row))
    navigate('/verify-shipment')
  }

  const handleShipmentApproval = async (row) => {
    try {
      const response = await newRequest.put('/updateShipmentRequestStatus', {
        shipment_id: row.shipment_id,
        status: 'approved'
      });

      Swal.fire({
        title: 'Success!',
        text: response.data.message,
        icon: 'success',
        confirmButtonText: 'Okay',
        timer: 2000,
        timerProgressBar: true,
      });

      // on approve, remove the row from the table
      const newData = data.filter((item) => item.shipment_id !== row.shipment_id);
      setData(newData);

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error?.response?.data?.message || 'An error occurred while approving shipment',
        icon: 'error',
        confirmButtonText: 'Okay'
      });


    }
  };

  const handleRowClickInParent = async (item) => {

    if (item.length === 0) {
      setFilteredData(secondGridData)
      return
    }
    // const filteredData = secondGridData.filter((singleItem) => {
    //   return Number(singleItem?.shipment_id) == Number(item[0]?.shipment_id)
    // })

    // call api
    setIsShipmentProductDataLoading(true)
    try {
      const res = await newRequest.get("/getShipmentProductByShipmentId?shipmentId=" + item[0]?.shipment_id)
      const filteredData = res?.data ?? []
      setFilteredData(filteredData)
    }
    catch (error) {
      console.log(error)
      setFilteredData([])
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error?.response?.data?.message ?? "Something went wrong",
        timer: 3000,
        timerProgressBar: true,

      })
    }
    finally {
      setIsShipmentProductDataLoading(false)
    }
  }



  return (
    <div>


      <div className="p-3 h-full sm:ml-72">

        <div className='h-auto w-full shadow-xl'>
          <div style={{ marginLeft: '-11px', marginRight: '-11px' }}>

            <DataTable data={data} title="Shipment Verification" columnsName={shipmentVerificationColumn}
              loading={isLoading}
              secondaryColor="secondary"
              checkboxSelection='disabled'
              handleRowClickInParent={handleRowClickInParent}
              uniqueId="shipmentVerificationId"


              dropDownOptions={[
                {
                  label: "Verify Shipment",
                  icon: (
                    <VerifiedIcon
                      fontSize="small"
                      color="action"
                      style={{ color: "rgb(37 99 235)" }}
                    />
                  ),
                  action: handleView,
                },
                {
                  label: "Approve Shipment",
                  icon: <CheckCircleIcon fontSize="small" color="action" style={{ color: "rgb(37 99 235)" }} />
                  ,
                  action: handleShipmentApproval

                },
              ]}

            />
          </div>


          <div style={{ marginLeft: '-11px', marginRight: '-11px' }}>
            <DataTable data={filteredData} title="Shipment Products"
              secondaryColor="secondary"
              columnsName={shipmentProductsColumns}
              backButton={true}
              checkboxSelection="disabled"
              actionColumnVisibility={false}
              // dropDownOptions={[
              //   {
              //     label: "View",
              //     icon: (
              //       <VisibilityIcon
              //         fontSize="small"
              //         color="action"
              //         style={{ color: "rgb(37 99 235)" }}
              //       />
              //     ),
              //     action: (row) => {
              //       sessionStorage.setItem("shipmentRequest", JSON.stringify(row));
              //       navigate("/new-shipment-request")

              //     },
              //   },
              //   {
              //     label: "Submit Request",
              //     icon: <SwapHorizIcon fontSize="small" color="action" style={{ color: "rgb(37 99 235)" }} />
              //     ,
              //     action: handleStatusChange,

              //   },
              //   {
              //     label: "Delete",
              //     icon: <DeleteIcon fontSize="small" style={{ color: '#FF0032' }} />
              //     ,
              //     action: handleShipmentDelete,
              //   },
              // ]}
              uniqueId={"shipmentRequestProductId"}
              loading={isShipmentProductDataLoading}

            />
          </div>



        </div>
      </div>
    </div>
  )
}

export default ShipmentVerification