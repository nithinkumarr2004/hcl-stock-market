package com.stock.simulator.controller;

import com.stock.simulator.entity.Portfolio;
import com.stock.simulator.entity.User;
import com.stock.simulator.repository.PortfolioRepository;
import com.stock.simulator.repository.UserRepository;
import com.stock.simulator.service.RiskEngineService;
import com.stock.simulator.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RiskEngineService riskEngineService;

    @Autowired
    private StockService stockService;

    @GetMapping
    public ResponseEntity<?> getUserPortfolio(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        List<Portfolio> holdings = portfolioRepository.findByUser(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("holdings", holdings);
        response.put("balance", user.getBalance());
        response.put("riskMetrics", riskEngineService.calculateRiskMetrics(user, stockService.getCurrentPrices()));
        
        return ResponseEntity.ok(response);
    }
}
