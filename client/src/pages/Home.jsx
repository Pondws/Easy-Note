import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import noteimg from "../images/addnote.png"

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/note');
    }
  }, [navigate]);

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='flex justify-center items-center h-full mt-16'>
            <img src={noteimg} className='text-center' width={550}/>
          </div>
    </div>
  )
}

export default Home