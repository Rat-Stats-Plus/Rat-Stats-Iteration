import React, { useEffect, useState } from 'react';
import { Avatar } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

export default function Profile() {
  const currentState = useSelector((state) => state.user);
  const [sightings, setSightings] = useState([]);
  const [sightingsComponents, setSightingsComponents] = useState([]);

  useEffect(() => {
    async function getAllUserSitings(user) {
      try {
        const response = await fetch('/sql/getallsightings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: user }),
        });
        let data = await response.json();
        setSightings(curr => [...curr, ...data.rows]);
      } catch (err) {
        console.log(err);
      }
    }
    getAllUserSitings(currentState.username);
  }, []);

  useEffect(() => {
    const temp = sightings.map((sighting, index) => (
      <div key={index} className="border shadow w-full flex flex-col">
        <p>Rat Name: {sighting.rat_name}</p>
        <p>Location: {sighting.location}</p>
        <p>Description: {sighting.rat_description}</p>
      </div>
    ));
    setSightingsComponents(temp);
  }, [sightings]);

  return (
    <div className="flex flex-col p-8 bg-blue-100 shadow justify-evenly py-20 items-center h-screen w-screen">
      <h1 className="text-5xl text-gray-600">Profile</h1>
      <Avatar className="p-5" rounded={true} size="xl"/>
      <h1 className="text-2xl text-gray-600">Username: {currentState.username}</h1>
      <h1 className="text-2xl text-gray-600">Favorite Rat: {currentState.favorite_rat}</h1>
      <h1 className="text-2xl text-gray-600">Number of Sightings: {currentState.number_sightings}</h1>
      <h1 className="text-2xl text-gray-600">Created At: {currentState.created_at}</h1>
      <div>
        {sightingsComponents}
      </div>
      <Link to="/homepage" className="flex border bg-col2 shadow rounded-xl p-2 w-1/12 justify-center">
        <p>Back</p>
      </Link>
    </div>
  );
};
