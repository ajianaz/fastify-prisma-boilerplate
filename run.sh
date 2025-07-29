#!/bin/bash

# Script untuk menjalankan aplikasi dalam berbagai mode
# Usage: ./run.sh [dev|staging|prod|stop]

set -e

case "$1" in
  "dev")
    echo "🚀 Starting Development Mode..."
    echo "Mode: Development dengan nodemon dan hot reload"
    echo "Port: 3000"
    docker-compose -f docker-compose.dev.yml up --build
    ;;
  
  "staging")
    echo "🚀 Starting Staging Mode..."
    echo "Mode: Staging dengan PM2"
    echo "Port: 3001"
    docker-compose -f docker-compose.staging.yml up --build -d
    echo "✅ Staging environment started!"
    echo "📊 View logs: docker-compose -f docker-compose.staging.yml logs -f"
    ;;
  
  "prod")
    echo "🚀 Starting Production Mode..."
    echo "Mode: Production dengan PM2"
    echo "Port: 3002"
    
    # Check if .env.production exists
    if [ ! -f .env.production ]; then
      echo "❌ .env.production file not found!"
      echo "Please create .env.production with production environment variables"
      exit 1
    fi
    
    # Load production environment variables
    export $(cat .env.production | xargs)
    
    docker-compose -f docker-compose.prod.yml up --build -d
    echo "✅ Production environment started!"
    echo "📊 View logs: docker-compose -f docker-compose.prod.yml logs -f"
    ;;
  
  "stop")
    echo "🛑 Stopping all environments..."
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.staging.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    echo "✅ All environments stopped!"
    ;;
  
  "logs")
    echo "📊 Showing logs for all environments..."
    echo "=== Development Logs ==="
    docker-compose -f docker-compose.dev.yml logs --tail=50 2>/dev/null || echo "Development not running"
    echo "=== Staging Logs ==="
    docker-compose -f docker-compose.staging.yml logs --tail=50 2>/dev/null || echo "Staging not running"
    echo "=== Production Logs ==="
    docker-compose -f docker-compose.prod.yml logs --tail=50 2>/dev/null || echo "Production not running"
    ;;
  
  "status")
    echo "📊 Checking status of all environments..."
    echo "=== Development ==="
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "Development not running"
    echo "=== Staging ==="
    docker-compose -f docker-compose.staging.yml ps 2>/dev/null || echo "Staging not running"
    echo "=== Production ==="
    docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "Production not running"
    ;;
  
  *)
    echo "🔧 Fastify Prisma Boilerplate Runner"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev      - Start development environment (port 3000)"
    echo "  staging  - Start staging environment (port 3001)"
    echo "  prod     - Start production environment (port 3002)"
    echo "  stop     - Stop all environments"
    echo "  logs     - Show logs from all environments"
    echo "  status   - Show status of all environments"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development with hot reload"
    echo "  $0 staging  # Start staging with PM2"
    echo "  $0 prod     # Start production with PM2"
    echo "  $0 stop     # Stop all running environments"
    ;;
esac

