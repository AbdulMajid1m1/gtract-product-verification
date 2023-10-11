import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { GoogleMap, StandaloneSearchBox, Marker, Polyline, DirectionsRenderer, OverlayView, InfoWindow } from '@react-google-maps/api';
import DigitalLinkInformation from './DigitalLinkInformation';
import backarrow from "../../Images/backarrow1.png"
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useNavigate } from 'react-router-dom';
import { SnackbarContext } from '../../Contexts/SnackbarContext';
import newRequest from '../../utils/userRequest';
import { ShipmentDocColumns } from '../../utils/datatablesource';
import DataTable from '../../Components/Datatable/Datatable';

const style = {
  width: '95%',
  height: '80%'
}
const containerStyle = {
  // position: 'relative',
  width: '95%',
  height: '80%'
}

const drawerWidth = 220


const GtinJourney = () => {
  const [gtin, setGTIN] = useState("");
  const [data, setData] = useState(null);
  const [searchedData, setSearchedData] = useState({}); // State to store API data
  const [productPriceState, setProductPriceState] = useState(null); // State to store API data
  const navigate = useNavigate();
  const { openSnackbar } = useContext(SnackbarContext);


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


  const parseInput = (input) => {
    let extracted = {
      gtin: null,
      mapDate: null,
      batch: null,
      serial: null
    };

    const parts = input.split(' ');

    if (parts.length > 2) {
      const gtinMapDate = parts[0].split('-');
      extracted.gtin = gtinMapDate[0];
      extracted.mapDate = gtinMapDate[1] + ' ' + parts[1].split('-')[0];

      extracted.batch = parts[1].split('-')[1];

      const serialParts = parts[2].split('-');
      extracted.serial = serialParts[serialParts.length - 1];
    } else {
      // Handle other cases or errors here
      extracted.gtin = input;
    }

    return extracted;

  };


  const handleSearch = () => {
    // 6281000000113-25 2023-batch01-01 2023-BSW220200512603
    const result = parseInput(gtin);
    setSearchedData(result)
    // sessionStorage.setItem("barcodeData", JSON.stringify(result));

    // I pass the data directly to the fetchLocations function
    fetchLocations(result);
    console.log(result)
    //  mapDate, batch and serial are in result if needed".
    if (!result.gtin) {
      openSnackbar("Please enter GTIN", 'error');
      return;
    }

    const bodyData = {
      // gtin: gtin,
      gtin: result.gtin,

    };

    axios
      .get("https://gs1ksa.org/api/search/member/gtin", { params: bodyData })
      .then((response) => {
        if (response.data?.gtinArr === undefined || Object.keys(response.data?.gtinArr).length === 0) {
          // Display error message when the array is empty
          openSnackbar("No data found", 'error');

          setData(null);
          return;
        }
        console.log(response?.data);
        setData(response?.data);
        sessionStorage.setItem("gtinData", JSON.stringify(response?.data));
        // sessionStorage.setItem("EventgtinArr", JSON.stringify(response?.data?.gtinArr));
        setGTIN(gtin)


        // Product Price ki api 
        newRequest
          .get(`/getProductContentByGtin/${result.gtin}`)
          .then((secondResponse) => {
            if (secondResponse.data && secondResponse.data.length > 0) {

              const firstNonNullOrUndefinedObject = secondResponse.data.find(item => item.unitPrice !== null && item.unitPrice !== undefined);

              if (firstNonNullOrUndefinedObject) {
                // Set the product price from the first non-null object
                setProductPriceState(firstNonNullOrUndefinedObject.unitPrice);
              }
              if (firstNonNullOrUndefinedObject === undefined) {
                // agar value undefined hai to main state ko null kr raha ho
                setProductPriceState(null);
              }
            }
          })
          .catch((secondError) => {
            console.log(secondError);
            // setProductPriceState([]);
          });



        fetchLocations();
      })
      .catch((error) => {
        console.log(error);
        setData(null);
        openSnackbar("Something went wrong", 'error');
      });
  };



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





  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSerial, setSelectedSerial] = useState(null);

  // const MapsResponseData = sessionStorage.getItem('mapsResponse');
  // const parsedMappedData = JSON.parse(MapsResponseData);
  // console.log(parsedMappedData)

  const handleBatchChange = (e) => {
    if (e.target.value === "none") {
      setSelectedBatch(null);
    } else {
      setSelectedBatch(e.target.value);
    }
  };

  const handleSerialChange = (e) => {
    if (e.target.value === "none") {
      setSelectedSerial(null);
    } else {
      setSelectedSerial(e.target.value);
    }
  };


  const barcodeData = sessionStorage.getItem("barcodeData");
  const [directions, setDirections] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState({ index: null, position: null });
  // import { GoogleMap, StandaloneSearchBox, Marker, Polyline } from '@react-google-maps/api';
  const [locationsapi, setlocationsapi] = useState([]);
  // const gtin = sessionStorage.getItem("gtin");
  // console.log(gtin);


  const [lineCoordinates, setLineCoordinates] = useState([]);
  const filterLocationsBySelection = (locations) => {
    return locations.filter(item => {
      if (!selectedBatch && !selectedSerial) return true;
      if (selectedBatch && !selectedSerial) return true;
      if (!selectedBatch && selectedSerial) return item.serial === selectedSerial;
      return item.serial === selectedSerial;
    });
  }

  const fetchLocations = async (data) => {
    const bodyData = {
      // gtin: barcodeData?.gtin,
      gtin: data?.gtin,
    };
    console.log(selectedBatch, selectedSerial)
    if (selectedBatch) bodyData.batch = selectedBatch;
    if (selectedSerial) bodyData.serial = selectedSerial;


    console.log(bodyData)
    try {
      const res = await axios.get(`https://gs1ksa.org/api/search/event/gtin/with/maps`, {
        params: bodyData
      });
      const locations = res.data?.googleMap?.locations;
      console.log(locations)

      if (Array.isArray(locations)) {
        const allLocations = locations
          .filter(location => location.latitude && location.longitude)
          .map(location => ({
            latitude: location.latitude,
            longitude: location.longitude,
            name: location?.name,
            locationName: location?.locationName,
            serial: location?.serial,
            description: location?.description,
            type: location?.type,
          }));

        setlocationsapi(allLocations);

        const filteredLocations = filterLocationsBySelection(allLocations);

        // Break the locations into blocks of up to 10
        const blocks = [];
        let k = 0;
        for (let i = 0; i < filteredLocations.length; i++) {
          if (i !== 0 && i % 10 === 0) {
            k++;
          }
          if (typeof blocks[k] === 'undefined') {
            blocks[k] = [];
          }
          blocks[k].push(filteredLocations[i]);
        }

        const ds = new window.google.maps.DirectionsService();
        const fetchedDirections = [];

        const promiseArr = blocks.map(block => {
          return new Promise((resolve, reject) => {
            const waypts = [];
            for (let j = 1; j < block.length - 1; j++) {
              waypts.push({
                location: `${block[j].latitude},${block[j].longitude}`,
                stopover: false
              });
            }

            ds.route({
              origin: `${block[0].latitude},${block[0].longitude}`,
              destination: `${block[block.length - 1].latitude},${block[block.length - 1].longitude}`,
              waypoints: waypts,
              travelMode: 'DRIVING'
            }, (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                fetchedDirections.push(result);
                resolve(result);
              } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
                console.warn("No route found for the following data, ignoring this route:");
                console.warn("Origin:", `${block[0].latitude},${block[0].longitude}`);
                console.warn("Destination:", `${block[block.length - 1].latitude},${block[block.length - 1].longitude}`);
                console.warn("Waypoints:", waypts);
                resolve();  // Resolve without adding to fetchedDirections
              } else {
                console.error("Other error fetching directions for block:", block);
                console.error("Status:", status);
                reject(status);
              }
            });


          });
        });

        Promise.all(promiseArr)
          .then(() => {
            setDirections(fetchedDirections);
          })
          .catch(error => {
            console.error("Error fetching some directions:", error);
          });

        sessionStorage.setItem("mapsResponse", JSON.stringify(res?.data));
      } else {
        console.log('Invalid API response');
      }
    } catch (err) {
      console.log(err);
    }
  };






  // Loaction section 
  const [selectedLocation, setSelectedLocation] = useState();
  const RiyadhLocation = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia coordinates
  const [searchBox, setSearchBox] = useState(null);
  const handleSearchBoxLoad = (ref) => {
    setSearchBox(ref);
    // setSearchBox(new window.google.maps.places.SearchBox(map.getDiv()));

  };

  const handlePlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newLocation = {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          address: place.formatted_address,
        };
        setSelectedLocation(newLocation);
      }
    }
  };
  // Current Loaction
  const [currentLocation, setCurrentLocation] = useState(null);
  useEffect(() => {
    const apiKey = 'AIzaSyAUI_hqf3GJQ7c80e0rK9aki1fT6kDVuiU';
    console.log(apiKey);
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Error getting current location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleMapClicked = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    // Use the Geocoder service to get the address based on latitude and longitude
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setSelectedLocation({ latitude, longitude, address });
        console.log(address, latitude, longitude);
        setCurrentLocation(null);
      }

    });
  };



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
            {/* <div className='flex-shrink-0 overflow-auto h-full mr-4' style={{ width: '60%', maxHeight: '100vh' }}> */}
            {/* <div className='flex bg-red-400'> */}
            {/* <input
              type="text"
              className="w-full bg-yellow-100 border-2 h-10 rounded-md px-5 font-semibold text-black border-gray-600"
              placeholder="Scan your Barcode here...."
              value={gtin}
              onChange={(event) => setGTIN(event.target.value)}
              onBlur={handleSearch}
            /> */}
            {/* </div> */}

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
            <Box sx={{ display: 'flex', marginTop: '-45px' }}>
              <AppBar
                className='fortrans'
                position='fixed'
                sx={{
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                  ml: { sm: `${drawerWidth}px` }
                }}
              ></AppBar>
              <Box
                className=''
                sx={{
                  flexGrow: 1,
                  my: 5,
                  mx: 1,
                  width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
              >
                <div className="container mt-5" style={{ width: "100%" }}>
                  <GoogleMap
                    mapContainerStyle={{ height: '350px', width: '100%' }}
                    center={selectedLocation ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude } : RiyadhLocation}
                    zoom={currentLocation ? 13 : 10}
                    onClick={handleMapClicked}
                  >
                    <StandaloneSearchBox onLoad={handleSearchBoxLoad} onPlacesChanged={handlePlacesChanged}>
                      <input
                        type="text"
                        placeholder="Search for a location"
                        style={{
                          boxSizing: 'border-box',
                          border: '1px solid transparent',
                          width: '240px',
                          height: '32px',
                          padding: '0 12px',
                          borderRadius: '3px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                          fontSize: '14px',
                          outline: 'none',
                          textOverflow: 'ellipses',
                          position: 'absolute',
                          left: '50%',
                          marginLeft: '-120px',
                        }}
                      />
                    </StandaloneSearchBox>

                    {currentLocation && <Marker position={RiyadhLocation} />}

                    {filterLocationsBySelection(locationsapi).map((item, index) => (
                      item && item.latitude && item.longitude && (
                        <Marker
                          key={index}
                          position={{
                            lat: parseFloat(item.latitude),
                            lng: parseFloat(item.longitude),
                          }}
                          icon={
                            // Check this serial number 
                            // item.serial === barcodeData?.serial ? {
                            item ? {
                              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                              scaledSize: new window.google.maps.Size(40, 40)
                            } :
                              item.type === 'brand_owner' ? {
                                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                scaledSize: new window.google.maps.Size(40, 40)
                              } :
                                {
                                  url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                  scaledSize: new window.google.maps.Size(40, 40)
                                }
                          }
                          address={item.address}
                          onMouseOver={() => setSelectedMarker({ index, position: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) } })}
                          onMouseOut={() => setSelectedMarker({ index: null, position: null })}
                        />
                      )
                    ))}
                    {directions && directions.map((direction, index) => (
                      <DirectionsRenderer
                        key={index}
                        directions={direction}
                        options={{ suppressMarkers: true }}
                      />
                    ))}

                    {selectedMarker.index !== null && (
                      <OverlayView
                        position={selectedMarker.position}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ccc',
                            padding: 10,
                            borderRadius: 8,
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                            minWidth: 200,
                          }}
                        >
                          <p style={{ fontWeight: 'bold', marginBottom: 5 }}>Gtrack Product Location Details</p>
                          <p>Latitude: {locationsapi[selectedMarker.index].latitude}</p>
                          <p>Longitude: {locationsapi[selectedMarker.index].longitude}</p>
                          <br />
                          <p className="font-semibold">EventID: {locationsapi[selectedMarker.index].name}</p>
                        </div>
                      </OverlayView>
                    )}
                  </GoogleMap>



                </div>

              </Box>
            </Box>

            {/* Filter Barcode Code */}
            {/* <div className='h-auto -mt-5'>
              <div className='h-auto p-2 2xl:h-24 xl:h-24 lg:h-24 w-full border-2 border-gray-200 rounded-md'>
                <div className='grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 mb-4 text-[10.5px]'>
                  <div className='px-4 flex flex-col gap-1'>
                    <label>Batches <span className='text-red-500'>*</span></label>
                    <select
                      type='text'
                      className='w-full border h-7 rounded-md px-2 font-semibold border-gray-200'
                      onChange={handleBatchChange}
                    >
                      <option value="none">-select-</option>
                      {searchedData?.batch && (
                        <option value={searchedData?.batch}>{searchedData?.batch}</option>
                      )}

                    </select>
                  </div>


                  <div className='px-4 flex flex-col gap-1'>
                    <label>Serials </label>
                    <select type='text'
                      className='w-full border h-7 rounded-md px-2 font-semibold border-gray-200'
                      onChange={handleSerialChange}
                    >
                      <option value="none">-select-</option>
                      {searchedData?.serial && (
                        <option value={searchedData?.serial}>{searchedData?.serial}</option>
                      )}
                    </select>
                  </div>

                  <div className='px-4 flex flex-col gap-1 text-[10.5px]'>
                    <label>Expiry Date</label>
                    <input type='date' className='w-full border h-7 rounded-md px-2 font-semibold border-gray-200' placeholder='Batch' />
                  </div>

                </div>
              </div>
            </div> */}
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