package com.stock.simulator.repository;

import com.stock.simulator.entity.Order;
import com.stock.simulator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findBySymbol(String symbol);
}
