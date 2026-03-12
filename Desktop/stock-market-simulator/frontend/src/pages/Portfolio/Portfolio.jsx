import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/api';
import { Briefcase, Activity, Target, ShieldCheck } from 'lucide-react';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await portfolioService.get();
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading Portfolio...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold">Your Portfolio</h1>
        <p className="text-gray-400 text-sm sm:text-base">Manage your holdings and track performance.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard icon={<Briefcase size={20} />} label="Total Assets" value={`$${data.riskMetrics?.totalExposure?.toLocaleString()}`} />
        <StatCard icon={<Activity size={20} />} label="Today's P&L" value={`$${data.riskMetrics?.totalProfitLoss?.toFixed(2)}`} positive={data.riskMetrics?.totalProfitLoss >= 0} />
        <StatCard icon={<Target size={20} />} label="Cash Balance" value={`$${data.balance?.toLocaleString()}`} />
        <StatCard icon={<ShieldCheck size={20} />} label="Risk Rating" value={data.riskMetrics?.riskScore > 50 ? 'Medium' : 'Low'} color={data.riskMetrics?.riskScore > 50 ? 'orange' : 'green'} />
      </div>

      <div className="trading-card p-4 sm:p-6 overflow-hidden">
        <h2 className="text-xl font-bold mb-6">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest border-b border-dark-border">
                <th className="pb-4">Symbol</th>
                <th className="pb-4 text-right">Quantity</th>
                <th className="pb-4 text-right">Avg. Price</th>
                <th className="pb-4 text-right">Market Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {data.holdings?.map((h) => (
                <tr key={h.symbol} className="hover:bg-dark-hover transition-colors">
                  <td className="py-4 font-bold text-sm sm:text-base">{h.symbol}</td>
                  <td className="py-4 text-right font-mono text-sm sm:text-base">{h.quantity}</td>
                  <td className="py-4 text-right font-mono text-sm sm:text-base">${h.averagePrice?.toLocaleString()}</td>
                  <td className="py-4 text-right font-mono font-bold text-sm sm:text-base text-white">${(h.quantity * h.averagePrice).toLocaleString()}</td>
                </tr>
              ))}
              {(!data.holdings || data.holdings.length === 0) && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">No holdings found. Start trading on the Dashboard!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, positive, color }) => (
  <div className="trading-card p-4 sm:p-6 flex items-center gap-4">
    <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${color === 'orange' ? 'bg-orange-500/20 text-orange-500' : 'bg-primary/20 text-primary'}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold truncate">{label}</p>
      <p className={`text-lg sm:text-xl font-bold font-mono truncate ${positive === true ? 'text-primary' : positive === false ? 'text-secondary' : 'text-white'}`}>
        {value}
      </p>
    </div>
  </div>
);

export default Portfolio;
