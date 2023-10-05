import React, { useContext, useEffect, useRef, useState } from "react";
import { shipmentProductsColumns, shipmentVerificationColumn, verifiedProductColumn } from "../../utils/datatablesource";

import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/userRequest";
import DataTable from "../../Components/Datatable/Datatable";
import { SnackbarContext } from "../../Contexts/SnackbarContext";
import { CurrentUserContext } from "../../Contexts/CurrentUserContext";
import Swal from "sweetalert2";


const VerifiedProduct = () => {
  const [data, setData] = useState([]);


  const { openSnackbar } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [secondGridData, setSecondGridData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // for the map markers
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate()
  console.log(currentUser)
  const [isShipmentProductDataLoading, setIsShipmentProductDataLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newRequest.get("/getAllApprovedShipmentRequests");
        console.log(response.data);
        setData(response?.data || []);
        setIsLoading(false)

      } catch (err) {

        console.log(err);
        setIsLoading(false)
        openSnackbar(err?.response?.data?.message || 'Something Is Wrong', 'error')
      }
    };

    fetchData(); // Calling the function within useEffect, not inside itself
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
  }, []);

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

            <DataTable data={data} title="Verified Shipments" columnsName={verifiedProductColumn}
              loading={isLoading}
              secondaryColor="secondary"
              checkboxSelection='disabled'
              handleRowClickInParent={handleRowClickInParent}
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
              //     action: handleView,
              //   },
              //   {
              //     label: "Edit",
              //     icon: <EditIcon fontSize="small" color="action" style={{ color: "rgb(37 99 235)" }} />
              //     ,
              //     action: handleEdit

              //   },
              // ]}
              uniqueId="verfiedShipmentsId"

            />
          </div>





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
  )
}

export default VerifiedProduct