import { collection, doc, addDoc, getDocs, updateDoc, query, where, deleteDoc } from "firebase/firestore";
// Add a new document with a generated id.


//stockdata will contain userId, stockSymbol, stockQuantity, stockPrice, buyPrice, stockDate

// export const AddStock = async (db, stockData) => {
//     try {
//         const docRef = await addDoc(collection(db, "stock"), stockData);
//         console.log("Document written with ID: ", docRef.id);
//     } catch (error) {
//         console.error("Error adding stock:", error);
//         throw error; // Rethrow the error to handle it in the calling code
//     }
// };

export const AddStock = async (db, stockData) => {
    try {
        const stockQuery = query(
            collection(db, "stock"),
            where("stockSymbol", "==", stockData.stockSymbol),
            where("userId", "==", stockData.userId) // Filter by userId
        ); 
        
        const querySnapshot = await getDocs(stockQuery);

        if (querySnapshot.empty) {
            // If stock doesn't exist, add it as a new document
            const docRef = await addDoc(collection(db, "stock"), stockData);
            console.log("Document written with ID: ", docRef.id);
            return docRef.id;
        } else {
            // If stock already exists, update the average price
            const existingStockData = querySnapshot.docs[0].data();
            const totalPreviousCost = existingStockData.buyPrice * existingStockData.stockQuantity;
            const totalCost = totalPreviousCost + (stockData.buyPrice * stockData.stockQuantity);
            const totalQuantity = existingStockData.stockQuantity + stockData.stockQuantity;
            const newAveragePrice = totalCost / totalQuantity;

            // Update the existing document with the new average price and quantity
            await updateDoc(doc(db, "stock", querySnapshot.docs[0].id), {
                buyPrice: newAveragePrice,
                stockQuantity: totalQuantity
            });

            console.log("Stock updated with new average price: ", newAveragePrice);
            return querySnapshot.docs[0].id;
        }
    } catch (error) {
        console.error("Error adding/updating stock:", error);
        throw error;
    }
};


export const EditStock = async (db, stockSymbol, userId, updatedData) => {
    try {
        // Query for the document to update
        const q = query(collection(db, "stock"), where("userId", "==", userId), where("stockSymbol", "==", stockSymbol));
        const querySnapshot = await getDocs(q);

        // Check if the document exists
        if (!querySnapshot.empty) {
            // Get the first document from the query snapshot
            const docRef = querySnapshot.docs[0].ref;

            // Update the document with new data
            await updateDoc(docRef, updatedData);

            console.log("Stock document updated successfully");
        } else {
            console.error("No matching document found for the provided userId and stockSymbol");
            // You may want to handle this case differently based on your application's requirements
        }
    } catch (error) {
        console.error("Error updating stock:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};



export const DeleteStock = async (db, userId, stockSymbol) => {
    try {
        // Query the stock collection to find the document to delete
        const querySnapshot = await getDocs(query(collection(db, "stock"), where("userId", "==", userId), where("stockSymbol", "==", stockSymbol)));

        // Check if the document exists
        if (!querySnapshot.empty) {
            // Delete the document
            await deleteDoc(querySnapshot.docs[0].ref);
            console.log("Stock document with userId", userId, "and stockSymbol", stockSymbol, "successfully deleted");
        } else {
            console.log("No stock document found for userId", userId, "and stockSymbol", stockSymbol);
        }
    } catch (error) {
        console.error("Error deleting stock:", error);
        throw error;
    }
};

export const GetStocks = async (db, userId) => {
    const stocks = [];
    const querySnapshot = await getDocs(query(collection(db, "stock"), where("userId", "==", userId)));
    // const querySnapshot = await getDocs(collection(db, "stock"));

    querySnapshot.forEach((doc) => {
        stocks.push(doc.data());
        console.log("retrieving data");

    });

    return stocks;
}

// export const UpdateStock = async (db, stockId, updatedData) => {
//     try {
//         const stockRef = doc(db, "stock", stockId); // Reference to the stock document
//         await updateDoc(stockRef, updatedData); // Update the document with new data
//         console.log("Document updated successfully");
//     } catch (error) {
//         console.error("Error updating stock:", error);
//         throw error; // Rethrow the error to handle it in the calling code
//     }
// };


// export const UpdateStockPrice = async (db, userId, symbol, newPrice) => {
//     try {
//         // Query the stock collection to find documents with matching user ID and stock symbol
//         const stockQuery = query(collection(db, "stock"),
//             where("userId", "==", userId),
//             where("stockSymbol", "==", symbol));
//         const querySnapshot = await getDocs(stockQuery);

//         // Iterate over the query snapshot and update each matching document's stock price
//         // Iterate over the query snapshot and update each matching document's stock price
//         querySnapshot.forEach(async (doc) => {
//             try {
//                 console.log("New price:", newPrice); // Log the value of newPrice
//                 await updateDoc(doc.ref, { stockPrice: newPrice });
//                 console.log("Stock price updated successfully");
//             } catch (error) {
//                 console.error("Error updating stock price:", error);
//                 // Handle error
//             }
//         });

//     } catch (error) {
//         console.error("Error querying stocks:", error);
//         throw error; // Rethrow the error to handle it in the calling code
//     }
// };



export const CreateStockBalance = async (db, stockBalanceData) => {
    try {
        const docRef = await addDoc(collection(db, "stockBalance"), stockBalanceData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id; // Return the ID of the newly created document
    } catch (error) {
        console.error("Error adding stock:", error);
        throw error; // Rethrow the error to handle it in the calling code
    }
};


export const GetStockBalance = async (db, userId, currentDate) => {
    const stockBalance = [];
    const querySnapshot = await getDocs(query(
        collection(db, "stockBalance"),
        where("userId", "==", userId),
        where("currentDate", "==", currentDate) // Replace "specificDate" with the date you want to query for
    ));

    querySnapshot.forEach((doc) => {
        stockBalance.push(doc.data());
        console.log("Retrieving stock balance for today");
    });

    return stockBalance;
}


