package com.bookstore.api.controller;

import com.bookstore.api.model.Book;
import com.bookstore.api.model.User;
import com.bookstore.api.model.WishlistItem;
import com.bookstore.api.repository.BookRepository;
import com.bookstore.api.repository.UserRepository;
import com.bookstore.api.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Book>> getWishlist() {
        User user = getCurrentUser();
        List<Book> books = wishlistRepository.findByUser(user)
                .stream()
                .map(WishlistItem::getBook)
                .collect(Collectors.toList());
        return ResponseEntity.ok(books);
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<?> toggleWishlist(@PathVariable Long bookId) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId).orElseThrow();

        var existing = wishlistRepository.findByUserAndBook(user, book);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return ResponseEntity.ok(Map.of("message", "Removed from wishlist", "liked", false));
        } else {
            wishlistRepository.save(WishlistItem.builder().user(user).book(book).build());
            return ResponseEntity.ok(Map.of("message", "Added to wishlist", "liked", true));
        }
    }
}
