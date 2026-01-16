# ===== STAGE 1: Build =====
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript into /dist
RUN npm run build

# ===== STAGE 2: Production =====
FROM node:22-alpine

WORKDIR /app

# Copy only built files and package.json (no devDependencies)
COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port (change if needed)
EXPOSE 5000

# Start the server
CMD ["node", "./dist/server.js"]
