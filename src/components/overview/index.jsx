import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { Navbar } from "../../components/navbar"; // Adjust the path based on the directory structure
import { fetchBalance, updateBalance } from "../../firebase/balance";
import { db } from "../../firebase/firebase";
import Modal from "./modal"; // Adjust the path based on your file structure
import { useNavigate } from "react-router-dom";
import BudgetModal from "./BudgetModal";

import { GetMarketNews } from "./marketNews";
import CashBalance from "./CashBalance";
import PortfolioCard from "./PortfolioCard";

import { fetchTotalExpenses } from "../../firebase/expense";


import { UserCashTimeSeries } from "./UserCash";
import { UserNetWorthTimeSeries } from "./UserNetWorth";

import { UserStockTimeSeriesChart } from "./userStock";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { TextToSpeech, ActualSpeech } from "../holdings/textSpeech";
import { FetchStockCurrentPrice } from "../../firebase/stockapi";
import { RetrieveUserCash } from "../../firebase/cash";
import NetWorthGoal from "./NetWorthGoal";
import { Budget } from "./Budget";
import { Switcher4 } from "./switch";
import { BudgetNetWorth } from "./budgetNetWorth";
import {fetchOrCreateTarget} from "../../firebase/target";
import { useColorScheme } from "../profile/useColorScheme";


