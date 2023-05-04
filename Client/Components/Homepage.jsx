import React, { useState, useCallback, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from '@react-google-maps/api';
import { Avatar } from 'flowbite-react';
import SightingForm from './SightingForm.jsx';
import { icon } from 'leaflet';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_LOCATION, UPDATE_USER } from '../Slices/sightingSlice';

import {
  updateUser,
  updatePassword,
  updateSightings,
  updateProfile_Picture,
  updateFavorite_Rat,
  updateCreated_At,
} from '../Slices/userSlice';

const center = {
  lat: 40.747749,
  lng: -73.993474,
};

function Homepage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.MAPS_API,
  });
  const Navigate = useNavigate();

  // state for the google map
  const [map, setMap] = useState(null);
  const [info, setInfo] = useState(false);
  const [infoLocation, setInfoLocation] = useState({ lat: 0, lng: 0 });

  // state for the markers to show up after you click
  const [markerList, setMarkerList] = useState([]);
  // const [markerListInfo, setMarkerListInfo] = useState([]); // for testing until backend works

  //state for rat sightings to pop up from 311 API
  const [rat311List, setRat311List] = useState([]);
  const [markersArray, setMarkersArray] = useState([]);
  const [ratPics, setRatPics] = useState([
    'https://www.treehugger.com/thmb/Se5V44Wpt4NMz3w2pIR6TCJhLhI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2014__01__Blue-blanket-JF_0-5e09e9b9268f483fbd3f2da2d25418d3.jpg',
    'https://cdn.pixabay.com/photo/2023/01/12/07/19/rat-7713508_1280.jpg',
    'https://mystart.com/blog/wp-content/uploads/capture04-1280x800-1.png',
    'https://images.unsplash.com/photo-1614090332617-e7dd5bd107e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y3V0ZSUyMHJhdHxlbnwwfHwwfHw%3D&w=1000&q=80',
    'https://cdn1.tedsby.com/storage/3/4/8/348550/cute-mouse-realistic-soft-plush-toy-teddy-stuffed-baby-rat.jpg',
    'https://cdn.pixabay.com/photo/2023/01/23/15/02/beaver-rat-7738914_1280.jpg',
    'https://pixabay.com/photos/mouse-rodent-rat-mice-pest-3194768/',
    'https://pixabay.com/photos/cute-rodent-mouse-small-animal-3284412/',
    'https://cdn.pixabay.com/photo/2019/03/23/11/00/rat-4075129_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/03/05/22/19/animal-1239250_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/07/19/13/36/rat-2519097_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/07/19/13/36/rat-2519097_1280.jpg',
    'https://cdn.pixabay.com/photo/2018/07/12/20/24/rat-3534317_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/02/03/17/07/cat-1177483_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/03/05/22/20/animal-1239256_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/09/28/00/50/roof-rat-961499_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/05/12/22/19/rats-small-rats-1388830_1280.jpg',
    'https://www.thesprucepets.com/thmb/MwwLBmk3vAewAbrH0JOC2OVjPEc=/4256x0/filters:no_upscale():strip_icc()/cute-white-rat-120691475-58a5f3ea5f9b58a3c9067915.jpg',
    'https://laughingsquid.com/wp-content/uploads/2017/07/herjan-flower-e1500646741507.jpg',
    'https://wallpapers.com/images/high/cute-rat-pictures-zkryt32mqddn2n1r.webp',
    'https://wallpapers.com/images/high/cute-rat-pictures-zkryt32mqddn2n1r.webp',
    'https://rlv.zcache.ca/cute_dumbo_rat_stickers-r841151d3194445e5a8330cb28f16deb1_0ugmc_8byvr_630.jpg?view_padding=%5B285%2C0%2C285%2C0%5D',
    'https://media.istockphoto.com/id/1052049312/photo/cute-white-pet-rat-portrait-with-black-background.jpg?s=612x612&w=0&k=20&c=ra-sBFEKY-MRuSEC3vMFc3sWwjYM3JQl1Bq6lNvjBc4=',
    'https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_1400/MTk3MDY1NDMyNTM5MDc5OTk5/fancy_rat_types.webp',
    'https://t4.ftcdn.net/jpg/02/98/83/83/360_F_298838382_eIUHV1oJGgejdgYVhMklu9p3Gax2lSqF.jpg',
  ]);

  const getRandomRatPic = (ratPics) => {
    const ind = Math.floor(Math.random() * ratPics.length);
    return ratPics[ind];
  };
  // get password and username from redux state
  const dispatch = useDispatch();
  const password = useSelector((state) => state.user.password);
  const username = useSelector((state) => state.user.username);
  const picture = useSelector((state) => state.user.profile_picture);

  // info window state
  const [selectedSighting, setSelectedSighting] = useState(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const ssid = useSelector((state) => state.user.ssid);

  /**
   * Google Maps onload and onunmount functions
   */
  // Functionality when map loads. Unique to maps api
  const onLoad = useCallback((map) => {
    // get and load map instance
    console.log('loaded');
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
    //map.controls[google.maps.ControlPosition.TOP_CENTER].push(MapControl());
  }, []);

  // functionality when map dismounts. Unique to maps api
  const onUnmount = useCallback((map) => {
    console.log('unMounted');
    setMap(null);
  }, []);

  const handleFormSubmit = () => {
    // setIsInfoWindowOpen(false); // Reset the info state to false after form submission
    setInfo(false);
  };

  //functionality to fetch rat sightings from 311 API and populate
  useEffect(() => {
    (async () => {
      try {
        const getRat = await fetch(
          'https://data.cityofnewyork.us/resource/3q43-55fe.json/',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const ratDataTojson = await getRat.json();
        const ratData = ratDataTojson.map((data, index) => {
          return (
            <Marker
              key={index}
              position={{
                lat: Number(data.latitude),
                lng: Number(data.longitude),
              }}
              icon={{
                url: 'https://i.pinimg.com/originals/cb/b4/c0/cbb4c0a57ae3f09c6974f7ea08f966b6.png',
                anchor: new window.google.maps.Point(16, 16),
                origin: new window.google.maps.Point(0, 0),
                scaledSize: new window.google.maps.Size(35, 35),
              }}
            />
          );
        });
        setRat311List(ratData);
      } catch (error) {
        console.log('unable to fetch rats:', error);
      }
    })();
  }, []);

  /**
   *
   * @param {*} e the event info of the mouse click
   * https://developers.google.com/maps/documentation/javascript/examples/event-click-latlng
   * Will return different events based on if the user clicked on a random point,
   * or if they clicked on one of our markers
   */
  const handleMouseClick = (e) => {
    const location = e.latLng.toJSON(); // location of the mouse click

    setInfoLocation(location);
    // Check if the click is on a rat sighting marker
    const clickedMarker = markerList.find((marker) => {
      const markerPosition = marker.props.position;
      return (
        markerPosition.lat === location.lat &&
        markerPosition.lng === location.lng
      );
    });

    if (clickedMarker) {
      // Clicked on a rat sighting marker
      // setIsInfoWindowOpen(true);
      setSelectedSighting(clickedMarker.key);
      setInfoLocation(clickedMarker.props.position); // Update infoLocation with marker position
    } else {
      // Clicked on an empty space, open the sighting form
      setInfo(true);
    }

    // Update this information in redux
    dispatch(UPDATE_LOCATION(location));
  };

  // use effect to update the user in sightings slice once homepage is reached
  useEffect(() => {
    (async () => {
      try {
        const getUser = await fetch(
          '/sql/user?' +
            new URLSearchParams({
              username: username,
            }),
          new URLSearchParams({
            username: username,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await getUser.json();
        console.log(data);
        if (data === null) {
          // create user
          console.log('here');
          try {
            const createUser = await fetch('/sql/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                ssid: ssid, // authentication purposes, unsure how it works
              }),
            });
            // add create user info to redux
            const data = await createUser.json();
          } catch (err) {
            console.log(err);
            console.log('error creating user in db');
          }
        }
        console.log(data.created_At);
        dispatch(updateSightings(data.number_sightings));
        dispatch(updateProfile_Picture(data.profile_picture));
        dispatch(updateFavorite_Rat(data.favorite_rat));
        dispatch(updateCreated_At(data.created_at));
      } catch (err) {
        console.log(err);
        console.log('error fetching user from db');
      }
    })();
    // create markerList by fetching all the sightings from the database,
    // and populating them into marker objects
    fetch('/sql/sighting/all')
      .then((response) => response.json())
      .then((data) => {
        // Create marker objects for fetched sightings
        // const zoomLevel = map?.getZoom();
        // const scaledSize = new window.google.maps.Size(2000 / zoomLevel, 100 / zoomLevel);
        const markersArr = data.map((sighting) => ({
          id: sighting.id,
          position: { lat: sighting.lat, lng: sighting.lng },
        }));
        const markers = data.map((sighting) => (
          <Marker
            key={sighting.id}
            position={{ lat: sighting.lat, lng: sighting.lng }}
            icon={{
              url: 'https://i.ibb.co/TR1B5G5/My-project-2.png',
              anchor: new window.google.maps.Point(16, 16),
              origin: new window.google.maps.Point(0, 0),
              scaledSize: new window.google.maps.Size(70, 40),
            }}
            onClick={(e) =>
              handleMarkerListClick(
                sighting.id,
                map,
                markersArray,
                infoLocation
              )
            }
          />
        ));

        // update marker list state with the created markers
        setMarkerList(markers);
        setMarkersArray(markersArr);
      })
      .catch((error) => {
        console.error('Error fetching sightings:', error);
      });

    function handleMarkerListClick(id, map, markersArray, infoLocation) {
      // console.log(markerList)
      // console.log("infoLocation: ", infoLocation)
      if (id === selectedSighting) {
        // Clicked on the same marker again, close the info window
        // setIsInfoWindowOpen(false);
        setSelectedSighting(null);
      } else {
        // Clicked on a different marker, fetch the rat info and open the info window
        fetch(`/sql/sighting/${id}`)
          .then((response) => response.json())
          .then((sighting) => {
            if (sighting) {
              console.log('sighting id: ', sighting.id);
              console.log('sighting info: ', sighting);

              const ratId = parseInt(sighting.ratId);
              console.log('ratId: ', sighting.ratId);
              fetch(`/sql/sighting/rat/${ratId}`)
                .then((response) => response.json())
                .then((ratInfo) => {
                  console.log('ratInfo: ', ratInfo);
                  const ratPic = getRandomRatPic(ratPics);
                  console.log(ratPic);
                  const infoWindow = new window.google.maps.InfoWindow({
                    position: { lat: sighting.lat, lng: sighting.lng },
                    anchor: markersArray.find((marker) => marker.key === id),
                    content: `
                      <div class="max-w-sm bg-mirisyellow rounded overflow-hidden shadow-lg bg-white flex justify-center items-center" style="height: 100%;">
                        <div class="p-4 text-center">
                          <div class="space-y-2">
                            <img src="${ratPic}" alt="Cute Rat" style="max-width: 50%; border: 1px solid #ccc; border-radius: 5px; display: block; margin: 0 auto;"></img>
                            <p class="text-l font-bold uppercase">My name is: ${
                              ratInfo.name
                            }</p>
                            <p class="text-m text-black">Here are some facts about me:</p>
                            <div class="border-2 rounded-sm">
                              <p class="text-sm text-black">${
                                ratInfo.description
                              }</p>
                            </div>
                            <p class="text-s italic text-gray-500">I was reported on: ${new Date(
                              sighting.time
                            ).toLocaleString()} by user${sighting.userId}</p>
                          </div>
                        </div>
                      </div>
                    `,
                  });

                  if (map && map instanceof window.google.maps.Map) {
                    // Check if map object is available
                    // Open the info window at the marker's position
                    infoWindow.open(
                      map,
                      markerList.find((marker) => marker.key === id)
                    );
                  } else {
                    console.log('Map not loaded');
                  }
                })
                .catch((error) => {
                  console.error('Error fetching rat info:', error);
                });
            } else {
              console.log('Rat not found');
            }
          })
          .catch((error) => {
            console.error('Error fetching rat:', error);
          });
      }
    }
  }, [map]);

  const addToMarkerList = (position) => {
    const newMarker = (
      <Marker
        key={JSON.stringify(position)}
        position={position}
        icon={{
          url: 'https://i.ibb.co/TR1B5G5/My-project-2.png',
          anchor: new window.google.maps.Point(16, 16),
          origin: new window.google.maps.Point(0, 0),
          scaledSize: new window.google.maps.Size(80, 48),
        }}
        onClick={(e) =>
          handleMarkerListClick(sighting.id, map, markersArray, infoLocation)
        }
      />
    );
    setMarkerList((current) => [...current, newMarker]); // adds a new marker to the list
  };

  const goToHomepage = (e) => {
    Navigate('/leaderboard');
  };

  return isLoaded ? (
    <div className="flex flex-col justify-center items-center h-screen w-screen p-10 py-3 bg-mirispink">
      {/*Header */}
      <div className="flex flex-row w-screen h-1/6 justify-between items-end p-8 py-5">
        <h1 className="text-4xl text-gray-600 text-center font-mono font-extrabold">
          Welcome to Rat Stats Premium
        </h1>
        <div className="flex">
          <button
            className="text-1xl shadow rounded-xl p-2 text-gray-600 bg-mirisyellow hover:bg-mirisblue font-mono"
            onClick={goToHomepage}
          >
            Rat Leaderboard
          </button>

          <Link to={'/profile'}>
            <Avatar img={picture} className="px-10" rounded={true} size="md" />
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
          onClick={handleMouseClick}
        >
          {markerList}
          {rat311List}
          {info && (
            <InfoWindow
              position={infoLocation}
              anchor={markerList.find(
                (marker) => marker.key === selectedSighting
              )}
            >
              <div>
                <SightingForm
                  username={username}
                  addToMarkerList={addToMarkerList}
                  onSubmit={handleFormSubmit}
                  setInfo={setInfo}
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(Homepage);
