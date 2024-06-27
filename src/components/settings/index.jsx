import React from "react";
import { Navbar } from "../../components/navbar"; // Adjust the path based on the directory structure
import { DarkModeToggle } from "../profile/DarkModeToggle";
import { Profile } from "../profile/index";
import { useColorScheme } from "../profile/useColorScheme"; // Import the useColorScheme hook

const Settings = () => {
  const { isDark } = useColorScheme(); // Get the dark mode state

  return (
    <div className={`flex flex-column md:flex-row h-full ${isDark ? 'dark' : ''}`}>
      {/* Navbar */}
      <Navbar />
      

      {/* Settings content */}
      <div className={` mx-auto px-4 py-8 flex-grow ${isDark ? 'dark' : ''}`}>
        {/* Profile */}
        <div className="mb-8">
          <Profile />
        </div>

        {/* Accessibility Settings */}
        <section className="mb-8">
          <div className={`container max-w-4xl mx-auto p-4 rounded-lg shadow border-2 border-black ${isDark ? 'dark' : ''}`}>
            {/* Accessibility title */}
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-black'}`}>Accessibility</h2>
            {/* Flex container for alignment */}
            <div className="flex items-center">
              {/* Dark Mode label */}
              <label htmlFor="darkModeToggle" className={`text-lg font-semibold mr-4 ${isDark ? 'text-white' : 'text-black'}`}>Dark Mode</label>
              {/* Dark Mode toggle button */}
              <DarkModeToggle id="darkModeToggle" />
            </div>
          </div>
        </section>

        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default Settings;