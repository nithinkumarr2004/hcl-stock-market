package com.stock.simulator.service;

import com.stock.simulator.entity.Portfolio;
import com.stock.simulator.entity.User;
import com.stock.simulator.repository.PortfolioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RiskEngineServiceTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @InjectMocks
    private RiskEngineService riskEngineService;

    private User testUser;
    private Portfolio portfolio1;
    private Portfolio portfolio2;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setBalance(new BigDecimal("100000"));

        portfolio1 = new Portfolio();
        portfolio1.setSymbol("AAPL");
        portfolio1.setQuantity(10);
        portfolio1.setAveragePrice(new BigDecimal("150"));

        portfolio2 = new Portfolio();
        portfolio2.setSymbol("TSLA");
        portfolio2.setQuantity(5);
        portfolio2.setAveragePrice(new BigDecimal("200"));
    }

    @Test
    void testCalculateRiskMetrics() {
        // Arrange
        when(portfolioRepository.findByUser(testUser)).thenReturn(Arrays.asList(portfolio1, portfolio2));
        
        Map<String, BigDecimal> marketPrices = new HashMap<>();
        marketPrices.put("AAPL", new BigDecimal("160")); // Market value: 1600
        marketPrices.put("TSLA", new BigDecimal("210")); // Market value: 1050
        // Total Exposure: 2650
        // Total Invested: (150*10) + (200*5) = 1500 + 1000 = 2500
        // Profit/Loss: 150

        // Act
        Map<String, Object> metrics = riskEngineService.calculateRiskMetrics(testUser, marketPrices);

        // Assert
        assertBigDecimalEquals(new BigDecimal("2650"), (BigDecimal) metrics.get("totalExposure"));
        assertBigDecimalEquals(new BigDecimal("150"), (BigDecimal) metrics.get("totalProfitLoss"));
        assertBigDecimalEquals(new BigDecimal("6.0000"), (BigDecimal) metrics.get("pnlPercentage"));
        assertBigDecimalEquals(new BigDecimal("132.50"), (BigDecimal) metrics.get("valueAtRisk"));
        assertBigDecimalEquals(new BigDecimal("53.00"), (BigDecimal) metrics.get("maxDrawdown"));
        
        assertEquals(3, metrics.get("riskScore"));
    }

    private void assertBigDecimalEquals(BigDecimal expected, BigDecimal actual) {
        assertEquals(0, expected.compareTo(actual), 
            String.format("Expected %s but got %s", expected, actual));
    }
}
