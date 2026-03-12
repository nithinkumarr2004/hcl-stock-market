package com.stock.simulator.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String symbol;
    
    private Integer quantity;
    
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private OrderType type; // BUY, SELL

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // PENDING, COMPLETED, CANCELLED

    private LocalDateTime timestamp;
}

enum OrderType { BUY, SELL }
enum OrderStatus { PENDING, COMPLETED, CANCELLED }
