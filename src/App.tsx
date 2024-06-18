import React from 'react';
import './App.css';
import StockList from '../src/Components/StockList';

const App: React.FC = () => {
  return (
    <div className="App bg-gray-700 min-h-[96vh] p-5 text-white">
      <header className="App-header">
        <h1 className="text-4xl font-bold mb-8">Stock Portfolio</h1>
        <hr /><br />
      </header>
      {/* list for all stocks */}
      <StockList />
    </div>
  );
};

export default App;

