import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser, updatePassword } from '../Slices/userSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state) => state.user.username);
  const password = useSelector((state) => state.user.password);

  const handleLoginClick = (e) => {
    
    fetch('/user/login/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then((data) => data.json())
    .then((parsed) => {
      console.log(parsed);
      if(parsed.username) {
        console.log('Found')
        navigate('/homepage');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    }); 
  };

  return (
    <div className="grid bg-blue-200 shadow w-screen h-screen">
      <div className="self-center justify-self-center border shadow bg-blue-500 p-8 rounded-xl w-1/2 h-1/2">
        <div className="grid gap-2 justify-center content-center h-full w-full">
          <h1 className="text-5xl font-bold text-gray-700 justify-self-center">Rat Stats</h1>
          <div>
            <input type="text" 
            id="username" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="username" 
            onChange={(e) => dispatch(updateUser(e.target.value))}
            required/>
          </div>
          <div>
            <input type="password" 
            id="password" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Password" 
            onChange={(e) => dispatch(updatePassword(e.target.value))}
            required/>
          </div>
          <div className="flex flex-row justify-between p-4">
            <a className="border shadow bg-red-500 justify-self-center" href={'/signup'}>Signup</a>
            <button className="border shadow bg-green-500 justify-self-center" onClick={handleLoginClick} >Login</button>
            <a className="border shadow bg-green-500 justify-self-center" href={'/oauth/login'}>Login with Tinder</a>
          </div>
        </div>
      </div>
    </div>
  )
}