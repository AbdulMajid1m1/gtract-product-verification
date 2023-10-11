// MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 24.740637,
    lng: 46.711927
};
const dummyLongandlat = [
    { latitude: 24.740637, longitude: 46.711927 },
    { latitude: 24.740637, longitude: 46.711927 },
    { latitude: 24.713156, longitude: 46.655665 },
    { latitude: 24.738654, longitude: 46.708706 },
    { latitude: 24.698666, longitude: 46.681269 },
    { latitude: 24.697058, longitude: 46.681376 },
    { latitude: 24.696910, longitude: 46.725814 },
    { latitude: 24.731479, longitude: 46.722084 },
    { latitude: 24.694071, longitude: 46.722463 },
    { latitude: 24.732679, longitude: 46.717380 },
    { latitude: 24.737833, longitude: 46.719439 },
    { latitude: 24.735437, longitude: 46.717155 },
    { latitude: 24.750347, longitude: 46.719092 },
    { latitude: 24.740347, longitude: 46.709092 },
    { latitude: 30.85863152704821, longitude: 72.5551311454773 },
    { latitude: 30.375820828413538, longitude: 69.34011636239622 },


  ]


const MapComponent = ({ data }) => {
    return (
        <LoadScript googleMapsApiKey="AIzaSyAUI_hqf3GJQ7c80e0rK9aki1fT6kDVuiU">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                {dummyLongandlat.map((location, index) => (
                    <Marker key={index} position={{ lat: location.latitude, lng: location.longitude }} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
}

export default MapComponent