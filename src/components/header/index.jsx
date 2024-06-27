import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top- left-0 h-12 border-b place-content-center items-center bg-gray-200'>


            {
                userLoggedIn
                    ?
                    <div className='text-sm ml-auto flex items-center gap-x-1 mr-20'>
                        <img src="logo.png" alt="Logo" className="w-10 h-10  group-hover:scale-110" />
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} >Logout</button>
                    </div>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/holdings'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header