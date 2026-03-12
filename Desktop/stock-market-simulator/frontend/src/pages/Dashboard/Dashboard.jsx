import React, { useState, useEffect } from 'react';
import { stockService, tradeService, portfolioService } from '../../services/api';
import StockChart from '../../components/StockChart';
import { Search, ArrowUpRight, ArrowDownRight, LayoutGrid, List } from 'lucide-react';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState({ balance: 0, riskMetrics: {} });
  const [orderQty, setOrderQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // Mock historical data for chart
  const [chartData, setChartData] = useState(Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 150));

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [stockRes, portRes] = await Promise.all([
        stockService.getAll(),
        portfolioService.get()
      ]);
      setStocks(stockRes.data);
      setPortfolio(portRes.data);
      if (!selectedStock && stockRes.data.length > 0) {
        setSelectedStock(stockRes.data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrade = async (type) => {
    try {
      await tradeService.execute({
        symbol: selectedStock.symbol,
        quantity: parseInt(orderQty),
        type: type
      });
      fetchData();
      alert(`Successfully ${type.toLowerCase()}ed ${orderQty} shares of ${selectedStock.symbol}`);
    } catch (err) {
      alert(err.response?.data || "Trade failed");
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading Market Data...</div>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Market Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Real-time simulator with professional execution.</p>
        </div>
        <div className="flex gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-widest">Available Balance</p>
            <p className="text-xl sm:text-2xl font-mono text-primary font-bold">${portfolio.balance?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-widest">Total Exposure</p>
            <p className="text-xl sm:text-2xl font-mono text-white font-bold">${portfolio.riskMetrics?.totalExposure?.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
        {/* Watchlist */}
        <div className="lg:col-span-3 order-2 lg:order-1 trading-card overflow-hidden flex flex-col h-[400px] lg:h-[600px]">
          <div className="p-4 border-b border-dark-border flex items-center gap-2">
            <Search size={16} className="text-gray-500" />
            <input type="text" placeholder="Search stocks..." className="bg-transparent text-sm outline-none w-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {stocks.map(stock => (
              <div 
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`p-4 border-b border-dark-border cursor-pointer transition-colors ${selectedStock?.symbol === stock.symbol ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-dark-hover'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{stock.symbol}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm sm:text-base">${stock.currentPrice}</p>
                    <p className={`text-[10px] sm:text-xs flex items-center justify-end ${stock.changePercentage >= 0 ? 'text-primary' : 'text-secondary'}`}>
                      {stock.changePercentage >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(stock.changePercentage).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart and Trading Panel Area */}
        <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
          <div className="flex flex-col xl:grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 trading-card p-4 sm:p-6 h-[350px] sm:h-[400px]">
              {selectedStock && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        {selectedStock.name} <span className="text-gray-500 text-sm font-normal hidden sm:inline">{selectedStock.symbol}</span>
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-dark-hover rounded"><LayoutGrid size={18} className="text-gray-400" /></button>
                      <button className="p-1 hover:bg-dark-hover rounded"><List size={18} className="text-gray-400" /></button>
                    </div>
                  </div>
                  <div className="h-56 sm:h-64">
                    <StockChart data={chartData} symbol={selectedStock.symbol} />
                  </div>
                </>
              )}
            </div>

            <div className="trading-card p-4 sm:p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-400 uppercase text-[10px] sm:text-xs tracking-widest mb-4 sm:mb-6">Execution Panel</h3>
                <div className="flex gap-2 mb-4 sm:mb-6">
                  <button className="flex-1 bg-primary text-dark font-bold py-2 rounded-lg hover:bg-primary-hover transition-all text-sm">BUY</button>
                  <button className="flex-1 border border-dark-border text-white py-2 rounded-lg hover:bg-dark-hover transition-all text-sm">SELL</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] sm:text-xs text-gray-500 block mb-1 uppercase">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full bg-dark border border-dark-border rounded-lg p-2 sm:p-3 text-lg sm:text-xl font-mono focus:border-primary outline-none"
                      value={orderQty}
                      onChange={(e) => setOrderQty(e.target.value)}
                    />
                  </div>
                  <div className="p-3 sm:p-4 bg-dark rounded-lg space-y-2">
                    <div className="flex justify-between text-[10px] sm:text-xs">
                      <span className="text-gray-500">Price</span>
                      <span className="font-mono">${selectedStock?.currentPrice}</span>
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-xs font-bold">
                      <span className="text-gray-500">Total</span>
                      <span className="text-primary font-mono">${(selectedStock?.currentPrice * orderQty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleTrade("BUY")}
                className="w-full bg-primary text-dark font-black py-3 sm:py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,208,156,0.3)] transition-all uppercase tracking-widest text-sm sm:text-base mt-4 sm:mt-0"
              >
                Place Order
              </button>
            </div>
          </div>

          {/* Quick Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="P&L" value={`$${portfolio.riskMetrics?.totalProfitLoss?.toFixed(2)}`} subValue={`${portfolio.riskMetrics?.pnlPercentage?.toFixed(2)}%`} positive={portfolio.riskMetrics?.totalProfitLoss >= 0} />
            <StatCard label="VaR" value={`$${portfolio.riskMetrics?.valueAtRisk?.toFixed(2)}`} subValue="95% Conf." />
            <StatCard label="Drawdown" value={`$${portfolio.riskMetrics?.maxDrawdown?.toFixed(2)}`} subValue="Peak Exposure" />
            <StatCard label="Risk" value={portfolio.riskMetrics?.riskScore} subValue="Max 100" alert={portfolio.riskMetrics?.riskScore > 70} />
          </div>
        </div>
      </div>

    </div>
  );
};

const StatCard = ({ label, value, subValue, positive, alert }) => (
  <div className={`trading-card p-4 ${alert ? 'border-secondary/50 bg-secondary/5' : ''}`}>
    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</p>
    <p className={`text-xl font-bold font-mono ${positive === true ? 'text-primary' : positive === false ? 'text-secondary' : 'text-white'}`}>
      {value}
    </p>
    <p className="text-[10px] text-gray-500 uppercase">{subValue}</p>
  </div>
);

export default Dashboard;
