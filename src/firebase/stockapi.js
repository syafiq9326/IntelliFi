const finnhub = require('finnhub');



const api_key = finnhub.ApiClient.instance.authentications['api_key'];
//dont anyhow call, list your api here guys (finnhub)

//get api key from finhubb 
//https://finnhub.io/register
api_key.apiKey = 

//const finnhubClient = new finnhub.DefaultApi()

// finnhubClient.quote("AAPL", (error, data, response) => {
//     console.log(data)
// });


// // Create a function to fetch stock quote
//remove async function
export function FetchStockCurrentPrice(stockSymbol) {
    return new Promise((resolve, reject) => {
        const finnhubClient = new finnhub.DefaultApi();
        finnhubClient.quote(stockSymbol, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}


// export  function fetchStockCurrentPrice(stockSymbol) {
//     return new Promise((resolve, reject) => {
//         const finnhubClient = new finnhub.DefaultApi();
//         finnhubClient.quote(stockSymbol, (error, data, response) => {
//             console.log(data)
//         });
//     });
// }


//recommedation trends for stock to decide buy or sell
//since finhub api is async , use promise to chain async operations
//this gives us past 4 months of recommendation trends, so take only first array from data
export function GetRecommendations(stockSymbol) {
    return new Promise((resolve, reject) => {
        const finnhubClient = new finnhub.DefaultApi();
        finnhubClient.recommendationTrends(stockSymbol, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                if (data.length > 0) {
                    resolve(data[0]);
                }
            }
        });
    });
}


export function GetRecommendations2(stockSymbol) {
    return new Promise((resolve, reject) => {
        const finnhubClient = new finnhub.DefaultApi();
        finnhubClient.recommendationTrends(stockSymbol, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}


export function CompanyNews(stockSymbol) {
    return new Promise((resolve, reject) => {
        const finnhubClient = new finnhub.DefaultApi();
        const currentDate = new Date(); // Get the current date
        currentDate.setDate(currentDate.getDate() - 1); // Subtract one day from the current date
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format the date as "YYYY-MM-DD"

        finnhubClient.companyNews(stockSymbol, formattedDate, formattedDate, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                // Filter out items without an image attribute
                const newsWithImages = data.filter(item => item.image  && item.headline && item.url);
                // Resolve with the first news article that has an image, or an empty object if none found
                if (newsWithImages.length > 0) {
                    resolve(newsWithImages[0]);
                } else {
                    resolve({});
                }
            }
        });
    });
}




// export function CompanyNews(stockSymbol) {
//     return new Promise((resolve, reject) => {
//         const finnhubClient = new finnhub.DefaultApi();
//         finnhubClient.companyNews(stockSymbol, "2024-03-31", "2024-03-31", (error, data, response) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(data); // Resolve with all news articles
//             }
//         });
//     });
// }

export function CompanyProfile(stockSymbol) {
    return new Promise((resolve, reject) => {
        const finnhubClient = new finnhub.DefaultApi();
        finnhubClient.companyProfile2({ symbol: stockSymbol }, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}


export function MarketNews() {
    return new Promise((resolve, reject) => {
        const finnhubClient = new finnhub.DefaultApi();
        finnhubClient.marketNews("general", {}, (error, data, response) => {
            if (error) {
                reject(error);
            } else {
                // Filter out items without an image attribute, then return only the top 10
                const newsWithImages = data.filter(item => item.image);
                resolve(newsWithImages.slice(0, 10));
            }
        });
    });
}





