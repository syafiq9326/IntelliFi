import React from 'react';
import { useContext, createContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth'



export const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className="flex h-full">
            {/* Sidebar */}


            <div className="w-64 bg-purple-800 text-white flex flex-col justify-between" style={{ backgroundColor: "#152238" }}>
                <div className="py-4 px-6">
                    <ul className="space-y-4">

                        {/* creating space (need to debug css here) */}
                        {/* <li>
                            <Link to="/" className="text-gray-300 hover:text-white transition duration-300">Home</Link>
                        </li> */}

                        {/* sidebar content starts here */}
                        <li>
                            <Link to="/home" className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2">
                                <img src="logo.png" alt="Logo" className="w-30 h-30 mr-3 group-hover:scale-110" />
                            </Link>



                            <div className="text-xl font-bold pt-14 holdingtracker">
                                <h2>My Holdings</h2><br />
                            </div>

                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/9735/9735704.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />
                                <Link to="/overview" className="text-white hover:text-black">Overview</Link>
                            </div><br />

                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/3843/3843966.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />
                                <Link to="/holdings" className="text-white hover:text-black">My Stocks</Link>
                            </div>

                            <div className="text-xl font-bold pt-14 expensetracker">
                                <h2>Expense Tracker</h2>
                            </div><br />

                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/126/126157.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />
                                <Link to="/expenses" className="text-white hover:text-black">Expenses</Link>
                            </div>

                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2 ">
                                <img src="https://cdn-icons-png.flaticon.com/512/950/950984.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />
                                <Link to="/income" className="text-white hover:text-black">Income</Link>
                            </div><br /><br /><br />
                            {/* 
                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/126/126472.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />
                                <Link to="/profile" className="text-white hover:text-black">Settings</Link>
                            </div><br /> */}

                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2 settingclass">
                                <img src="https://cdn-icons-png.flaticon.com/512/126/126472.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />
                                <Link to="/settings" className="text-white hover:text-black">Settings</Link>
                            </div>



                            <div className="group py-2 px-6 flex items-center transition duration-300 ease-in-out transform hover:translate-x-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/126/126467.png" alt="Logo" className="w-10 h-10 mr-3 group-hover:scale-110" style={{ filter: 'invert(100%)' }} />

                                <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} >Logout</button>
                                {/* 
                                <Link to="/holdings" className="text-white hover:text-black">Logout</Link> */}
                            </div>


                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white">
                {/* Your main content goes here */}
            </div>
        </div>
    );
};


