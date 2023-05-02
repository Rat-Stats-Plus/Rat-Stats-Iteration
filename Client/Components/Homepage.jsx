import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from '@react-google-maps/api';
import { Avatar } from 'flowbite-react';
import SightingForm from './SightingForm.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    UPDATE_LOCATION,
    UPDATE_USER
} from '../Slices/sightingSlice';

// import {
//   updateUser,
//   updatePassword,
//   updateSightings,
//   updateProfile_Picture,
//   updateFavorite_Rat,
//   updateCreated_At,
// } from '../Slices/userSlice'

const center = {
  lat: 40.747749,
  lng: -73.993474 ,
}

function Homepage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script', 
    googleMapsApiKey: process.env.MAPS_API,
  })
  const Navigate = useNavigate();
  
  // state for the google map
  const [map, setMap] = useState(null);
  const [info, setInfo] = useState(false);
  const [infoLocation, setInfoLocation] = useState({lat: 0, lng: 0})

  // state for the markers
  const [markerList, setMarkerList] = useState([])
  const [markerListInfo, setMarkerListInfo] = useState([]) // for testing until backend works

  // get password and username from redux state
  const dispatch = useDispatch();
  const password = useSelector((state) => state.user.password);
  const username = useSelector((state) => state.user.username);

  // Functionality when map loads. Unique to maps api
  const onLoad = useCallback((map) => {
    // get and load map instance
    console.log('loaded');
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(MapControl());
  }, [])

  // functionality when map dismounts. Unique to maps api
  const onUnmount = useCallback((map) => {
    console.log('unMounted');
    setMap(null);
  }, [])

  /**
   * 
   * @param {*} e the event info of the mouse click
   * https://developers.google.com/maps/documentation/javascript/examples/event-click-latlng
   * Will return different events based on if the user clicked on a random point,
   * or if they clicked on one of our markers
   */
  const handleMouseClick = (e) => {
    const location = e.latLng.toJSON(); // location of the mouse click
    setInfo(true);
    setInfoLocation(location);

    // update this information in redux
    dispatch(UPDATE_LOCATION(location));
  }


  // use effect to update the user in sightings slice once homepage is reached
  useEffect(() => {
  // TODO: create markerList by fetching all the sightings from the database,
  // and populating them into marker objects


  // const userObj_testing = {
  //   username: 'new',
  //   password: '123',
  //   number_sightings: 3,
  //   favorite_rat: 'fat jody',
  //   created_at: '2023-04-30'
  // }

  //   // Fetch the current user from state, 
  //   // fetch('/user/login/', {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   //   body: JSON.stringify({username, password})
  //   // })
  //   // .then((res) => res.json())
  //   // .then((res)=>{
  //   //   console.log(res);
  //   // })

    // populate state object with fetched request
    // dispatch(updateUser(userObj_testing.username))
    // dispatch(updatePassword(userObj_testing.password))
    // dispatch(updateSightings(userObj_testing.number_sightings));
    // dispatch(updateFavorite_Rat(userObj_testing.favorite_rat));
    // dispatch(updateCreated_At(userObj_testing.created_at));

    // dispatch(UPDATE_USER(userObj_testing.username))
  },[])

  function handleMarkerListClick(e) {
    console.log(e);
    // TODO
    // when it's clicked on, look in the database for a specific position
  }

  const addToMarkerList = (position) => {
    const newMarker = <Marker 
    key={markerList.length} 
    position={position}
    icon={
      {url: 'https://i.ibb.co/TR1B5G5/My-project-2.png',
      scaledSize: new window.google.maps.Size(200, 100)}
    }
    onClick={handleMarkerListClick}
    ></Marker>
    setMarkerList(current => [...current, newMarker]); // adds a new marker to the list
  }


  return isLoaded ? (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-10 py-3">
      {/*Header */}
      <div className="flex flex-row w-screen h-1/6 justify-between items-end p-8 py-5">
        <h1 className="text-4xl text-gray-600">Welcome to Rat Stats!</h1>
        <div className="flex">
          <Link to={'/profile'}>
            <Avatar className="px-10" rounded={true} size="md"/>
          </Link>
        </div>
      </div>
      
      {/**Uncomment and comment out googlemap stuff in order to run without
       * getting charged for api access
       */}
      {/* <div className="container border border-gray-700 shadow h-full w-screen">
        <div>
          <SightingForm/>
        </div>
      </div> */}
      {/** Box holding the google maps stuff */}
      <div className="container border border-gray-700 shadow h-full w-screen">
        <GoogleMap
        mapContainerClassName="h-full w-full"
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        clickableIcons={false}
        onClick={handleMouseClick}>
          {markerList}
          {info && <InfoWindow
          key={`${infoLocation.lat}-${infoLocation.lng}`} // Add this line
          position={infoLocation}>
            <div>
              <SightingForm username={username} addToMarkerList={addToMarkerList} marketListInfo={setMarkerListInfo}/>
            </div>
          </InfoWindow>}
        </GoogleMap>
      </div>
    </div>
  ):
  <></>
}

export default React.memo(Homepage);
