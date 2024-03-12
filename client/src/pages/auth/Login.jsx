import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useLogin } from '../../hooks/useLogin';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login, errors, isLoading} = useLogin()
  
    const handleSubmit = async (e) => {
      e.preventDefault();   

      await login(email, password)

    };
  
    return (
        <div className="flex justify-center mt-32">
        <div className="w-full max-w-xs">
        <form className="bg-gray-400 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
            </label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text"/>
            {errors.email && <p class="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
            </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border  w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" />
            {errors.password && <p class="text-red-500 text-xs italic">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign In
            </button>
        </div>
        </form>
        </div>
        </div>
    );
  };

export default Login