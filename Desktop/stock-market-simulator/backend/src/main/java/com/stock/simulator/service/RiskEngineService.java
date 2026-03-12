package com.stock.simulator.service;

import com.stock.simulator.entity.Portfolio;
import com.stock.simulator.entity.User;
import com.stock.simulator.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class RiskEngineService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    public Map<String, Object> calculateRiskMetrics(User user, Map<String, BigDecimal> currentMarketPrices) {
        List<Portfolio> portfolios = portfolioRepository.findByUser(user);
        
        BigDecimal totalExposure = BigDecimal.ZERO;
        BigDecimal totalInvested = BigDecimal.ZERO;
        
        for (Portfolio p : portfolios) {
            BigDecimal currentPrice = currentMarketPrices.getOrDefault(p.getSymbol(), p.getAveragePrice());
            BigDecimal marketValue = currentPrice.multiply(new BigDecimal(p.getQuantity()));
            totalExposure = totalExposure.add(marketValue);
            totalInvested = totalInvested.add(p.getAveragePrice().multiply(new BigDecimal(p.getQuantity())));
        }

        BigDecimal profitLoss = totalExposure.subtract(totalInvested);
        BigDecimal pnlPercentage = totalInvested.compareTo(BigDecimal.ZERO) == 0 ? 
                BigDecimal.ZERO : profitLoss.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));

        // Simplistic VaR (Value at Risk) - 5% of exposure as a placeholder for 95% confidence
        BigDecimal var95 = totalExposure.multiply(new BigDecimal("0.05"));

        // Max Drawdown - simulated or historical needed, using a dummy 2% for now
        BigDecimal maxDrawdown = totalExposure.multiply(new BigDecimal("0.02"));

        // Risk Score (0-100)
        int riskScore = calculateRiskScore(totalExposure, user.getBalance());

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalExposure", totalExposure);
        metrics.put("totalProfitLoss", profitLoss);
        metrics.put("pnlPercentage", pnlPercentage);
        metrics.put("valueAtRisk", var95);
        metrics.put("maxDrawdown", maxDrawdown);
        metrics.put("riskScore", riskScore);
        
        return metrics;
    }

    private int calculateRiskScore(BigDecimal exposure, BigDecimal cash) {
        if (cash.compareTo(BigDecimal.ZERO) == 0) return 100;
        BigDecimal ratio = exposure.divide(cash.add(exposure), 2, RoundingMode.HALF_UP);
        // Higher exposure to cash ratio = higher risk
        return Math.min(100, (int) (ratio.doubleValue() * 100));
    }
}
