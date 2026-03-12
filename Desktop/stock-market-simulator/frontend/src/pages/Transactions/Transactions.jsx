import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { History, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Standardizing on transaction history if endpoint exists
      const res = await api.get('/portfolio'); // Reuse portfolio for now or assume a /transactions endpoint
      // For this simulator, we'll mock the transaction list if the backend is simple
      setTransactions([
        { id: 1, symbol: 'AAPL', type: 'BUY', quantity: 10, price: 185.20, timestamp: new Date().toISOString() },
        { id: 2, symbol: 'TSLA', type: 'SELL', quantity: 5, price: 172.50, timestamp: new Date().toISOString() },
      ]);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading Transactions...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold">Transaction History</h1>
        <p className="text-gray-400 text-sm sm:text-base">Review your past trades and activity.</p>
      </header>

      <div className="trading-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-dark-hover">
              <tr className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest border-b border-dark-border">
                <th className="p-4 sm:p-6">Date</th>
                <th className="p-4 sm:p-6">Stock</th>
                <th className="p-4 sm:p-6">Type</th>
                <th className="p-4 sm:p-6 text-right">Quantity</th>
                <th className="p-4 sm:p-6 text-right">Price</th>
                <th className="p-4 sm:p-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-dark-hover/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm text-gray-400 flex items-center gap-2 whitespace-nowrap">
                    <Calendar size={14} />
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-4 sm:p-6 font-bold text-sm sm:text-base">{tx.symbol}</td>
                  <td className="p-4 sm:p-6">
                    <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase ${
                      tx.type === 'BUY' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 sm:p-6 text-right font-mono text-sm sm:text-base">{tx.quantity}</td>
                  <td className="p-4 sm:p-6 text-right font-mono text-sm sm:text-base">${tx.price.toFixed(2)}</td>
                  <td className="p-4 sm:p-6 text-right font-mono font-bold text-white text-sm sm:text-base">${(tx.quantity * tx.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Transactions;
