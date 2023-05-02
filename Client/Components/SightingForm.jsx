import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UPDATE_RAT,
  UPDATE_DESCRIPTION,
  UPDATE_USER
} from '../Slices/sightingSlice';
import axios from 'axios';

export default function SightingForm({ username, addToMarkerList, marketListInfo }) {
  const dispatch = useDispatch();

  const sightingState = useSelector((state) => state.sighting.location);
  const ratName = useSelector((state) => state.sighting.ratName);
  const description = useSelector((state) => state.sighting.description);
  const { lat, lng } = sightingState;

  useEffect(() => {
    dispatch(UPDATE_USER(username));
  }, [dispatch, username]);

  async function onClick(e) {
    e.preventDefault();

    const sightingData = {
      ratName,
      description,
      location: { lat, lng },
      time: new Date()
    };

    addToMarkerList({ lat, lng });

    try {
      await axios.post('/sql/sighting', sightingData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-lg font-bold text-gray-600">Location:</h1>
      <div className="flex flex-row justify-around w-full">
        <p className="text-gray-600 font-bold">Lat: <span className="font-normal">{lat.toFixed(2)}</span></p>
        <p className="text-gray-600 font-bold">Lng: <span className="font-normal">{lng.toFixed(2)}</span></p>
      </div>
    
      <form className="flex flex-col">
        <input type="text" onChange={(e) => dispatch(UPDATE_RAT(e.target.value))} placeholder='Rat Name'></input>
        <input className="h-[150px]"type="text" onChange={(e) => dispatch(UPDATE_DESCRIPTION(e.target.value))} placeholder='Description'></input>
        <button className="border shadow text-gray-600" onClick={onClick}>Submit Sighting</button>
      </form>
    </div>
  );
}