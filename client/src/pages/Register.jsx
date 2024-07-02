import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/note');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { username, email, password }
      const response = await axios.post("http://localhost:8888/customer/register", userData)
      console.log(response.data.message);
      navigate("/login")
    } catch (error) {
      console.error(error.response.data.message);
    }

  }
  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 w-1/3 mt-10" method='post'>
        <h2 className='text-3xl font-bold text-center'>Signup</h2>
        <div className="my-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button className="btn btn-warning w-full" type="submit">
          Signup
        </button>
      </form>
    </div>
  )
}

export default Register