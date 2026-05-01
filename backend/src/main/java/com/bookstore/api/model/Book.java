package com.bookstore.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    private String category;
    private Integer stock;
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;
}
