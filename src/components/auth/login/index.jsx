import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/authContext'


const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const validateForm = () => {
        let valid = true;

        // Validate email
        if (!email) {
            setEmailError('Email is required');
            valid = false;
        } else {
            setEmailError('');
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    };

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log("Submitting form");
        if(!isSigningIn && validateForm()) {
            setIsSigningIn(true)
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                setIsSigningIn(false);
                
                if (error.code === "auth/invalid-credential") {
                    setErrorMessage("Invalid email or password. Please try again.");
                } else {
                    setErrorMessage(error.message);
                }
            }
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div className="flex h-screen">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            {/* <main className="w-full h-screen flex "> */}
            
            {/*<img src="croptest.gif" alt="Description of Image" width="800px" style={{ float: 'right', marginRight: 100, marginLeft: 100 }} />*/}
            {/* <img src="logocrop.gif" alt="Description of Image" className="h-full" style={{ minWidth: '10%' }} /> */}


            <main className="w-full h-screen flex justify-center items-center">
            <div className="photo">
                        <img src="finallogo.gif" alt="Description of Photo" className="h-full w-full object-cover" />
                </div>

                <div className="w-full max-w-xl h-screen text-gray-600 space-y-5 p-10 shadow-xl border bg-white">
                    <div className="text-center">
                        <img src="logo.png" alt="Description of Image" width="100px" />
                        <span style={{ marginLeft: '10px' }}>Login to your account</span>
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Welcome Back</h3>
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                            {emailError && (<span className='text-red-600 font-bold'>{emailError}</span>)}
                        </div>
                        <div>
                        <label className="text-sm text-gray-600 font-bold">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle input type based on showConfirmPassword state
                                autoComplete="off"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} // Toggle showConfirmPassword state
                                className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
                            >
                                {showPassword ? (
                                    // Eye icon when confirm password is visible
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.071 12.122a9 9 0 11-14.142 0 9 9 0 0114.142 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                ) : (
                                    // Eye icon when confirm password is hidden
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 15a6 6 0 11-12 0 6 6 0 0112 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}
                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm">
                        <Link to={'/forgot-password'} className="hover:underline font-bold">Forgot your password?</Link>
                    </p>

                    <p className="text-center text-sm">Don't have an account? <Link to={'/register'} className="hover:underline font-bold">Sign up</Link></p>
                    <div className='flex flex-row text-center w-full'>
                        <div className='border-b-2 mb-2.5 mr-2 w-full'></div>
                        <div className='text-sm font-bold w-fit'>OR</div>
                        <div className='border-b-2 mb-2.5 ml-2 w-full'></div>
                    </div>
                    <button
                        disabled={isSigningIn}
                        onClick={(e) => { onGoogleSignIn(e) }}
                        className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${isSigningIn ? 'cursor-not-allowed' : 'hover:bg-gray-100 transition duration-300 active:bg-gray-100'}`}>
                        <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_17_40)">
                                <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                                <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                                <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#FBBC04" />
                                <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                            </g>
                            <defs>
                                <clipPath id="clip0_17_40">
                                    <rect width="48" height="48" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                    </button>
                </div>

            </main>
        </div>
    )
}

export default Login