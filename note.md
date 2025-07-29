# 🚀 Setup Guide - Fastify Prisma Boilerplate

Panduan lengkap untuk setup dan penggunaan boilerplate ini sebagai template proyek baru.

## 📋 Checklist Setup

### ✅ 1. Prerequisites
- [ ] Node.js 18+ installed
- [ ] Docker dan Docker Compose installed
- [ ] Git installed
- [ ] Text editor (VS Code recommended)

### ✅ 2. Project Initialization
- [ ] Clone atau download boilerplate
- [ ] Rename project folder
- [ ] Initialize new git repository
- [ ] Update package.json information

### ✅ 3. Environment Configuration
- [ ] Copy .env.example to .env
- [ ] Configure database connection
- [ ] Set application port
- [ ] Configure logging level

### ✅ 4. Database Setup
- [ ] Start PostgreSQL (Docker atau local)
- [ ] Run database migration
- [ ] Seed initial data (optional)
- [ ] Verify database connection

### ✅ 5. Application Testing
- [ ] Start development server
- [ ] Test health endpoint
- [ ] Test API endpoints
- [ ] Verify hot reload

## 🛠️ Detailed Setup Steps

### Step 1: Project Initialization

```bash
# 1. Clone boilerplate
git clone <boilerplate-repo> my-new-project
cd my-new-project

# 2. Remove existing git history
rm -rf .git

# 3. Initialize new repository
git init
git add .
git commit -m "Initial commit from boilerplate"

# 4. Update package.json
nano package.json
# Update: name, description, author, repository
```

### Step 2: Environment Configuration

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit environment variables
nano .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/your_db_name?schema=public"

# Server
PORT=3000
NODE_ENV=development

# Optional
LOG_LEVEL=debug
```

### Step 3: Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start development environment
./run.sh dev
```

#### Option B: Local PostgreSQL

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL service
sudo service postgresql start

# 3. Create database
createdb your_db_name

# 4. Run migration
npm run db:migrate

# 5. Seed data (optional)
npm run db:seed

# 6. Start application
npm run dev
```

### Step 4: Verification

```bash
# 1. Health check
curl http://localhost:3000/health

# Expected response:
# {"status":"OK","timestamp":"2024-01-01T00:00:00.000Z"}

# 2. API test
curl http://localhost:3000/api/users

# Expected response:
# {"data":[...]}

# 3. Create test user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## 🔧 Customization Guide

### 1. Update Project Information

**package.json:**
```json
{
  "name": "your-project-name",
  "description": "Your project description",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/your-project.git"
  }
}
```

**README.md:**
- Update project title
- Update description
- Update repository URLs
- Add project-specific documentation

### 2. Database Schema Customization

**Edit `prisma/schema.prisma`:**
```prisma
// Add your models
model YourModel {
  id        Int      @id @default(autoincrement())
  name      String
  // Add your fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("your_table_name")
}
```

**Run migration:**
```bash
npx prisma migrate dev --name add_your_model
```

### 3. API Routes Customization

**Create new route file:**
```javascript
// routes/your-routes.js
const prisma = require("../lib/prisma");

async function yourRoutes(fastify, options) {
  // Add your endpoints
  fastify.get("/your-endpoint", async (request, reply) => {
    // Your logic here
  });
}

module.exports = yourRoutes;
```

**Register in server.js:**
```javascript
// server.js
fastify.register(require("./routes/your-routes"), { prefix: "/api" });
```

### 4. Environment-Specific Configuration

**Development (.env):**
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/your_dev_db?schema=public"
PORT=3000
LOG_LEVEL=debug
```

**Staging (.env.staging):**
```env
NODE_ENV=staging
DATABASE_URL="postgresql://postgres:staging_password@localhost:5433/your_staging_db?schema=public"
PORT=3000
LOG_LEVEL=info
```

**Production (.env.production):**
```env
NODE_ENV=production
DATABASE_URL="postgresql://username:password@hostname:5432/your_prod_db?schema=public&sslmode=require"
PORT=3000
LOG_LEVEL=warn
JWT_SECRET=your_secure_jwt_secret
```

## 🚀 Deployment Preparation

### 1. Development to Staging

```bash
# 1. Setup staging environment
cp .env.staging.example .env.staging
nano .env.staging

