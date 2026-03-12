package com.stock.simulator.service;

import com.stock.simulator.entity.Stock;
import com.stock.simulator.repository.StockRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    private final Map<String, BigDecimal> priceCache = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @PostConstruct
    public void init() {
        // Initialize some dummy stocks if none exist
        if (stockRepository.count() == 0) {
            List<Stock> initialStocks = Arrays.asList(
                Stock.builder().symbol("AAPL").name("Apple Inc.").currentPrice(new BigDecimal("185.92")).changePercentage(1.2).build(),
                Stock.builder().symbol("GOOGL").name("Alphabet Inc.").currentPrice(new BigDecimal("142.12")).changePercentage(-0.5).build(),
                Stock.builder().symbol("TSLA").name("Tesla, Inc.").currentPrice(new BigDecimal("175.34")).changePercentage(-2.3).build(),
                Stock.builder().symbol("MSFT").name("Microsoft Corp.").currentPrice(new BigDecimal("405.12")).changePercentage(0.8).build(),
                Stock.builder().symbol("AMZN").name("Amazon.com Inc.").currentPrice(new BigDecimal("178.22")).changePercentage(1.5).build()
            );
            stockRepository.saveAll(initialStocks);
        }
        
        stockRepository.findAll().forEach(s -> priceCache.put(s.getSymbol(), s.getCurrentPrice()));
    }

    public List<Stock> getAllStocks() {
        List<Stock> stocks = stockRepository.findAll();
        // Simulate small price changes
        stocks.forEach(s -> {
            BigDecimal current = priceCache.get(s.getSymbol());
            double change = (random.nextDouble() - 0.5) * 2; // -1 to +1
            BigDecimal newPrice = current.add(current.multiply(new BigDecimal(change / 100.0))).setScale(2, RoundingMode.HALF_UP);
            s.setCurrentPrice(newPrice);
            s.setChangePercentage(change);
            priceCache.put(s.getSymbol(), newPrice);
        });
        return stocks;
    }

    public Map<String, BigDecimal> getCurrentPrices() {
        return priceCache;
    }
}
