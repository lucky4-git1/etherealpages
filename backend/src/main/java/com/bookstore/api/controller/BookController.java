package com.bookstore.api.controller;

import com.bookstore.api.model.Book;
import com.bookstore.api.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookController {

    private final BookRepository bookRepository;

    @GetMapping("/api/books")
    public ResponseEntity<List<Book>> getAllBooks(@RequestParam(required = false) String category) {
        if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(bookRepository.findByCategoryIgnoreCase(category));
        }
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @GetMapping("/api/books/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/books/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(query, query));
    }

    @PostMapping("/api/admin/books")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @PutMapping("/api/admin/books/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        return bookRepository.findById(id)
                .map(book -> {
                    book.setTitle(bookDetails.getTitle());
                    book.setAuthor(bookDetails.getAuthor());
                    book.setPrice(bookDetails.getPrice());
                    book.setCategory(bookDetails.getCategory());
                    book.setStock(bookDetails.getStock());
                    book.setImageUrl(bookDetails.getImageUrl());
                    book.setDescription(bookDetails.getDescription());
                    return ResponseEntity.ok(bookRepository.save(book));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/admin/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(book -> {
                    bookRepository.delete(book);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
