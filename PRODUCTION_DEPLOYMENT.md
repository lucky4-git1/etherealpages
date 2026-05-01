# Ethereal Pages - Bookstore E-Commerce Platform

A full-stack bookstore e-commerce application with React frontend and Spring Boot backend.

## Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Java 17+ (for backend)
- Maven (for backend)

### Running Development Environment

#### Backend

```bash
cd backend
mvn spring-boot:run
```

The backend runs on `http://localhost:8080`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`

## Production Deployment

### Backend Deployment

#### Environment Configuration

Create `application-prod.properties` in `backend/src/main/resources/`:

```properties
# Database (MySQL example)
spring.datasource.url=jdbc:mysql://your-db-host:3306/bookstore
spring.datasource.username=your_db_user
spring.datasource.password=your_secure_password
spring.jpa.hibernate.ddl-auto=validate

# JWT Secret - Generate a secure random key
application.security.jwt.secret-key=your_secure_random_jwt_key_here
application.security.jwt.expiration=86400000

# Server
server.port=8080
```

#### Build & Run

```bash
cd backend
mvn clean package -DskipTests
java -jar target/api-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

Or with Docker:

```bash
docker build -t bookstore-api .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/bookstore \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=password \
  bookstore-api
```

### Frontend Deployment

#### Environment Configuration

Create `.env.production`:

```
VITE_API_URL=https://your-api-domain.com
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

#### Build & Deploy

```bash
cd frontend
npm install
npm run build
```

Upload the `dist/` directory to your hosting (Vercel, Netlify, AWS S3+CloudFront, etc.)

**Netlify Example:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Vercel Example:**

```bash
npm install -g vercel
vercel --prod
```

## Architecture

### Backend (Spring Boot)

- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: Database ORM
- **RESTful APIs**:
  - `/api/auth/*` - Authentication & Authorization
  - `/api/books/*` - Book management
  - `/api/cart/*` - Shopping cart operations
  - `/api/wishlist/*` - Wishlist management
  - `/api/orders/*` - Order management

### Frontend (React + Vite)

- **React Router**: Client-side routing
- **Context API**: State management (Auth, Cart, Wishlist)
- **Axios**: HTTP client with interceptors
- **TailwindCSS**: Styling
- **Framer Motion**: Animations

### Database Schema

- **Users**: Authentication & profiles
- **Books**: Product catalog
- **Cart/CartItems**: Shopping cart
- **Orders/OrderItems**: Order history
- **WishlistItems**: Saved items

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/google` - Google OAuth login

### Books

- `GET /api/books` - Get all books (public)
- `GET /api/books/{id}` - Get book details (public)
- `GET /api/books/search?query=...` - Search books (public)
- `POST /api/admin/books` - Create book (admin)
- `PUT /api/admin/books/{id}` - Update book (admin)
- `DELETE /api/admin/books/{id}` - Delete book (admin)

### Cart

- `GET /api/cart` - View cart
- `POST /api/cart/add?bookId={id}&quantity={qty}` - Add to cart
- `DELETE /api/cart/remove/{itemId}` - Remove from cart

### Wishlist

- `GET /api/wishlist` - View wishlist
- `POST /api/wishlist/{bookId}` - Toggle wishlist

### Orders

- `POST /api/orders` - Place order
- `GET /api/orders/user` - Get user orders

## Security Considerations

### Production Checklist

- [ ] Change JWT secret key to a secure random value
- [ ] Use HTTPS/TLS for all communications
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Enable HTTPS redirect
- [ ] Use secure database passwords
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Add API request logging
- [ ] Enable CSRF protection if needed
- [ ] Regularly update dependencies
- [ ] Review security headers

### Environment Variables

**Backend:**

```
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
APPLICATION_SECURITY_JWT_SECRET_KEY
APPLICATION_SECURITY_JWT_EXPIRATION
SPRING_PROFILES_ACTIVE=prod
```

**Frontend:**

```
VITE_API_URL
VITE_GOOGLE_CLIENT_ID
```

## Monitoring & Maintenance

### Logging

- Backend logs are configured in application properties
- Frontend errors are caught in API interceptors
- Set up centralized logging (ELK, DataDog, etc.) in production

### Database

- Regular backups (daily or per your SLA)
- Monitor database performance
- Implement connection pooling
- Use indexes on frequently queried columns

### Performance

- Enable gzip compression on backend
- Implement Redis caching for frequently accessed books
- Use CDN for static assets
- Monitor API response times
- Implement pagination for list endpoints

## Troubleshooting

### Backend won't compile

- Check Java version: `java -version` (should be 17+)
- Clear Maven cache: `mvn clean`
- Verify dependency installation: `mvn dependency:resolve`

### Frontend API calls failing

- Check backend is running on `http://localhost:8080`
- Verify VITE_API_URL environment variable
- Check CORS configuration in SecurityConfiguration.java
- Review browser console for error details

### Authentication issues

- Verify JWT secret key is configured
- Check token expiration time
- Ensure Authorization header is sent correctly
- Review SecurityContextHolder configuration

## Development Workflow

### Adding a new book

1. Create/update book in admin panel (or manually via POST `/api/admin/books`)
2. Frontend automatically fetches and displays
3. Users can add to cart or wishlist

### Adding a new API endpoint

1. Create Service class
2. Create Controller class with mapping
3. Update security configuration if needed (public vs authenticated)
4. Update frontend API client
5. Create corresponding frontend component/page

### Deploying updates

1. Backend: Build jar and deploy to server or Docker
2. Frontend: Build and push to hosting provider
3. Update environment variables as needed
4. Clear browser cache if needed

## Technologies Used

- **Backend**: Spring Boot 4.0, Spring Security, Spring Data JPA, Maven
- **Frontend**: React 19, Vite 8, TailwindCSS, Framer Motion
- **Database**: H2 (dev), MySQL (prod recommended)
- **Authentication**: JWT, Google OAuth
- **Hosting**: Docker, AWS, Heroku, Vercel, Netlify (flexible)

## Support & Contributing

For issues or questions, check the error logs and ensure:

1. All environment variables are set correctly
2. Database is running and accessible
3. Backend and frontend are running on expected ports
4. CORS is configured properly
5. JWT secret is not exposed in code

## License

Proprietary - All rights reserved
