import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/note');
    }
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password };
      const response = await axios.post('http://localhost:8888/customer/login', userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      navigate('/note');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSignIn} className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 w-1/3 mt-10">
        <h2 className='text-3xl font-bold text-center'>Login</h2>
        <div className="my-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="input input-bordered w-full"
          />
        </div>
        <button className="btn btn-warning w-full" type="submit">
          Sign In
        </button>
      </form>
    </div>
  )
}

export default Login