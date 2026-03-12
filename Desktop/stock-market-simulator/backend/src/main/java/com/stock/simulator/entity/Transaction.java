package com.stock.simulator.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String symbol;
    
    private Integer quantity;
    
    private BigDecimal price;
    
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // BUY, SELL

    private LocalDateTime timestamp;
}
