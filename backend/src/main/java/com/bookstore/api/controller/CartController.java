package com.bookstore.api.controller;

import com.bookstore.api.model.Book;
import com.bookstore.api.model.Cart;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<List<Map<String, Object>>> getCart() {
        try {
            User user = getCurrentUser();
            Cart cart = getOrCreateCart(user);
            List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
            
            List<Map<String, Object>> result = new ArrayList<>();
            for (CartItem item : items) {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", item.getId());
                dto.put("quantity", item.getQuantity());
                
                // Build book map manually to avoid any proxy/serialization issues
                Book book = item.getBook();
                if (book != null) {
                    Map<String, Object> bookMap = new HashMap<>();
                    bookMap.put("id", book.getId());
                    bookMap.put("title", book.getTitle());
                    bookMap.put("author", book.getAuthor());
                    bookMap.put("price", book.getPrice());
                    bookMap.put("category", book.getCategory());
                    bookMap.put("stock", book.getStock());
                    bookMap.put("imageUrl", book.getImageUrl());
                    bookMap.put("description", book.getDescription());
                    dto.put("book", bookMap);
                }
                
                result.add(dto);
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Return empty list instead of crashing
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long bookId, @RequestParam Integer quantity) {
        try {
            User user = getCurrentUser();
            Cart cart = getOrCreateCart(user);
            Book book = bookRepository.findById(bookId).orElseThrow();

            var existingItem = cartItemRepository.findByCartIdAndBookId(cart.getId(), bookId);
            if (existingItem.isPresent()) {
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + quantity);
                cartItemRepository.save(item);
            } else {
                CartItem newItem = CartItem.builder()
                        .cart(cart)
                        .book(book)
                        .quantity(quantity)
                        .build();
                cartItemRepository.save(newItem);
            }
            
            // Return a simple success response instead of the entity
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Added to cart");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
        cartItemRepository.deleteById(itemId);
        return ResponseEntity.ok().build();
    }
}
