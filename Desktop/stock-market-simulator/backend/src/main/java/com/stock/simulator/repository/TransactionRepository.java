package com.stock.simulator.repository;

import com.stock.simulator.entity.Transaction;
import com.stock.simulator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);
}
