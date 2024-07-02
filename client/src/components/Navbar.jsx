import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/edv-logo.png'

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/');
    };

    return (
        <div className="bg-base-100 shadow-md">
            <div className="mx-auto max-w-7xl">
                <div className="navbar">
                    <div className="flex-1">
                        <Link to="/" className='flex'>
                            <img src={logo} alt="" width={70} />
                            <div className="text-3xl font-bold ms-2">
                                EdVISORY Note
                            </div>
                        </Link>
                    </div>
                    <div className="flex-none">
                        {token ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost">
                                    <p>{userEmail}</p>
                                </div>
                                <ul
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[2] mt-3 w-32 p-2 shadow"
                                >
                                    <li>
                                        <button onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className="btn btn-outline btn-warning">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-warning ms-3">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
