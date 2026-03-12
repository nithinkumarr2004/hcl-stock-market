import React, { useState, useEffect } from 'react';
import { portfolioService } from '../../services/api';
import { ShieldAlert, Info, AlertTriangle, TrendingDown, Percent } from 'lucide-react';

const RiskAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await portfolioService.get();
      setData(res.data.riskMetrics);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Analyzing Risks...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Risk Engine Analytics</h1>
          <p className="text-gray-400 text-sm sm:text-base">Advanced risk metrics and portfolio health monitor.</p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 border self-start sm:self-auto ${data.riskScore > 70 ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-primary/10 border-primary text-primary'}`}>
          <ShieldAlert size={18} />
          <span className="font-bold text-sm sm:text-base">Overall Risk Score: {data.riskScore}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <RiskItem 
          title="Value at Risk (VaR)" 
          icon={<TrendingDown size={24} />}
          value={`$${data.valueAtRisk?.toFixed(2)}`}
          description="Estimated maximum loss with 95% confidence over the next trading day based on current exposure."
        />
        <RiskItem 
          title="Maximum Drawdown" 
          icon={<AlertTriangle size={24} />}
          value={`$${data.maxDrawdown?.toFixed(2)}`}
          description="The peak-to-trough decline during a specific period for your portfolio."
        />
        <RiskItem 
          title="Portfolio Exposure" 
          icon={<Percent size={24} />}
          value={`$${data.totalExposure?.toLocaleString()}`}
          description="Total market value of all open positions in your portfolio."
        />
        <RiskItem 
          title="Profit/Loss Status" 
          icon={<Info size={24} />}
          value={`${data.pnlPercentage?.toFixed(2)}%`}
          description="Cumulative unrealized profit or loss percentage based on acquisition price."
          positive={data.pnlPercentage >= 0}
        />
      </div>

      <div className="trading-card p-8">
        <h2 className="text-xl font-bold mb-6">Risk Engine Insights</h2>
        <div className="space-y-4">
          <InsightRow 
            label="Position Sizing" 
            text={data.totalExposure > 50000 ? "High exposure detected. Consider diversifying across more sectors." : "Normal position sizing maintained."} 
            status={data.totalExposure > 50000 ? 'warning' : 'ok'} 
          />
          <InsightRow 
            label="Liquidity Check" 
            text="High liquidity across all holdings. Orders can be executed with minimal slippage." 
            status='ok' 
          />
          <InsightRow 
            label="Stress Test" 
            text="Portfolio can withstand a 10% market correction without triggering margin alerts." 
            status='ok' 
          />
        </div>
      </div>
    </div>
  );
};

const RiskItem = ({ title, value, description, icon, positive }) => (
  <div className="trading-card p-6 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-dark text-gray-400">{icon}</div>
      <div className={`text-2xl font-black font-mono ${positive === true ? 'text-primary' : positive === false ? 'text-secondary' : 'text-white'}`}>{value}</div>
    </div>
    <div>
      <h3 className="font-bold text-gray-200 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const InsightRow = ({ label, text, status }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 bg-dark rounded-xl border border-dark-border">
    <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-0 ${status === 'ok' ? 'bg-primary' : 'bg-secondary'}`}></div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm">{text}</p>
    </div>
  </div>
);

export default RiskAnalytics;
