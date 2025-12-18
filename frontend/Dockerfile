FROM node:18-alpine

ARG ENV=development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application for production
RUN if [ "$ENV" = "production" ]; then \
    npm run build; \
    fi

# Expose port
EXPOSE 3000

# Command varies by environment
CMD if [ "$ENV" = "production" ]; then \
    npm start; \
    else \
    npm run dev; \
    fi