//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Overview = () => {
    const [month, setMonth] = useState("April");
    const [budgetType, setBudgetType] = useState("Monthly");
    const [newBudget, setNewBudget] = useState("");
    const [balance, setBalance] = useState(0.0);
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [portfolioValue, setPortfolioValue] = useState(14281.55);
    const [profitLossAmount, setProfitLossAmount] = useState(314.55);
    const [profitLossPercentage, setProfitLossPercentage] = useState(2.4);
    const [currentValue, setCurrentValue] = useState(5200000); // Example current value
    const goalValue = 10000000; // Example goal value
    const [budget, setBudget] = useState(0.0);
    const [expenses, setExpenses] = useState([{}]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [spentPercentage, setSpentPercentage] = useState(0);

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

    ///------ start of syafiq initalization of stocks --------
    //for getting stocks of user
    const [stocks, setStocks] = useState([]);

    //remount component each time got update to firebase realtime
    useEffect(() => {
      const fetchStocks = async () => {
        const stocksQuery = query(
          collection(db, "stock"),
          where("userId", "==", currentUser.uid)
        );
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
    //---- end of syafiq initalization of stocks --------

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const handleBudgetModalOpen = () => setIsBudgetModalOpen(true);
    const handleBudgetModalClose = () => setIsBudgetModalOpen(false);

    const handleModalOpen = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);

    const handleModalSubmit = (month, balanceValue) => {
      updateBalance(currentUser.uid, month, balanceValue, setBalance);
      handleModalClose();
    };

    const handleSetTarget = () => {
      // Logic to set a new target, possibly opening a modal or another component
      console.log("Setting new target...");
    };

    let navigate = useNavigate();

    function handleClick() {
      navigate("/holdings"); // Path to your Holdings page
    }

    useEffect(() => {
      if (currentUser && currentUser.uid && month) {
        fetchBalance(currentUser.uid, month, setBalance);
      }
    }, [currentUser, month]);

    useEffect(() => {
      setSpentPercentage((totalExpenses / budget) * 100);
    }, [totalExpenses, budget]);

    useEffect(() => {
      if (currentUser) {
        fetchTotalExpenses(currentUser.uid)
          .then((total) => {
            setTotalExpenses(total); // Set the fetched total expenses to state
            console.log("Total expenses fetched:", total);
          })
          .catch((error) => {
            console.error("Error fetching total expenses:", error);
            setTotalExpenses(0); // Optional: Reset on error or handle differently
          });
      }
    }, [currentUser]);

    // ---------- start of syafiq net worth use effects & api calls optimization methods ----------
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns 0-indexed month
    const currentYear = currentDate.getFullYear();
    const userId = currentUser.uid;

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
            console.error("Error fetching price for", stock.symbol, ":", error);
          }
        }
        setTotalPrice(sum.toFixed(2)); // Fixing to 2 decimal places
      };

      fetchStockPrices();
    }, [stocks]); //end of fetch current price, remount each time stocks change

    //fetching user cash and setting user cash for later on when tracking net worth
    const [sumUserCash, setUserCash] = useState(0);

    useEffect(() => {
      const fetchCashData = async () => {
        try {
          //fetch total cash from total cash firebase table based on the date to set total accumulated cash for the month
          const sumCash = await RetrieveUserCash(
            db,
            userId,
            currentYear,
            currentMonth
          );
          console.log(
            "total cash for dmy for user worth: ",
            currentDate,
            currentMonth,
            currentYear,
            userId,
            sumCash
          );
          setUserCash(sumCash.totalcash);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle error here, e.g., show an error message to the user
        }
      };

      fetchCashData();
    }, [userId, currentYear, currentMonth]); //end of fetch cash data, remount each time userId, currentYear, currentMonth change

    //fetching user cash and setting user cash for later on when tracking net worth
    const [netTarget, setTarget] = useState(0);

    useEffect(() => {
      const fetchNetData = async () => {
        try {
          //fetch total cash from total cash firebase table based on the date to set total accumulated cash for the month
          const targetNet = await fetchOrCreateTarget(
            db,
            userId
          );
          console.log(
            "total target  ",
            targetNet);
          setTarget(targetNet.targetValue);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle error here, e.g., show an error message to the user
        }
      };

      fetchNetData();
    }, [userId]); //end of fetch cash data, remount each time userId, currentYear, currentMonth change

    // ----------- end of syafiq net worth use effects methods  --------------

    //norman to use this to compare to your current net worth
    const totalNetWorth = Number(sumUserCash) + Number(sumCurrentPrice);

    const textContent = `hello, ${currentUser.email} here is your overview: You have reached a total net worth of  ${totalNetWorth}} here. 
    You are include percentage here away from your goal of ${netTarget} dollars. Feel free to explore the latest news on also click on your stocks holding to get recommendations, sentiments and insights on them`;

    const { isDark } = useColorScheme();
    if (isDark) {
      console.log("Dark");
    } else {
      console.log("Not Dark");
    }
  

    return (
      <div className="flex flex-col md:flex-row h-full">
        <Navbar />

        {/* Main Content, start of dashboard , adjust y for spaces in btwn top and bottom row*/}
        <div className="flex-1 flex-col justify-center items-center p-4 h-full space-y-5">
          {/* Start of top row, 2 columns */}
          <div className="flex md:flex-1 space-x-5  md:w-3/3 h-1/ ">
            {/* start of marketNews */}
            <div className={`overview1 p-5 shadow-md rounded-lg md:w-1/2 ${isDark ? "dark" : ""}`}>
              <GetMarketNews />
            </div>
            {/* end of marketNews */}

            {/* Start of Net-Worth time series chart & Speech Text*/}
            <div className={`overview1 p-5 shadow-md rounded-lg md:w-1/3 flex-col justify-center items-center ${isDark ? "dark" : ""}`}>
              <ActualSpeech text={textContent} />
              <p className="text-2xl font-bold mr-2">
                My Total Net Worth: $
                {Math.abs(totalNetWorth).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </p>
              <br />

              {/* to net worth chart time */}
              <div style={{ width: "100%" }}>
                <UserNetWorthTimeSeries sumCurrentPrice={sumCurrentPrice} />
              </div>
            </div>
            {/*end of Net-Worth time series chart & speech text */}
          </div>
          {/* End of top row*/}

          {/* Flex container for bottom row, 3 columns */}
          <div className="flex md:flex-1 space-x-5 md:w-3/3 h-2/5">
            {/* start of total user cash */}
            <div className={`overview1 p-5 bg-white shadow-md rounded-lg md:w-1/3 ${isDark ? "dark" : ""}`}>
              <div style={{ width: "90%" }}>
                <UserCashTimeSeries />
              </div>
              {/* button */}
              <br />

              <div className="flex justify-center">
                <a
                  href="/income"
                  className="bg-[#152238] text-white font-semibold px-4 py-1 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Income
                </a>
              </div>
              {/* end button */}
            </div>
            {/* end of total user cash */}

            <div
              className={`overview1 p-5 shadow-md rounded-lg md:w-1/3 ${isDark ? "dark" : ""}`}
              style={{ zIndex: "0" }}
            >
              <BudgetNetWorth
                totalNetWorth={totalNetWorth}
                totalExpenses={totalExpenses}
              />
            </div>
            {/* End of Net-Worth goal Only, try to abstract this out to another file for breverity*/}

            {/* Start of Stock Balances */}
            <div className={`overview1 p-5 shadow-md rounded-lg md:w-1/3 flex-col justify-center items-center ${isDark ? "dark" : ""}`}>
              <div style={{ width: "90%" }}>
                <UserStockTimeSeriesChart stocks={stocks} />
              </div>
              {/* button */}
              <br />
              <div className="flex justify-center">
                <a
                  href="/holdings"
                  className="bg-[#152238] text-white font-semibold px-4 py-1 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Stocks Holding
                </a>
              </div>
              {/* end button */}
            </div>
            {/*end of stock balances */}
          </div>
          {/* End of Flex container for bottom row */}
          <br />
          <br />
        </div>
        {/* end of dashboard */}
      </div>
    );
  
};