import React, { useState, useEffect, useRef } from 'react';

import { CompanyNews, CompanyProfile , FetchStockCurrentPrice} from '../../firebase/stockapi';


// export const GetCompanyNews = ({ stockSymbol }) => {
//     const [news, setNews] = useState([]);

//     const settings = {
//         dots: true,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 1,
//         slidesToScroll: 1
//     };


//     useEffect(() => {
//         const fetchNews = async () => {
//             try {
//                 const data = await CompanyNews(stockSymbol);
//                 setNews(data);
//                 console.log('News:', data);
//             } catch (error) {
//                 console.error('Error fetching news:', error);
//             }
//         };

//         fetchNews();
//     }, [stockSymbol]); //run whenever value of stockSymbol changes

//     return (
//         <div>
//             <h2>Company News</h2>
//             <Slider {...settings}> {/* Use Slider component with settings */}
//                 {news.map((item, index) => (
//                     <div key={index}>
//                         <a href={item.url}>"{item.headline}"</a>
//                         <div className="flex justify-center">
//                         <img src={item.image} alt="News Image" style={{ width: '400px', height: '300px' }} loading="lazy" />
//                         </div>
//                     </div>
//                 ))}
//             </Slider>
//         </div>
//     );
// }

export const GetCompanyNews = ({ stockSymbol }) => {
    const [news, setNews] = useState(null); // Initialize state with null

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await CompanyNews(stockSymbol);
                if (data) {
                    // If data is not empty, set the first news item
                    setNews(data);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [stockSymbol]);

    return (
        <div>
            {news && ( // Conditional rendering based on the existence of news
                <ul>
                    <li>
                        <a href={news.url} className="text-blue-500 underline">{news.headline}</a><br /><br />
                        <div className="flex justify-center"> {/* Center the image horizontally */}
                            <img
                                src={news.image || 'https://media.istockphoto.com/id/1345527119/video/graphical-modern-digital-world-news-studio-loop-background.jpg?s=640x640&k=20&c=cr1SYYf7Dix-TgBqiYRLquAmi7TgEE3oZcMUExQ25QY='}
                                alt="News Image"
                                style={{ width: '400px', height: '300px' }}
                            />
                        </div><br/>
                        <h2 className="font-bold underline">Summary</h2><br/>
                        <p>"{news.summary}"</p> {/* Display the news summary */}


                    </li>
                </ul>
            )}
        </div>
    );
};



//showing the stock news in a modal
export const StockModal = ({ isOpen, onClose, stockSymbol }) => {
    const [modalOpen, setModalOpen] = useState(isOpen); // Initialize modal state with isOpen prop

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        onClose(); // Call onClose prop to handle closing modal in parent component
    };

    return (
        <>
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg">
                        <div>
                            <h2 className="mb-4 font-bold">Today News for {stockSymbol}</h2>
                            <GetCompanyNews stockSymbol={stockSymbol} />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCloseModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const CompanyLogoComponent = ({ stockSymbol }) => {
    const [logoUrl, setLogoUrl] = useState('');

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const profile = await CompanyProfile(stockSymbol);
                const logoUrl = profile.logo;
                setLogoUrl(logoUrl);
            } catch (error) {
                console.error('Error fetching logo:', error);
            }
        };

        fetchLogo();
    }, [stockSymbol]);

    return (
        <img src={logoUrl} alt={`${stockSymbol} Logo`} className="h-16 w-auto mx-auto" />
    );
};



export const StockCurrentPrice = ({ stockSymbol }) => {
    const [currentPrice, setCurrentPrice] = useState('');

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const priceData = await FetchStockCurrentPrice(stockSymbol);
                const currentPrice = priceData.c;
                setCurrentPrice(currentPrice);
                console.log()
            } catch (error) {
                console.error('Error fetching price:', error);
            }
        };

        fetchPrice();
    }, [stockSymbol]);

    return (
        <p className="text-center text-sm" style={{ color: "black" }}>Real-Time Price: {currentPrice} </p>
    );
}

