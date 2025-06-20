FROM node:18-alpine

# Install PostgreSQL client for migrations
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . ./

# Create uploads directory
RUN mkdir -p public/uploads/articles

# Generate Prisma client
RUN npx prisma generate

# Environment variables
ENV PORT=3001
ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 3001

# Run migrations and start server
CMD ["sh", "-c", "npm run deploy && npm start"]
