// src/StockList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fetchStockData from '../utils/fetchStockData';
import StockCard from './StockCard';
import usePagination from '../hooks/usePagination';


interface Stock {
  symbol: string;
  name: string;
  price: number;
  sector: string;
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [diversity, setDiversity] = useState<number>(0);
  const [loading, setIsLoading] = useState(true);
  
  const { currentData, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(stocks, 12);

  // before entering this useeffect will fetch the stocks form finhub api
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // get stock symbols
        const symbolsResponse = await axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=cpm6qrpr01quf620njjgcpm6qrpr01quf620njk0`);

        const stockSymbols = symbolsResponse.data.map((stock: any) => stock.symbol).slice(0, 30); // Limit to 30 stocks

        // now fetch data fromo fetchstcokdata with these stocksymbols
        const stockDetails = await fetchStockData(stockSymbols);

        // set stock to stock usestate 
        setStocks(stockDetails);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  // function to add particular stock to list of selected stocks
  const addToPortfolio = (stock: Stock) => {
    if (!portfolio.find(s => s.symbol === stock.symbol)) {
      const newPortfolio = [...portfolio, stock];
      setPortfolio(newPortfolio);
      updateDiversity(newPortfolio);
    }
  };

  // function to remove a particular stock from selected list
  const removeFromPortfolio = (stock: Stock) => {
    const newPortfolio = portfolio.filter(s => s.symbol !== stock.symbol);
    setPortfolio(newPortfolio);
    updateDiversity(newPortfolio);
  };


  // to update diversity whenever we add or remove a stock
  const updateDiversity = (portfolio: Stock[]) => {
    const sectorWeights: { [key: string]: number } = {};
    portfolio.forEach(stock => {
      sectorWeights[stock.sector] = (sectorWeights[stock.sector] || 0) + stock.price;
    });

    const totalValue = portfolio.reduce((total, stock) => total + stock.price, 0);
    const weights = Object.values(sectorWeights).map(value => value / totalValue);
    const diversityScore = 100 - (weights.reduce((sum, weight) => sum + weight ** 2, 0) * 100);
    setDiversity(diversityScore);
  };

  return (
    <div className=" flex flex-col  gap-8">
      <div className='w-full flex flex-row gap-2'>
        <div className="w-1/2  border rounded border-black ">
          <h2 className="text-2xl font-bold mb-4">Selected Stocks</h2>
          <div className="flex flex-wrap gap-4  justify-center mb-4">
            {portfolio.map(stock => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                inPortfolio
                onRemoveFromPortfolio={() => removeFromPortfolio(stock)}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2  h-[200px] rounded border border-black">
          <h2 className="text-2xl font-bold mb-4">Stock Portfolio Diversity</h2>
          <div className="  p-8 text-center">
            <div className="text-3xl">{diversity.toFixed(2)}</div>
            <p>Diversity Score</p>
          </div>
        </div>
      </div>
      
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">All Stocks</h2>
        <div className="flex flex-wrap gap-4 justify-center">

          {loading == true ? <h1>Loading Please Wait ....</h1> : currentData().map(stock => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onAddToPortfolio={() => addToPortfolio(stock)}
            />
          ))}
        </div>

        {/* this is pagination shows stock in list and allow to  go to next page or prev */}
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 mx-2 bg-gray-600  rounded"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 mx-2 ${i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 mx-2 bg-gray-600 rounded"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockList;
