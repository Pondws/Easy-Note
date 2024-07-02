import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar'

// routes
import Login from './pages/Login'
import Register from './pages/Register'
import Note from './pages/Note'
import Home from './pages/Home'

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <div className='mx-auto max-w-7xl'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/note" element={<Note />} />
        </Routes>
        <ToastContainer
          autoClose={2000}
        />
        </div>
      </BrowserRouter>
    
  )
}

export default App