# 2. Test staging build
./run.sh staging

# 3. Verify staging deployment
curl http://localhost:3001/health
```

### 2. Staging to Production

```bash
# 1. Setup production environment
cp .env.production.example .env.production
nano .env.production

# 2. Update production database URL
# 3. Set secure JWT secret
# 4. Configure monitoring (optional)

# 5. Deploy to production
./run.sh prod

# 6. Verify production deployment
curl http://localhost:3002/health
```

### 3. Production Checklist

- [ ] Database backup strategy
- [ ] SSL certificate setup
- [ ] Monitoring dan logging
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Security audit
- [ ] Load testing
- [ ] Disaster recovery plan

## 🔍 Common Customizations

### 1. Authentication

```bash
# Install JWT dependencies
npm install jsonwebtoken bcryptjs

# Add authentication middleware
# Add user registration/login endpoints
# Add protected routes
```

### 2. File Upload

```bash
# Install multer for file uploads
npm install @fastify/multipart

# Add file upload endpoints
# Configure storage (local/cloud)
```

### 3. Email Service

```bash
# Install email service
npm install nodemailer

# Configure email templates
# Add email sending functionality
```

### 4. Caching

```bash
# Install Redis for caching
npm install redis

# Add caching middleware
# Configure cache strategies
```

### 5. Rate Limiting

```bash
# Install rate limiting
npm install @fastify/rate-limit

# Configure rate limits
# Add IP-based limiting
```

## 🧪 Testing Setup

### 1. Unit Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Create test files
mkdir tests
touch tests/users.test.js
touch tests/posts.test.js
```

### 2. Integration Testing

```bash
# Setup test database
createdb your_project_test

# Configure test environment
cp .env .env.test
# Update DATABASE_URL for test database
```

### 3. E2E Testing

```bash
# Install E2E testing tools
npm install --save-dev cypress

# Setup Cypress
npx cypress open
```

## 📊 Monitoring Setup

### 1. Application Monitoring

```bash
# Install monitoring dependencies
npm install prom-client

# Add metrics endpoint
# Configure custom metrics
```

### 2. Error Tracking

```bash
# Install Sentry
npm install @sentry/node

# Configure error tracking
# Add error reporting
```

### 3. Logging

```bash
# Install advanced logging
npm install winston

# Configure log rotation
# Add structured logging
```

## 🔒 Security Hardening

### 1. Basic Security

```bash
# Install security plugins
npm install @fastify/helmet @fastify/cors

# Configure CORS properly
# Add security headers
# Validate all inputs
```

### 2. Authentication Security

```bash
# Use strong JWT secrets
# Implement refresh tokens
# Add rate limiting
# Hash passwords properly
```

### 3. Database Security

```bash
# Use environment variables for credentials
# Enable SSL for database connections
# Implement proper access controls
# Regular security updates
```

## 📚 Additional Resources

### Learning Resources
- [Fastify Documentation](https://www.fastify.io/docs/)
- [Prisma Guides](https://www.prisma.io/docs/guides)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

### Tools dan Extensions
- **VS Code Extensions:**
  - Prisma
  - Docker
  - REST Client
  - GitLens
  - ESLint
  - Prettier

### Community
- [Fastify Discord](https://discord.gg/fastify)
- [Prisma Community](https://www.prisma.io/community)
- [Node.js Community](https://nodejs.org/en/get-involved/)

---

## 🎯 Quick Start Commands

```bash
# Complete setup in one go
git clone <boilerplate-repo> my-project
cd my-project
cp .env.example .env
./run.sh dev

# Verify setup
curl http://localhost:3000/health
curl http://localhost:3000/api/users
```

**Selamat! Boilerplate Anda siap digunakan! 🎉**

