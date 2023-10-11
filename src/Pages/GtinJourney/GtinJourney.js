import React, { useContext, useEffect, useState } from 'react'
import DigitalLinkInformation from './DigitalLinkInformation';
import backarrow from "../../Images/backarrow1.png"
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../Contexts/SnackbarContext';
import newRequest from '../../utils/userRequest';
import { ShipmentDocColumns } from '../../utils/datatablesource';
import DataTable from '../../Components/Datatable/Datatable';
import EventsMap from '../../Components/Mapcomponent/EventsMap';
import socketIOClient from 'socket.io-client';
const ENDPOINT = "http://127.0.0.1:7000";


const GtinJourney = () => {

  const [data, setData] = useState(null);
  const [productPriceState, setProductPriceState] = useState(null); // State to store API data
  const navigate = useNavigate();
  const [epcisData, setEpcisData] = useState([]);

  // Full Screen Code
  const [isFullscreen, setIsFullscreen] = useState(document.fullscreenElement != null);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen().catch((error) => {
        console.error(`Error exiting full-screen mode: ${error.message} (${error.name})`);
      });
    } else {
      document.documentElement.requestFullscreen().catch((error) => {
        console.error(`Error entering full-screen mode: ${error.message} (${error.name})`);
      });
    }
    setIsFullscreen(!isFullscreen);  // Update the state to reflect the new full-screen status
  };
  const [allLocations, setAllLocations] = useState([])









  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Listen for the 'newEPCISEvent' event from the server
    socket.on('newEPCISEvent', (newData) => {
      // Update the state with the new data
      console.log(newData);
      setAllLocations((prevLocations) => [...prevLocations, newData]);
    });

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await newRequest.get(`/getAllLocationData`);

        const newData = response.data.map((item) => {
          return {
            ...item,
            longitude: item.Longitude.toString(),
            latitude: item.Latitude.toString(),
          };
        });
        console.log(newData);
        setAllLocations(newData);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  // const allLocations = [

  //   { latitude: '24.740637', longitude: '46.711927', name: '2', locationName: null, serial: 'kxv1234587523a', description: 'Distribution Center', type: 'event' },

  //   { latitude: '24.740637', longitude: '46.711927', name: '2', locationName: null, serial: 'kxv123458752', description: 'Distribution Center', type: 'event' },

  //   { latitude: '24.713156', longitude: '46.655665', name: '1', locationName: null, serial: 'BSW220200512603', description: 'Goods Issue', type: 'event' },

  //   { latitude: '24.738654', longitude: '46.708706', name: '3', locationName: null, serial: '0200512603xcv', description: 'Goods Receiving', type: 'event' },

  //   { latitude: '24.698666', longitude: '46.681269', name: '4', locationName: null, serial: 'lko564523100234aa', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.697058', longitude: '46.681376', name: '4', locationName: null, serial: 'lko564523100234aa', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.696910', longitude: '46.725814', name: '4', locationName: null, serial: 'lko564523100234', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.731479', longitude: '46.722084', name: '4', locationName: null, serial: 'lko564523100235', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.694071', longitude: '46.722463', name: '4', locationName: null, serial: 'lko564523100234a', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.732679', longitude: '46.717380', name: '4', locationName: null, serial: 'lko56452310023b', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.737833', longitude: '46.719439', name: '4', locationName: null, serial: 'lko56452310022', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.735437', longitude: '46.717155', name: '4', locationName: null, serial: 'lko56452310021', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.750347', longitude: '46.719092', name: '4', locationName: null, serial: 'lko5645231002', description: 'Point of Sale', type: 'event' },

  //   { latitude: '24.740347', longitude: '46.709092', name: '4', locationName: null, serial: 'bgh568742120', description: 'Point of Sale', type: 'event' },

  //   { latitude: '30.85863152704821', longitude: '72.5551311454773', name: '6', locationName: null, serial: null, description: null, type: 'event' },

  //   { latitude: '30.375820828413538', longitude: '69.34011636239622', name: '6', locationName: null, serial: null, description: null, type: 'event' }

  // ]


  const products = [
    { name: "GTIN", value: data?.gtinArr?.gtin },
    { name: "Brand name", value: data?.gtinArr?.brandName },
    { name: "Product description", value: data?.gtinArr?.productDescription },
    { name: "Product image URL", value: data?.gtinArr?.productImageUrl },
    { name: "Global product category", value: data?.gtinArr?.gpcCategoryCode },
    // check if data has unitcode then show value
    { name: "Net content", value: data?.gtinArr?.unitCode && data?.gtinArr?.unitValue && `${data?.gtinArr?.unitCode} ${data?.gtinArr?.unitValue}` },
    { name: "Country of sale", value: data?.gtinArr?.countryOfSaleCode },
  ];

  return (
    <div>
      <div className="p-3">
        <div className='flex flex-wrap'>
          <div className='h-10 w-full bg-primary flex justify-start items-center'>
            <button onClick={() => navigate(-1)} className='font-medium rounded-sm p-2 py-1'>
              <span>
                <img src={backarrow}
                  className='h-auto w-8 object-contain'
                  alt=''
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </span>
            </button>

            <button onClick={toggleFullscreen} className='font-medium h-auto w-14 rounded-sm p-2 py-1'>
              <FullscreenIcon
                style={{ height: 'auto', width: '40px', filter: 'brightness(0) invert(1)' }}
                className=''
                alt=''

              />
            </button>

            <div>
                <p className='text-white font-medium sm:text-xl text-sm ml-5'>Product Information powered by GS1 Standards</p>
            </div>  
          </div> 
          {/* GTIN search */}
          <div className='w-[60%] mt-2 overflow-auto h-full flex-shrink-0' style={{ maxHeight: '115vh' }}>


            <div className="flex flex-col md:flex-row border-2 border-dashed mt-3">
              <div className="w-full md:w-2/3">
                <div className="container mx-auto p-1">
                  <div className="overflow-x-auto">
                    <table className="table-auto text-[10.5px] min-w-max w-full">
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-1">{product.name}</td>
                            <td className="border px-4 py-1 font-semibold">{product.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 flex flex-col justify-center items-center -mt-6 p-8">
                {/* Add your image element here */}
                {data?.gtinArr?.productImageUrl && (
                  <img src={data.gtinArr.productImageUrl} alt="Product" className="w-1/2 h-32" />

                )}
                {productPriceState &&
                  <p className="text-center font-bold mt-2">{productPriceState} SAR</p>
                }
              </div>
            </div>


            {/* Map Code */}
            <EventsMap selectedSerial={null}
              selectedBatch={null}
              allLocations={allLocations}
            />



          </div>





          {/* right Side of Component */}
          <div className='h-10 w-[40%] mt-2'>
            <DigitalLinkInformation gtinData={data?.gtinArr} />
          </div>

          {/* Datagrid */}
          <div className='h-auto w-full mt-2'>
            <div style={{ marginLeft: '-11px', marginRight: '-11px', marginTop: '-40px' }}>

              <DataTable data={data} title={"EPCIS Events"} columnsName={ShipmentDocColumns} backButton={false}
                secondaryColor="secondary"
                // loading={isLoading}
                uniqueId="GtinJourneyId"
                dropDownOptions={[

                  // {
                  //     label: "Download",
                  //     icon: <FileDownloadIcon fontSize="small" style={{ color: '#FF0032' }} />
                  //     ,
                  //     action: handleDownload,
                  // },

                ]}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GtinJourney