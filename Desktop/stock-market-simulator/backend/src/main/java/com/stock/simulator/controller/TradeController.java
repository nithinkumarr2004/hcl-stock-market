package com.stock.simulator.controller;

import com.stock.simulator.dto.TradeRequest;
import com.stock.simulator.entity.User;
import com.stock.simulator.repository.UserRepository;
import com.stock.simulator.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trade")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> executeTrade(@RequestBody TradeRequest request, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        try {
            tradeService.executeTrade(user, request.getSymbol(), request.getQuantity(), request.getType());
            return ResponseEntity.ok("Trade executed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
