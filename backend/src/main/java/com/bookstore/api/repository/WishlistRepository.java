package com.bookstore.api.repository;

import com.bookstore.api.model.WishlistItem;
import com.bookstore.api.model.User;
import com.bookstore.api.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByUserAndBook(User user, Book book);
    void deleteByUserAndBook(User user, Book book);
}
