import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { updateUser } from '../Slices/userSlice';

export default function Signup() {
  // const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const handleSignupClick = () => {
    const username = document.getElementById('Username').value;

    if (password === verifyPassword) {
      fetch('/user/signup/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } 
  };

  return (
    <div className="grid bg-blue-200 shadow w-screen h-screen">
          <div className="self-center justify-self-center border shadow bg-blue-500 p-8 rounded-xl w-1/2 h-1/2">
            <div className="grid gap-2 justify-center content-center h-full w-full">
              <h1 className="text-5xl font-bold text-gray-700 justify-self-center">Rat Stats</h1>
              <h1 className="text-xl font-bold text-gray-700 justify-self-center">Sign up for an Account</h1>
              {/*username input*/}
              <div>
                <input type="text" 
                id="Username" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Username" 
                required/>
              </div>

              {/*password input*/}
              <div>
                <input type="password" 
                id="password" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Password" 
                required/>
              </div>
              {/*re-enter password*/}
              <div>
                <input type="password" 
                id="verify-password" 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Re-Enter Password" 
                required/>
              </div>
              <div className="flex flex-row justify-center p-4">
                <a className="border shadow bg-green-500 justify-self-center" href={'/homepage'}>Create Account</a>
              </div>
            </div>
          </div>
        </div>
  );
};