import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { Navbar } from '../../components/navbar'; // Adjust the path based on the directory structure

import { AddStock, GetStocks, UpdateStock, UpdateStockPrice, DeleteStock } from '../../firebase/stock';
import { collection, doc, addDoc, getDocs, updateDoc, query, where, onSnapshot } from "firebase/firestore";

import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/firebase';

// import { FormStock } from './crudstock'; 

import { FetchStockCurrentPrice, GetRecommendations, GetRecommendations2 } from '../../firebase/stockapi';

import { Recommendations, TopBuySell, TopSell } from './recommendations';

import { GetCompanyNews, StockModal, CompanyLogoComponent, StockCurrentPrice } from './modalStock';
import { UpdateStockModal } from './updateStock';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FaTrash, FaEdit } from 'react-icons/fa'; // Import FaArrowLeft and FaArrowRight icons
import 'react-multi-carousel/lib/styles.css';

import { StockPieChart } from './stockPieChart';
import { StockBalanceChart, StockTimeSeriesChart } from './stockBalance';

import { ChartRecommendations, RecommendationChart, StockAnalysis, GetStockAnalysisModal } from './recommendations2';
import GaugeChart from 'react-gauge-chart'

import { StockGoalChart } from './stockGoal';

import { TextToSpeech, ActualSpeech } from './textSpeech';


// import EditIcon from '@mui/icons-material/Edit';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Gauge } from 'lucide-react';

//creating a stock
export const CreateStockForm = ({ currentUser }) => {
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [buyPrice, setBuyPrice] = useState(0);
    console.log('Stock form called but nothing created');


    const handleSubmit = async (e) => {
        e.preventDefault();
        AddStock(db, {
            userId: currentUser.uid,
            stockSymbol: symbol,
            stockQuantity: quantity,
            buyPrice: buyPrice,
            stockDate: new Date(),
        })
            .then(() => {
                console.log('Stock added successfully');

                //real time update of current prices
                // UpdateCurrentPrices({ currentUser });
                // Clear form fields after successful addition
                setSymbol('');
                setQuantity(0);
                setBuyPrice(0.0);
                toast.success(`${symbol} added successfully!`, {
                });


            })
            .catch((error) => {
                console.error('Error adding stock:', error);
                // Handle error
            });
    };

    return (
        <div >
            <p className="text-lg font-bold" style={{ color: "black" }}>Add Stocks</p><br />
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Stock Symbol:</label>
                    <input id="symbol" type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
                    <input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Buy Price:</label>
                    <input id="price" type="number" value={buyPrice} onChange={(e) => setBuyPrice(parseFloat(e.target.value))} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
                <button type="submit" className="bg-[#152238] text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Stock</button>
            </form>
        </div>
    );
};



export const StockFetcher = ({ db, currentUser, setStocks }) => {
    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const data = await GetStocks(db, currentUser.uid);
                console.log('Stocks retrieved successfully:', data);
                setStocks(data);
            } catch (error) {
                console.error('Error retrieving stocks:', error);
                // Handle error
            }
        };

        fetchStocks(); // Call the function to fetch stocks when component mounts
    }, [db, currentUser.uid, setStocks]); // Dependency array to ensure effect runs only when these variables change

    // This component doesn't render anything directly
    // return null;
    return <div></div>;

};


