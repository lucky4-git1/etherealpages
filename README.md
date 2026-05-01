# Ethereal Pages - Bookstore E-Commerce Platform

A modern, full-stack bookstore e-commerce application built with React and Spring Boot. Features a premium dark UI with smooth animations, seamless authentication (traditional + Google OAuth), and complete shopping functionality.

## Features

✨ **Frontend**

- Responsive dark theme UI with Tailwind CSS
- Smooth scrolling animations with Framer Motion
- Real-time book catalog with API integration
- Shopping cart with persistent backend sync
- Wishlist/favorites functionality
- Authentication (Email/Password + Google OAuth)
- Modern component architecture with React Context API

🔐 **Backend**

- Spring Boot 4.0 with Spring Security
- JWT-based authentication
- RESTful API architecture
- Database persistence (H2 for dev, MySQL for production)
- Google OAuth identity verification
- Complete order management system

## Project Structure

```
java web app/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/bookstore/api/
│   │       ├── controller/  # REST endpoints
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── model/       # JPA entities
│   │       ├── dto/         # Data transfer objects
│   │       └── security/    # JWT & auth config
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # Reusable components
│   │   ├── context/        # State management
│   │   ├── services/       # API client
│   │   └── App.jsx         # Main component
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml      # Multi-container orchestration
└── PRODUCTION_DEPLOYMENT.md # Deployment guide
```

## Quick Start

### Prerequisites

- **Node.js 18+** (frontend)
- **Java 17+** (backend)
- **Maven 3.9+** (backend build)
- **npm 9+** (package manager)

### Development Setup

1. **Clone & Navigate**

```bash
cd backend
cd ../frontend
```

2. **Start Backend**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at `http://localhost:8080`

3. **Start Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

4. **Access the Application**

- Visit `http://localhost:5173` in your browser
- Test account: `user@bookstore.com` / `user123`
- Admin account: `admin@bookstore.com` / `admin123`

## Configuration

### Environment Variables

**Frontend (.env.development)**

```
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Backend (application.properties)**

```properties
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:h2:mem:bookstoredb
application.security.jwt.secret-key=your_jwt_secret
application.security.jwt.expiration=86400000
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register new user         |
| POST   | `/api/auth/login`    | Login with email/password |
| POST   | `/api/auth/google`   | Google OAuth login        |

### Books Endpoints

| Method | Endpoint                   | Description      | Auth Required |
| ------ | -------------------------- | ---------------- | ------------- |
| GET    | `/api/books`               | Get all books    | No            |
| GET    | `/api/books/{id}`          | Get book details | No            |
| GET    | `/api/books/search?query=` | Search books     | No            |
| POST   | `/api/admin/books`         | Create book      | Yes (Admin)   |
| PUT    | `/api/admin/books/{id}`    | Update book      | Yes (Admin)   |
| DELETE | `/api/admin/books/{id}`    | Delete book      | Yes (Admin)   |

### Cart Endpoints

| Method | Endpoint                          | Description      | Auth Required |
| ------ | --------------------------------- | ---------------- | ------------- |
| GET    | `/api/cart`                       | View cart        | Yes           |
| POST   | `/api/cart/add?bookId=&quantity=` | Add to cart      | Yes           |
| DELETE | `/api/cart/remove/{itemId}`       | Remove from cart | Yes           |

### Wishlist Endpoints

| Method | Endpoint                 | Description     | Auth Required |
| ------ | ------------------------ | --------------- | ------------- |
| GET    | `/api/wishlist`          | View wishlist   | Yes           |
| POST   | `/api/wishlist/{bookId}` | Toggle wishlist | Yes           |

### Order Endpoints

| Method | Endpoint           | Description     | Auth Required |
| ------ | ------------------ | --------------- | ------------- |
| POST   | `/api/orders`      | Place order     | Yes           |
| GET    | `/api/orders/user` | Get user orders | Yes           |

## Technology Stack

### Frontend

- **React 19** - UI library
- **Vite 8** - Lightning-fast build tool
- **TailwindCSS 4** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **@react-oauth/google** - Google OAuth

### Backend

