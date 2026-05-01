package com.bookstore.api;

import com.bookstore.api.model.Book;
import com.bookstore.api.model.Role;
import com.bookstore.api.model.User;
import com.bookstore.api.model.Cart;
import com.bookstore.api.repository.BookRepository;
import com.bookstore.api.repository.UserRepository;
import com.bookstore.api.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@bookstore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            cartRepository.save(Cart.builder().user(admin).build());

            User user = User.builder()
                    .name("Test User")
                    .email("user@bookstore.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
            cartRepository.save(Cart.builder().user(user).build());
        }

        if (bookRepository.count() == 0) {
            List<Book> initialBooks = List.of(
                    // Classic
                    Book.builder().title("The Great Gatsby").author("F. Scott Fitzgerald").price(new BigDecimal("45.99")).category("Classic").stock(50).description("A classic novel about the American Dream").imageUrl("https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg").build(),
                    Book.builder().title("To Kill a Mockingbird").author("Harper Lee").price(new BigDecimal("44.99")).category("Classic").stock(40).description("A timeless story of justice and racial inequality in the American South.").imageUrl("https://covers.openlibrary.org/b/isbn/9780061935466-L.jpg").build(),
                    Book.builder().title("Pride and Prejudice").author("Jane Austen").price(new BigDecimal("39.99")).category("Classic").stock(45).description("A romantic novel of manners set in rural England.").imageUrl("https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg").build(),
                    // Science Fiction
                    Book.builder().title("1984").author("George Orwell").price(new BigDecimal("52.50")).category("Science Fiction").stock(30).description("A dystopian social science fiction novel about totalitarianism.").imageUrl("https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg").build(),
                    Book.builder().title("Dune").author("Frank Herbert").price(new BigDecimal("68.99")).category("Science Fiction").stock(25).description("A stunning blend of adventure and mysticism, environmentalism and politics.").imageUrl("https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg").build(),
                    Book.builder().title("Foundation").author("Isaac Asimov").price(new BigDecimal("55.50")).category("Science Fiction").stock(40).description("The epic saga of humanity's survival through the collapse of civilization.").imageUrl("https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg").build(),
                    // Fantasy
                    Book.builder().title("The Hobbit").author("J.R.R. Tolkien").price(new BigDecimal("64.00")).category("Fantasy").stock(60).description("The great adventure of Bilbo Baggins in the Misty Mountains.").imageUrl("https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg").build(),
                    Book.builder().title("Harry Potter and the Sorcerer's Stone").author("J.K. Rowling").price(new BigDecimal("71.99")).category("Fantasy").stock(100).description("The boy who lived begins his magical journey at Hogwarts.").imageUrl("https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg").build(),
                    // Romance
                    Book.builder().title("The Notebook").author("Nicholas Sparks").price(new BigDecimal("43.50")).category("Romance").stock(35).description("A timeless love story of passion and devotion.").imageUrl("https://covers.openlibrary.org/b/isbn/9781455582877-L.jpg").build(),
                    Book.builder().title("Outlander").author("Diana Gabaldon").price(new BigDecimal("49.99")).category("Romance").stock(40).description("A sweeping historical romance spanning centuries.").imageUrl("https://covers.openlibrary.org/b/isbn/9780440212560-L.jpg").build(),
                    // Thriller & Mystery
                    Book.builder().title("Gone Girl").author("Gillian Flynn").price(new BigDecimal("56.00")).category("Thriller & Mystery").stock(20).description("A psychological thriller about a missing wife with shocking twists.").imageUrl("https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg").build(),
                    Book.builder().title("The Girl with the Dragon Tattoo").author("Stieg Larsson").price(new BigDecimal("57.99")).category("Thriller & Mystery").stock(50).description("A gripping murder mystery set in the corporate world of Sweden.").imageUrl("https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg").build(),
                    Book.builder().title("The Silent Patient").author("Alex Michaelides").price(new BigDecimal("61.50")).category("Thriller & Mystery").stock(40).description("A famous painter shoots her husband and then never speaks again.").imageUrl("https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg").build(),
                    Book.builder().title("In the Woods").author("Tana French").price(new BigDecimal("59.99")).category("Thriller & Mystery").stock(30).description("A Dublin detective investigates a murder that echoes an unsolved case from his own past.").imageUrl("https://covers.openlibrary.org/b/isbn/9780143113485-L.jpg").build(),
                    // Historical Fiction
                    Book.builder().title("Sapiens").author("Yuval Noah Harari").price(new BigDecimal("62.00")).category("Historical Fiction").stock(80).description("A brief history of humankind from the Stone Age to the present.").imageUrl("https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg").build(),
                    Book.builder().title("The Book Thief").author("Markus Zusak").price(new BigDecimal("53.99")).category("Historical Fiction").stock(60).description("A story about a girl who steals books in Nazi Germany, narrated by Death.").imageUrl("https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg").build(),
                    // Self-Help
                    Book.builder().title("Atomic Habits").author("James Clear").price(new BigDecimal("45.00")).category("Self-Help").stock(120).description("Tiny changes, remarkable results. Build good habits and break bad ones.").imageUrl("https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg").build(),
                    Book.builder().title("Thinking, Fast and Slow").author("Daniel Kahneman").price(new BigDecimal("58.00")).category("Self-Help").stock(55).description("The two systems that drive the way we think and make decisions.").imageUrl("https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg").build(),
                    // Biography
                    Book.builder().title("Steve Jobs").author("Walter Isaacson").price(new BigDecimal("71.50")).category("Biography").stock(45).description("The exclusive biography of Apple's visionary co-founder.").imageUrl("https://covers.openlibrary.org/b/isbn/9781451648546-L.jpg").build(),
                    Book.builder().title("Becoming").author("Michelle Obama").price(new BigDecimal("69.99")).category("Biography").stock(90).description("An intimate, powerful, and inspiring memoir by the former First Lady.").imageUrl("https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg").build()
            );
            bookRepository.saveAll(initialBooks);
        }
    }
}
