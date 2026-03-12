package com.stock.simulator.dto;

import lombok.Data;

@Data
public class TradeRequest {
    private String symbol;
    private int quantity;
    private String type; // BUY or SELL
}
