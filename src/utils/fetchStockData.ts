import axios from 'axios';

const API_KEY = 'cpm6qrpr01quf620njjgcpm6qrpr01quf620njk0';

const fetchStockData = async (symbols: string[]) => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const stockDetails: any[] = [];

  // running loop for all symbol in symbols array 
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    try {
      // fetch data of particular stock by that symbol
      const priceResponse = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      // fetch profile of that stock by symbol of that stock
      const profileResponse = await axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`);

      // then we get all the deatils according to our need
      stockDetails.push({
        symbol,
        name: profileResponse.data.name,
        price: priceResponse.data.c,
        sector: profileResponse.data.finnhubIndustry,
      });
    } catch (error) {
      console.error(`Failed to fetch data for symbol ${symbol}: `, error);
    }

    // Add delay to avoid hitting rate limit
    if ((i + 1) % 30 === 0) {
      await delay(1000); // 1 second delay for every 30 requests
    }
  }

  return stockDetails;
};

export default fetchStockData;
