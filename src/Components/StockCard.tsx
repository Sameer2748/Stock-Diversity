// src/StockCard.tsx

import React from 'react';


// this interface sets what type of all props are coming to stockcard
interface StockCardProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    sector: string;
  };
  onAddToPortfolio?: () => void;
  onRemoveFromPortfolio?: () => void;
  inPortfolio?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onAddToPortfolio, onRemoveFromPortfolio, inPortfolio }) => {
  return (
    <div className="border-2 border-black rounded-lg p-4 w-48 flex flex-col justify-between ">
      <h3 className="font-bold text-center">{stock.name} ({stock.symbol})</h3>
      <p>Price: ${stock.price}</p>
      <p>Sector: {stock.sector}</p>
      {!inPortfolio && onAddToPortfolio && (
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={onAddToPortfolio}>
          Add to Portfolio
        </button>
      )}
      {inPortfolio && onRemoveFromPortfolio && (
        <button className="mt-2 w-[160px] h-[70px] px-2  bg-red-500 text-white rounded" onClick={onRemoveFromPortfolio}>
          Remove from Portfolio
        </button>
      )}
    </div>
  );
};

export default StockCard;
