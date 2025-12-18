FROM python:3.11-slim

ARG ENV=development

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for production
RUN if [ "$ENV" = "production" ]; then \
    useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app; \
    fi

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Switch to non-root user in production (only if user exists)
USER root

EXPOSE 8000

# Command varies by environment
CMD if [ "$ENV" = "production" ]; then \
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4; \
    else \
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload; \
    fi