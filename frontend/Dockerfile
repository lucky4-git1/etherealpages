FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Use a minimal web server for production
FROM node:20-alpine
RUN npm install -g serve

WORKDIR /app

# Copy built application from builder
COPY --from=0 /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Serve the application
CMD ["serve", "-s", "dist", "-l", "3000"]