// for p & l of stocks
export const StockSummary = ({ stocks }) => {
    // Calculate the sum of current price and initial price
    //const sumCurrentPrice = stocks.reduce((total, stock) => total + (stock.stockQuantity * stock.stockPrice), 0);


    const sumInitialPrice = stocks.reduce((total, stock) => total + (stock.stockQuantity * stock.buyPrice), 0);

    const [sumCurrentPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let sum = 0;
        const fetchStockPrices = async () => {
            for (const stock of stocks) {
                try {
                    const priceData = await FetchStockCurrentPrice(stock.stockSymbol);
                    const currentPrice = priceData.c;
                    sum += currentPrice * stock.stockQuantity;
                    console.log("total current price:", sum);

                } catch (error) {
                    console.error('Error fetching price for', stock.symbol, ':', error);
                }
            }
            setTotalPrice(sum.toFixed(2)); // Fixing to 2 decimal places
        };

        fetchStockPrices();
    }, [stocks]);

    const returns = sumCurrentPrice - sumInitialPrice;
    return (
        <div>
            <div>
                <p className="text-2xl font-bold mr-2 text-gray-900" >
                    Total Stock Holdings: ${Math.abs(sumCurrentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p><br />
                <p className="text-2xl font-bold" style={{ color: "black" }}>
                    Returns:
                    <span className={`font-semibold text-gray-700 ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {returns >= 0 ? ' +' : ' -'} ${Math.abs(returns).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>

                    {/* for the percentage */}
                    &nbsp;(
                    <span className={`font-semibold text-gray-700 ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {((returns / sumInitialPrice) * 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}%
                    </span>
                    )

                </p>
                <br />
                {/* <TimeChart /> */}
                {/* <StockBalanceChart initialInvestment={sumInitialPrice} currentInvestment={sumCurrentPrice} /> */}
                <div style={{ width: '85%' }}>
                    {/* <StockTimeSeriesChart stocks={stocks} /> */}
                    <StockTimeSeriesChart sumCurrentPrice={sumCurrentPrice} />

                </div>


            </div>

        </div>
    );
};



export const StockTable = ({ stocks }) => {
    const { currentUser } = useAuth();

    const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);

    const [newsModal, setNewsModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const handleViewMore = (stockSymbol) => {
        setSelectedStockSymbol(stockSymbol);
        setNewsModal(true);
        console.log("view more true")
    };

    const handleDelete = async (userId, stockSymbol) => {
        try {
            // Assuming db is accessible here or DeleteStock function has access to it
            await DeleteStock(db, userId, stockSymbol);
            toast.success(`${stockSymbol} deleted successfully!`);

            console.log("Stock deleted successfully!");
        } catch (error) {
            console.error("Error deleting stock:", error);
        }
    };

    const handleEdit = (stockSymbol) => {
        setSelectedStockSymbol(stockSymbol);
        setEditModal(true);
    };


    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };



    return (
        <div style={{ maxWidth: '250px', margin: '0 auto' }}>
            <Slider {...settings}>
                {stocks.map((stock, index) => (
                    <div key={index} className="relative bg-white shadow-md rounded-lg border border-gray-300 p-3 flex flex-col justify-center items-center">
                        {/* Display Company Logo */}
                        <CompanyLogoComponent stockSymbol={stock.stockSymbol} />

                        <p className="font-bold text-center" style={{ color: "black" }}>Symbol: {stock.stockSymbol}</p>
                        <p className="text-center text-sm" style={{ color: "black" }}>Quantity: {stock.stockQuantity}</p>
                        {/* <p className="text-center text-sm">Average Buy Price: {stock.buyPrice}</p> */}
                        <p className="text-center text-sm" style={{ color: "black" }}>Average Buy Price: {stock.buyPrice.toFixed(2)} </p>
                        {/* change here  */}

                        <StockCurrentPrice stockSymbol={stock.stockSymbol} /><br />


                        {/* <p className="text-center text-sm">Real-Time Price: {stock.stockPrice}</p><br /> */}


                        {/* Delete button */}
                        <button
                            onClick={() => handleDelete(currentUser.uid, stock.stockSymbol)}
                            className="absolute top-0 right-0 bg-red-500 text-white font-semibold px-2 py-1 rounded-md mr-2 mt-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <FaTrash size={14} />
                        </button>

                        {/* edit button */}
                        <button
                            onClick={() => handleEdit(stock.stockSymbol)}
                            className="absolute top-0 left-2 bg-blue-900 text-white font-semibold px-2 py-1 rounded-md mr-2 mt-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <FaEdit size={14} />
                        </button>

                        <div className="text-center mt-auto"> {/* Center the button */}
                            <button
                                onClick={() => handleViewMore(stock.stockSymbol)}
                                className="bg-[#152238] text-white font-semibold px-3 py-1 rounded-md mr-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                News
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>

            {newsModal && (
                <StockModal
                    isOpen={true}
                    onClose={() => setNewsModal(null)}
                    onSubmit={() => { }}
                    stockSymbol={selectedStockSymbol}
                />
            )}

            {editModal && (
                <UpdateStockModal
                    isOpen={true}
                    onClose={() => setEditModal(null)}
                    onSubmit={() => { }}
                    stockSymbol={selectedStockSymbol}
                    userId={currentUser.uid}
                />
            )}

        </div>

    );

};




export const SearchComponent = ({ stocks }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Function to filter stocks based on search term
    const filteredStocks = stocks.filter(stock =>
        stock.stockSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Search bar */}
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by symbol"
                className="w-full mb-2 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Render StockTable component with filtered stocks */}
            <StockTable stocks={filteredStocks} />

        </div>
    );
};

const TestGetRecommendations = async () => {
    try {
        const recommendations = await GetRecommendations2('NVDA'); // Fetch recommendations for AAPL
        console.log('Recommendations:', recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
};



//actual page
export const Holdings = () => {
    const { currentUser } = useAuth();
    //settting the stock list array, will pass the setStocks function to our stockFetcher
    const [stocks, setStocks] = useState([]);
    const [stockGoal, setGoal] = useState('');

    StockFetcher({ db, currentUser, setStocks });

    // remount component each time got update to db
    useEffect(() => {
        const fetchStocks = async () => {
            const stocksQuery = query(collection(db, 'stock'), where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(stocksQuery);
            const stocksData = [];
            querySnapshot.forEach((doc) => {
                stocksData.push(doc.data());
            });
            setStocks(stocksData);

            // Subscribe to changes in the Firestore collection
            const unsubscribe = onSnapshot(stocksQuery, (snapshot) => {
                const updatedStocksData = [];
                snapshot.forEach((doc) => {
                    updatedStocksData.push(doc.data());
                });
                setStocks(updatedStocksData);
            });

            // Clean up the subscription when the component unmounts
            return () => unsubscribe();
        };

        fetchStocks(); // Fetch stocks when component mounts
    }, [currentUser.uid]); // Only re-run effect if currentUser.uid changes



    //only fetch sum of current prices once!
    const [sumCurrentPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        let sum = 0;
        const fetchStockPrices = async () => {
            for (const stock of stocks) {
                try {
                    const priceData = await FetchStockCurrentPrice(stock.stockSymbol);
                    const currentPrice = priceData.c;
                    sum += currentPrice * stock.stockQuantity;
                    console.log("total current price:", sum);

                } catch (error) {
                    console.error('Error fetching price for', stock.symbol, ':', error);
                }
            }
            setTotalPrice(sum.toFixed(2)); // Fixing to 2 decimal places
        };

        fetchStockPrices();
    }, [stocks]);

    // setGoal
    useEffect(() => {
        const fetchStockGoal = async () => {
            const stocksQuery = query(collection(db, 'stockGoal'), where('userId', '==', currentUser.uid));
            const querySnapshot = await getDocs(stocksQuery);

            if (!querySnapshot.empty) {
                // Only proceed if there are documents
                const docData = querySnapshot.docs[0].data(); // Get the data from the first document
                setGoal(docData.goal);
            }

            // Subscribe to changes in the Firestore collection
            const unsubscribe = onSnapshot(stocksQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified' || change.type === 'added') {
                        const updatedData = change.doc.data();
                        setGoal(updatedData.goal);
                    }
                });
            });

            // Clean up the subscription when the component unmounts
            return () => unsubscribe();
        };

        fetchStockGoal(); // Fetch stocks goal when component mounts
    }, [currentUser.uid]);

    const [initialInvestment, setInitialInvestment] = useState(10);

    useEffect(() => {
        const calculateInitialInvestment = () => {
            let totalAveragePrice = 0;

            // Loop through each stock
            stocks.forEach(stock => {
                totalAveragePrice += stock.buyPrice * stock.stockQuantity;
            });
            setInitialInvestment(totalAveragePrice);
            console.log("initial investment:", totalAveragePrice);
        };

        // Call the function to calculate initial investment
        calculateInitialInvestment();
    }, [stocks]); // Add stocks as a dependency to trigger recalculation when stocks change

    const profit = (sumCurrentPrice - initialInvestment).toFixed(2);
    const percentAway = (100 - ((sumCurrentPrice / stockGoal) * 100)).toFixed(2);

    const textContent = `hello, ${currentUser.email} here is your summary for your stock portfolio: You have reached a total stock holding of ${sumCurrentPrice} dollars. 
    You are ${percentAway} percent away from your goal of ${stockGoal} dollars. You have ${stocks.length} unique stocks holding.
    You have a profit of ${profit} dollars from your initial investment of ${initialInvestment} dollars.`;



    return (

        <div className="flex flex-col md:flex-row h-full">

            <Navbar />

            {/* Main Content, start of dashboard */}

            <div className=" flex-1 flex-col justify-center items-center p-4 h-full" >
                <br />
                {/* Welcome Message */}
                {/* Flex container for top row */}
                <div className="flex md:flex-1 space-x-5 md:w-3/3 h-1/2">

                    {/* Add Stocks Section */}
                    <div className="p-5 bg-white shadow-md rounded-lg border-2  md:w-1/4  ">
                        <ActualSpeech text={textContent} />

                        <CreateStockForm currentUser={currentUser} />
                    </div>

                    {/*Stock Table Section */}
                    <div className="p-5 bg-white shadow-md rounded-lg border-2  md:w-1/4" style={{ zIndex: '20' }} >
                        <p className="text-lg font-bold text-center" style={{ color: "black" }}>My Stocks</p><br />
                        <SearchComponent stocks={stocks} />
                        {/* <StockTable stocks={stocks} /> */}
                    </div>


                    {/* Balance Section */}
                    <div className="p-5 bg-white shadow-md rounded-lg border-2 md:w-2/4">
                        <StockSummary stocks={stocks} /><br />
                    </div>
                    {/* End BalanceSection */}


                </div>
                {/* End of Flex container for top row */}<br /><br />

                {/* <GetCompanyNews stockSymbol="NVDA" /> */}

                {/* Bottom row */}
                <div className="flex md:flex-1 space-x-5 md:w-3/3 h-1/3">

                    <div className="p-5 bg-white shadow-md rounded-lg border-2 md:w-1/3" style={{ zIndex: '0' }}>
                        {/* <StockAnalysis stockSymbol="AAPL" /> */}
                        <GetStockAnalysisModal stocks={stocks} />
                    </div>


                    {/* Goal Section */}
                    <div className="p-5 bg-white shadow-md rounded-lg border-2 md:w-1/3" >
                        <StockGoalChart sumCurrentPrice={sumCurrentPrice} />
                    </div>


                    {/* Pie Chart Section */}
                    <div className="flex justify-center items-center p-5 bg-white shadow-md rounded-lg border-2 md:w-1/3 text-center">
                        {/* <p className="text-lg text-center font-bold" style={{ color: "black" }}>Distribution Of Stocks</p> */}
                        <div style={{ width: '65%' }}>
                            <StockPieChart data={stocks} />
                        </div>
                    </div>

                    {/* Recommendations Section */}





                </div>

            </div>
            {/* end of dashboard */}
        </div>

    );
};

