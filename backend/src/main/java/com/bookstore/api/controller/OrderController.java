package com.bookstore.api.controller;

import com.bookstore.api.model.Order;
import com.bookstore.api.model.OrderItem;
import com.bookstore.api.model.User;
import com.bookstore.api.repository.OrderRepository;
import com.bookstore.api.repository.OrderItemRepository;
import com.bookstore.api.repository.CartRepository;
import com.bookstore.api.repository.CartItemRepository;
import com.bookstore.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder() {
        User user = getCurrentUser();
        var cart = cartRepository.findByUserId(user.getId()).orElseThrow();
        var cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        BigDecimal total = cartItems.stream()
                .map(item -> item.getBook().getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status("COMPLETED") // Auto mark complete for mock payment
                .createdAt(LocalDateTime.now())
                .build();
        
        Order savedOrder = orderRepository.save(order);

        for (var item : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .book(item.getBook())
                    .quantity(item.getQuantity())
                    .price(item.getBook().getPrice())
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Clear cart
        cartItemRepository.deleteAll(cartItems);

        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders() {
        User user = getCurrentUser();
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
