package com.bookstore.api.controller;

import com.bookstore.api.model.CartItem;
import com.bookstore.api.model.User;
import com.bookstore.api.repository.CartItemRepository;
import com.bookstore.api.repository.CartRepository;
import com.bookstore.api.repository.UserRepository;
import com.bookstore.api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    @GetMapping
    public ResponseEntity<?> getCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        
        // Map to a clean DTO to completely avoid any Hibernate proxy Jackson serialization issues
        List<java.util.Map<String, Object>> cartItemsDto = cartItemRepository.findByCartId(cart.getId())
            .stream()
            .map(item -> {
                java.util.Map<String, Object> dto = new java.util.HashMap<>();
                dto.put("id", item.getId());
                dto.put("book", item.getBook());
                dto.put("quantity", item.getQuantity());
                return dto;
            })
            .collect(java.util.stream.Collectors.toList());
            
        return ResponseEntity.ok(cartItemsDto);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestParam Long bookId, @RequestParam Integer quantity) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        var book = bookRepository.findById(bookId).orElseThrow();

        var existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return ResponseEntity.ok(cartItemRepository.save(item));
        }

        CartItem newItem = CartItem.builder()
                .cart(cart)
                .book(book)
                .quantity(quantity)
                .build();
        return ResponseEntity.ok(cartItemRepository.save(newItem));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
        cartItemRepository.deleteById(itemId);
        return ResponseEntity.ok().build();
    }
}
