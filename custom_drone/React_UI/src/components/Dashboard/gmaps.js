import React from 'react';
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>(
  <GoogleMap
    // mapTypeId={props.maps.MapTypeId.SATELLITE}
    defaultZoom={17}
    defaultCenter={{ lat: 21.1378419, lng: 78.7403725 }}
  >
    {<Marker position={{ lat: props.lat, lng: props.lng }} />}
  </GoogleMap>
))


export default MyMapComponent
