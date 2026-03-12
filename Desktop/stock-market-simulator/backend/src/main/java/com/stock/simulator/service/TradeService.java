package com.stock.simulator.service;

import com.stock.simulator.entity.*;
import com.stock.simulator.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private StockService stockService;

    @Transactional
    public void executeTrade(User user, String symbol, int quantity, String type) {
        BigDecimal currentPrice = stockService.getCurrentPrices().getOrDefault(symbol, BigDecimal.ZERO);
        if (currentPrice.compareTo(BigDecimal.ZERO) == 0) throw new RuntimeException("Invalid stock symbol");

        BigDecimal totalCost = currentPrice.multiply(new BigDecimal(quantity));

        if ("BUY".equalsIgnoreCase(type)) {
            if (user.getBalance().compareTo(totalCost) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            user.setBalance(user.getBalance().subtract(totalCost));
            updatePortfolio(user, symbol, quantity, currentPrice, true);
        } else {
            updatePortfolio(user, symbol, quantity, currentPrice, false);
            user.setBalance(user.getBalance().add(totalCost));
        }

        userRepository.save(user);
        
        // Log transaction
        Transaction tx = Transaction.builder()
                .user(user)
                .symbol(symbol)
                .quantity(quantity)
                .price(currentPrice)
                .totalAmount(totalCost)
                .type(type.equalsIgnoreCase("BUY") ? TransactionType.BUY : TransactionType.SELL)
                .timestamp(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);
    }

    private void updatePortfolio(User user, String symbol, int quantity, BigDecimal price, boolean isBuy) {
        Optional<Portfolio> existing = portfolioRepository.findByUserAndSymbol(user, symbol);
        
        if (isBuy) {
            if (existing.isPresent()) {
                Portfolio p = existing.get();
                BigDecimal oldTotal = p.getAveragePrice().multiply(new BigDecimal(p.getQuantity()));
                BigDecimal newTotal = price.multiply(new BigDecimal(quantity));
                int newQty = p.getQuantity() + quantity;
                p.setAveragePrice(oldTotal.add(newTotal).divide(new BigDecimal(newQty), 2, RoundingMode.HALF_UP));
                p.setQuantity(newQty);
                portfolioRepository.save(p);
            } else {
                Portfolio p = Portfolio.builder()
                        .user(user)
                        .symbol(symbol)
                        .quantity(quantity)
                        .averagePrice(price)
                        .build();
                portfolioRepository.save(p);
            }
        } else {
            Portfolio p = existing.orElseThrow(() -> new RuntimeException("No holdings for " + symbol));
            if (p.getQuantity() < quantity) throw new RuntimeException("Insufficient quantity to sell");
            
            p.setQuantity(p.getQuantity() - quantity);
            if (p.getQuantity() == 0) {
                portfolioRepository.delete(p);
            } else {
                portfolioRepository.save(p);
            }
        }
    }
}
