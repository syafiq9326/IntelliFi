import React, { useState } from 'react';
import { forgotPassword } from '../../../firebase/forgotPassword'; // Import the forgotPassword function
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    try {
      await forgotPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
    } catch (error) {
      setMessage('');
      setError('Error sending password reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="w-full h-screen flex self-center place-content-center place-items-center">
      <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
        <div className="text-center mb-6">
          <div className="mt-2">
            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Reset Password</h3>
          </div>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-bold">
              Email
            </label>
            <input
              type="email"
              autoComplete='email'
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
            />
          </div>
          {message && (
            <span className='text-green-600 font-bold'>{message}</span>
          )}
          {error && (
            <span className='text-red-600 font-bold'>{error}</span>
          )}
          <button
            type="submit"
            disabled={isResetting}
            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isResetting ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
          >
            {isResetting ? 'Resetting...' : 'Reset Password'}
          </button>
          <div className="text-sm text-center">
            Remember your password now? {'   '}
            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Let's go back.</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;