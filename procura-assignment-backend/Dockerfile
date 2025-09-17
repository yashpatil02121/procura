# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy all files
COPY . .

# Build NestJS project
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the service
CMD ["pnpm", "start:prod"]
