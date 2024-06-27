import React, { useState, useEffect, useRef } from 'react';
import GaugeChart from 'react-gauge-chart'

import { AddGoal, EditGoal, retrieveGoal } from '../../firebase/stockGoal';
import { collection, doc, addDoc, getDocs, updateDoc, query, where, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';
//for messages
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FetchStockCurrentPrice } from '../../firebase/stockapi';


export const StockGoalChart = ({ sumCurrentPrice }) => {

    const [goalModal, setGoalModal] = useState(false);
    const { currentUser } = useAuth();
    const [goal, setGoal] = useState(0)

    const handleSetGoal = () => {
        setGoalModal(true);
        console.log("Goal true");
    };


    // useEffect(() => {
    //     const fetchGoal = async () => {
    //         try {
    //             const fetchedGoal = await retrieveGoal(db, currentUser.uid);
    //             setGoal(fetchedGoal);
    //         } catch (error) {
    //             console.log("error fetching goal", error);
    //         }
    //     };
    //     fetchGoal();
    // }, [db]);

    // remount component each time got update to db
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

    
    return (
        <div>
            <p className="text-lg text-center font-bold" style={{ color: "black" }}>My Target Goal: ${Math.abs(goal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>

            <GaugeChart
                id="gauge-chart2"
                needleColor='navy'
                textColor='black'
                nrOfLevels={20}
                arcWidth={0.3}
                arcPadding={0.02}
                colors={["#8B0000", "#152238", "#008000"]}
                // colors={["#1E90FF", "#4682B4", "#6495ED"]}
                percent={(sumCurrentPrice / goal)}
            />

            <div className="text-center mt-auto">
                <button
                    onClick={() => handleSetGoal()}
                    className="bg-[#152238] text-white font-semibold px-3 rounded-md mr-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Set Goal
                </button>
            </div>

            {goalModal && (
                <InsideGoalModal
                    isOpen={true}
                    onClose={() => setGoalModal(null)}
                    onSubmit={() => { }}
                // userId={currentUser.uid}
                />
            )}

        </div>
    );
};


export const StockGoalChart2 = ({ stocks }) => {

    const [goalModal, setGoalModal] = useState(false);
    const { currentUser } = useAuth();
    const [goal, setGoal] = useState(0)


    const handleSetGoal = () => {
        setGoalModal(true);
        console.log("Goal true");
    };

    const [sumCurrentPrice, setTotalPrice] = useState(0);

    // useEffect(() => {
    //     let sum = 0;
    //     const fetchStockPrices = async () => {
    //         for (const stock of stocks) {
    //             try {
    //                 const priceData = await FetchStockCurrentPrice(stock.stockSymbol);
    //                 const currentPrice = priceData.c;
    //                 sum += currentPrice * stock.stockQuantity;
    //                 console.log("total current price:", sum);

    //             } catch (error) {
    //                 console.error('Error fetching price for', stock.symbol, ':', error);
    //             }
    //         }
    //         setTotalPrice(sum.toFixed(2)); // Fixing to 2 decimal places
    //     };

    //     fetchStockPrices();
    // }, [stocks]);

    //faster version
    useEffect(() => {
        const fetchStockPrices = async () => {
            let sum = 0;
            const promises = stocks.map(async (stock) => {
                try {
                    const priceData = await FetchStockCurrentPrice(stock.stockSymbol);
                    const currentPrice = priceData.c;
                    sum += currentPrice * stock.stockQuantity;
                } catch (error) {
                    console.error('Error fetching price for', stock.stockSymbol, ':', error);
                }
            });

            await Promise.all(promises);
            setTotalPrice(sum.toFixed(2)); // Fixing to 2 decimal places
        };

        fetchStockPrices();
    }, [stocks]);


    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const fetchedGoal = await retrieveGoal(db, currentUser.uid);
                setGoal(fetchedGoal);
            } catch (error) {
                console.log("error fetching goal", error);
            }
        };
        fetchGoal();
    }, [db]);

    //remount component each time got update to db
    // useEffect(() => {
    //     const fetchStocks = async () => {
    //         const stocksQuery = query(collection(db, 'stock'), where('userId', '==', currentUser.uid));
    //         const querySnapshot = await getDocs(stocksQuery);
    //         const stocksData = [];
    //         querySnapshot.forEach((doc) => {
    //             stocksData.push(doc.data());
    //         });
    //         setStocks(stocksData);

    //         // Subscribe to changes in the Firestore collection
    //         const unsubscribe = onSnapshot(stocksQuery, (snapshot) => {
    //             const updatedStocksData = [];
    //             snapshot.forEach((doc) => {
    //                 updatedStocksData.push(doc.data());
    //             });
    //             setStocks(updatedStocksData);
    //         });

    //         // Clean up the subscription when the component unmounts
    //         return () => unsubscribe();
    //     };

    //     fetchStocks(); // Fetch stocks when component mounts
    // }, [currentUser.uid]); // Only re-run effect if currentUser.uid changes



    return (
        <div>
            <p className="text-lg text-center font-bold">My Target Goal: ${Math.abs(goal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>


            <GaugeChart
                id="gauge-chart2"
                needleColor='navy'
                textColor='black'
                nrOfLevels={20}
                arcWidth={0.3}
                arcPadding={0.02}
                colors={["#8B0000", "#152238", "#008000"]}
                percent={(sumCurrentPrice / goal)}
            />

            <div className="text-center mt-auto">
                <button
                    onClick={() => handleSetGoal()}
                    className="bg-[#152238] text-white font-semibold px-3 rounded-md mr-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Set Goal
                </button>
            </div>


            {goalModal && (
                <InsideGoalModal
                    isOpen={true}
                    onClose={() => setGoalModal(null)}
                    onSubmit={() => { }}
                // userId={currentUser.uid}
                />
            )}

        </div>
    );
};


export const InsideGoalModal = ({ isOpen, onClose }) => {
    const [modalOpen, setModalOpen] = useState(isOpen); // Initialize modal state with isOpen prop
    const [newGoal, setNewGoal] = useState(0);
    const { currentUser } = useAuth();

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        onClose(); // Call onClose prop to handle closing modal in parent component
    };

    const handleGoal = async () => {
        try {
            // Check if goal exists for the userId
            const q = query(collection(db, "stockGoal"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // If no goal exists, create a new one
                const newData = {
                    userId: currentUser.uid,
                    goal: newGoal,
                };
                await AddGoal(db, newData);
                console.log("New goal created successfully!");
                toast.success(`Goal updated successfully!`, {});


            } else {
                // If goal exists, update it
                const updatedData = {
                    goal: newGoal,
                };
                await EditGoal(db, currentUser.uid, updatedData);
                console.log("Goal updated successfully!");
                toast.success(`Goal updated successfully!`, {});

            }
        } catch (error) {
            console.error("Error creating/updating goal:", error);
            // Handle error appropriately
        }
    };



    return (
        <>
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center " style={{ zIndex: '100' }}>
                    <div className="bg-white p-5 rounded-lg">

                        <div>
                            <h2 className="mb-4 font-bold">Update My Stock Goal!</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Goal:</label>
                                    <input type="number" value={newGoal} onChange={(e) => setNewGoal(parseFloat(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-end mt-4">

                            <button onClick={handleGoal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Update
                            </button>
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