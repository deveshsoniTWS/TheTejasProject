# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client (safe even if not used yet)
RUN npx prisma generate || true

# Expose backend port
EXPOSE 8000

# Start app (tsx dev style inside container)
CMD ["npx", "tsx", "watch", "src/server.ts"]