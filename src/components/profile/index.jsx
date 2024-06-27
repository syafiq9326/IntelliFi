import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Navbar } from "../../components/navbar"; // Adjust the path based on the directory structure
import { fetchProfile, updateProfile } from "../../firebase/profile";
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "../profile/DarkModeToggle";
import ImageUpload from "../profile/ImageUpload";
import { useColorScheme } from "../profile/useColorScheme"; // Import the useColorScheme hook


export const Profile = () => {
  const { isDark } = useColorScheme(); // Get the dark mode state
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    email: "", // Default value or use currentUser.email if already available
    name: "",
    surname: "",
    phone: "",
    country: "",
    picture: "", // Default picture URL or an empty string
  });
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Define setErrorMessage


  useEffect(() => {
    const initProfile = async () => {
      if (currentUser) {
        const profileData = await fetchProfile(
          currentUser.uid,
          currentUser.email
        );
        setProfile(profileData);
      }
    };
    initProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the event target
  
    setProfile((prevState) => ({
      ...prevState, // Spread the previous state to retain existing profile info
      [name]: value, // Update the changed field dynamically using computed property names
    }));
  };

  const Notification = ({ message }) => (
    <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-xl shadow">
      {message}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(profile.phone)) {
      setErrorMessage("Phone Number must contain only numbers!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      // Assume updateProfile() is your function to update the profile
      await updateProfile(currentUser.uid, profile);
      setShowNotification(true); // Show the notification
      setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error case
    }
  };

  return (
    <div 
    >
      {/* <Navbar /> */}
      <div className="flex flex-grow items-center space-between mt-[60px]">
      <div className="fixed top-5 right-5">
        {showNotification && (
          <Notification message="Profile updated successfully!" />
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white py-2 px-4 rounded-xl shadow">{errorMessage}</div>
        )}
      </div>
        <div className={`overview1 max-w-4xl mx-auto p-8 rounded-lg shadow border-2 border-black ${isDark ? 'dark' : ''}`}>
          <h2 className="text-2xl font-semibold mb-2 " >User account</h2>
          <p className="mb-10 text">
            Update your photo and personal details here.
          </p>

          {/* Image and Name */}
          <div className="flex items-center mb-10">
            <img
              className="rounded-full border-2 border-gray-700 h-24 w-24 "
              src={profile.picture}
            />
            <div className="ml-4">
              <div className="font-bold text-xl">
                {profile.name} {profile.surname}
              </div>
              {/*<div className="text-gray-600">Verified account</div>*/}
            </div>
            <div className="flex items-center mb-10">
              <div style={{ marginRight: "300px" }}> {/* Add margin to the right */}
                <ImageUpload picture={profile.picture} setPicture={(newPicture) => setProfile((prevProfile) => ({ ...prevProfile, picture: newPicture }))} hidden />
              </div>
              {/* Other content */}
            </div>
            

          </div>



          {/*<ImageUpload picture={profile.picture} setPicture={(newPicture) => setProfile((prevProfile) => ({ ...prevProfile, picture: newPicture }))} />*/}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
              {/* Email field */}
              <div className="w-full px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" style={{ color: "black" }}
                  id="email"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              {/* Name field */}
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" style={{ color: "black" }}
                  id="name"
                  type="text"
                  placeholder="Jane"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  
                />
              </div>
              {/* Surname field */}
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="surname"
                >
                  Surname
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="surname"
                  type="text"
                  placeholder="Doe"
                  name="surname"
                  value={profile.surname}
                  onChange={handleChange}
                />
              </div>
              {/* Phone field */}
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="phone"
                  type="text"
                  placeholder="123-456-7890"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
              {/* Country field */}
              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="country"
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;