- **Spring Boot 4.0** - Application framework
- **Spring Security** - Authentication/Authorization
- **Spring Data JPA** - Database abstraction
- **JWT (io.jsonwebtoken)** - Token management
- **Google API Client** - OAuth verification
- **Lombok** - Code generation
- **MySQL 8** - Production database
- **H2 Database** - Development/Testing

## Database Schema

### Core Tables

- **users** - User accounts with roles
- **roles** - User role definitions
- **books** - Book catalog
- **carts** - User shopping carts
- **cart_items** - Items in carts
- **orders** - User orders
- **order_items** - Items in orders
- **wishlist_items** - Favorited books

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down
```

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- MySQL: localhost:3306

### Production Deployment

See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for:

- Step-by-step deployment guides
- Environment configuration
- Security checklist
- Monitoring setup
- Troubleshooting

## Features Explained

### 🛒 Shopping Cart

- Add/remove books in real-time
- Quantity adjustment
- Persistent backend sync
- Automatic cart loading on login

### ❤️ Wishlist

- Save favorite books
- One-click wishlist toggle
- Wishlist appears in navbar
- Transfer to cart from wishlist

### 🔐 Authentication

- Email/password registration and login
- Google OAuth integration
- JWT token-based sessions
- Auto-login on page refresh
- Role-based access control (USER/ADMIN)

### 📚 Book Management

- Browse complete catalog
- Search and filter
- Detailed book information
- Stock availability
- Admin book management endpoints

### 🛍️ Order Management

- Place orders from cart
- Automatic cart clearing after order
- Order history tracking
- Order summary with tax calculation

## Development Workflow

### Adding a New Feature

1. **Backend**
   - Create Entity in `model/`
   - Create Repository in `repository/`
   - Create Service in `service/`
   - Create Controller in `controller/`

2. **Frontend**
   - Update API client in `services/api.js`
   - Create Context if needed in `context/`
   - Build component in `components/` or `pages/`
   - Add routes in `App.jsx`

3. **Testing**
   - Test API endpoints with Postman/curl
   - Test frontend components
   - Verify authentication flow

### Available Scripts

**Backend**

```bash
mvn clean install         # Build
mvn spring-boot:run       # Run
mvn test                  # Run tests
mvn package              # Create JAR
```

**Frontend**

```bash
npm install              # Install dependencies
npm run dev              # Development server
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## Security Features

✅ JWT-based stateless authentication
✅ Password hashing with BCrypt
✅ CORS configuration for authorized domains
✅ SQL injection prevention via JPA
✅ XSS protection via React
✅ Secure cookie handling
✅ Environment variable isolation
✅ Admin role-based access control

## Performance Optimizations

- Lazy loading with React.lazy()
- Image optimization with lazy loading
- Efficient API caching strategies
- Pagination for list endpoints
- Debounced search functionality
- CSS media queries for responsive design
- Code splitting with route-based bundles

## Troubleshooting

### Backend Issues

```bash
# Clean build if compilation errors
mvn clean compile

# Check Java version
java -version  # Should be 17+

# Verify dependencies
mvn dependency:resolve
```

### Frontend Issues

```bash
# Clear dependencies
rm -rf node_modules
npm install

# Check Node version
node --version  # Should be 18+

# Clear build cache
rm -rf dist
npm run build
```

### Common Errors

**Port already in use**

- Backend: `lsof -i :8080` | `kill -9 <PID>`
- Frontend: `lsof -i :5173` | `kill -9 <PID>`

**CORS errors**

- Check SecurityConfiguration.java for allowed origins
- Verify VITE_API_URL matches backend URL

**Authentication fails**

- Verify JWT secret in application.properties
- Check token expiration settings
- Ensure Authorization header is sent

## Contributing

1. Create a feature branch
2. Commit changes with clear messages
3. Test thoroughly before submitting
4. Follow code style conventions
5. Update documentation as needed

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Book reviews and ratings
- [ ] User profile management
- [ ] Recommendation engine
- [ ] Admin dashboard
- [ ] Analytics tracking
- [ ] Mobile app
- [ ] Multi-language support

## Support

For issues and questions:

1. Check existing issues
2. Review error logs
3. Verify configuration
4. Check CORS and auth settings
5. Test with curl/Postman

## License

© 2026 Ethereal Pages. All rights reserved.

---

**Ready for production!** Follow [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for deployment guidance.
