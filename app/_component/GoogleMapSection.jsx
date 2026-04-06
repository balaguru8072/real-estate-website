// "use client"

// import React, { useEffect } from 'react'
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
// import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
// const containerStyle = {
//     width: '100%',
//     height: '80vh',
//     borderRadius: 10
// };



// function GoogleMapSection({coordinates}) {

//     const [center, setCenter] = React.useState({
//         lat: 11.0168,
//         lng: 76.9558,
//     })

//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: 'YOUR_API_KEY',
//     })

//     const [map, setMap] = React.useState(null)

//     useEffect(() =>{
//         coordinates && setCenter(coordinates)
//     }, [coordinates])

//     const onLoad = React.useCallback(function callback(map) {
//         // This is just an example of getting and using the map instance!!! don't just blindly copy!
//         const bounds = new window.google.maps.LatLngBounds(center)
//         map.fitBounds(bounds)

//         setMap(map)
//     }, [])

//     const onUnmount = React.useCallback(function callback(map) {
//         setMap(null)
//     }, [])

//     // if (!isLoaded) return <p>Loading Map...</p>;

//     return (
//         <div>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={center}
//                 zoom={10}
//                 onLoad={onLoad}
//                 onUnmount={onUnmount}
//             >
//                 {/* Child components, such as markers, info windows, etc. */}
//                 <></>
//             </GoogleMap>
//         </div>
//     )
// }

// export default GoogleMapSection