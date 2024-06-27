import React, { useState, useEffect } from 'react';
import { MarketNews } from '../../firebase/stockapi';
import { useColorScheme } from "../profile/useColorScheme"; // Import the color scheme hook

export const GetMarketNews = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark } = useColorScheme(); // Get the dark mode state

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await MarketNews();
        if (data && data.length > 0) {
          setNews(data);
        }
      } catch (error) {
        console.error('Error fetching market news:', error);
      }
    };

    fetchNews();
  }, []);

  const goToPrev = () => {
    setCurrentIndex(prev => prev === 0 ? news.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev === news.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold my-4" style={{ color: isDark ? "white" : "black" }}>Latest Financial News</h2>
      <div className="relative w-full flex items-center">
        <button 
          onClick={goToPrev} 
          className={`absolute left-0 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-4 cursor-pointer text-5xl ${isDark ? 'text-black' : 'text-black'}`}
          aria-label="Previous"
        >
          ‹
        </button>
        <div key={currentIndex} className="relative w-full flex justify-center z-0">
          <div className="max-w-md mx-auto">
            <a href={news[currentIndex]?.url} target="_blank" rel="noopener noreferrer">
              <img 
                src={news[currentIndex]?.image || "https://via.placeholder.com/400x300"} 
                alt={news[currentIndex]?.headline} 
                className="w-50 h-50 object-cover rounded-lg z-0"
              />
              <div className="mt-2">
                <p className="text-lg font-bold" style={{ color: isDark ? "white" : "black" }}>{news[currentIndex]?.headline}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{news[currentIndex]?.summary}</p>
              </div>
            </a>
          </div>
        </div>
        <button 
          onClick={goToNext} 
          className={`absolute right-0 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-4 cursor-pointer text-5xl ${isDark ? 'text-black' : 'text-black'}`}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
};