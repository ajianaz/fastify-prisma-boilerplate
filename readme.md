# 🚀 Fastify + Prisma + PostgreSQL Boilerplate

Boilerplate lengkap untuk membangun REST API modern menggunakan **Fastify**, **Prisma ORM**, dan **PostgreSQL** dengan dukungan Docker untuk development, staging, dan production environments.

## ✨ Fitur Utama

### 🏗️ Tech Stack
- **Fastify** - Web framework yang cepat dan ringan untuk Node.js
- **Prisma** - ORM modern dengan type-safety dan developer experience yang excellent
- **PostgreSQL** - Database relational yang powerful dan reliable
- **Docker** - Containerization untuk konsistensi environment
- **PM2** - Process manager untuk production dan staging
- **Nodemon** - Hot reload untuk development

### 🔧 Development Features
- **Hot Reload** dengan nodemon untuk development
- **Process Management** dengan PM2 untuk staging/production
- **Multi-Environment** support (dev, staging, prod)
- **Database Migration** dan seeding otomatis
- **CORS** configuration
- **JSON Schema Validation**
- **Structured Logging**
- **Health Check** endpoints
- **Error Handling** yang konsisten

### 🐳 Docker Support
- **Development Mode**: Docker + nodemon untuk hot reload
- **Staging Mode**: Docker + PM2 dengan monitoring
- **Production Mode**: Docker + PM2 dengan optimasi performa
- **Database**: PostgreSQL container untuk setiap environment
- **Networking**: Isolated networks untuk setiap environment

## 📋 Prerequisites

Pastikan sistem Anda memiliki:

- **Node.js** (versi 18 atau lebih baru)
- **Docker** dan **Docker Compose**
- **Git** (untuk cloning repository)

## 🚀 Quick Start

### 1. Clone Boilerplate

```bash
# Clone repository ini sebagai template
git clone <repository-url> my-new-project
cd my-new-project

# Atau download dan extract sebagai template
```

### 2. Setup Environment

```bash
# Copy environment file untuk development
cp .env.example .env

# Edit .env sesuai kebutuhan (opsional untuk development)
nano .env
```

### 3. Start Development

```bash
# Jalankan development mode dengan Docker
./run.sh dev

# Atau tanpa Docker (memerlukan PostgreSQL lokal)
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

### 4. Test API

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

## 📁 Struktur Proyek

```
fastify-prisma-boilerplate/
├── 📁 lib/
│   └── prisma.js              # Konfigurasi Prisma Client
├── 📁 logs/                   # Log files (PM2)
├── 📁 prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js               # Script untuk seed data
├── 📁 routes/
│   ├── users.js              # Routes untuk User API
│   └── posts.js              # Routes untuk Post API
├── 🐳 Dockerfile.dev          # Docker untuk development
├── 🐳 Dockerfile.staging      # Docker untuk staging
├── 🐳 Dockerfile.prod         # Docker untuk production
├── 🐳 docker-compose.dev.yml  # Docker Compose development
├── 🐳 docker-compose.staging.yml # Docker Compose staging
├── 🐳 docker-compose.prod.yml # Docker Compose production
├── ⚙️ ecosystem.config.js     # PM2 configuration
├── 🔧 run.sh                  # Script runner untuk semua mode
├── 📄 .env                    # Environment variables (development)
├── 📄 .env.example            # Template environment development
├── 📄 .env.staging.example    # Template environment staging
├── 📄 .env.production.example # Template environment production
├── 📄 .gitignore             # Git ignore file
├── 📄 package.json           # Dependencies dan scripts
├── 📄 server.js              # Entry point aplikasi
└── 📖 README.md              # Dokumentasi ini
```

## 🔧 Environment Modes

### 🛠️ Development Mode

**Karakteristik:**
- Hot reload dengan nodemon
- Detailed logging
- Auto migration dan seeding
- Port: 3000

**Menjalankan:**
```bash
# Dengan Docker (Recommended)
./run.sh dev

# Tanpa Docker
npm run dev
```

**Environment Variables:**
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/fastify_prisma_db?schema=public"
PORT=3000
LOG_LEVEL=debug
```

### 🧪 Staging Mode

**Karakteristik:**
- PM2 process management
- Production-like environment
- Monitoring dan logging
- Port: 3001

**Menjalankan:**
```bash
# Setup environment
cp .env.staging.example .env.staging
# Edit .env.staging sesuai kebutuhan

# Start staging
./run.sh staging
```

**Environment Variables:**
```env
NODE_ENV=staging
DATABASE_URL="postgresql://postgres:staging_password@localhost:5433/fastify_prisma_db?schema=public"
PORT=3000
LOG_LEVEL=info
```

### 🚀 Production Mode

**Karakteristik:**
- PM2 cluster mode
- Optimasi performa
- Resource limits
- Security hardening
- Port: 3002

**Menjalankan:**
```bash
# Setup environment
cp .env.production.example .env.production
# Edit .env.production dengan nilai production

# Start production
./run.sh prod
```

**Environment Variables:**
```env
NODE_ENV=production
DATABASE_URL="postgresql://username:password@hostname:5432/database_name?schema=public&sslmode=require"
PORT=3000
LOG_LEVEL=warn
```

## 🐳 Docker Configuration

### Development (Dockerfile.dev)

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["nodemon", "server.js"]
```

**Features:**
- Hot reload dengan volume mounting
- Development dependencies included
- Auto migration dan seeding

### Staging (Dockerfile.staging)

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g pm2
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm prune --production
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "staging"]
```

**Features:**
- PM2 process management
- Production dependencies only
- Health monitoring

### Production (Dockerfile.prod)

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g pm2
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm prune --production
EXPOSE 3000
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
```

**Features:**
- PM2 cluster mode
- Resource optimization
- Security hardening

## ⚙️ PM2 Configuration

File `ecosystem.config.js` mengatur PM2 untuk staging dan production:

```javascript
module.exports = {
  apps: [
    {
      name: 'fastify-app',
      script: 'server.js',
      instances: 'max', // Gunakan semua CPU cores
      exec_mode: 'cluster',
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Monitoring dan logging
      max_memory_restart: '1G',
      restart_delay: 4000,
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
};
```

## 📚 API Documentation

### Base Information

| Environment | URL | Port |
|-------------|-----|------|
| Development | http://localhost:3000 | 3000 |
| Staging | http://localhost:3001 | 3001 |
| Production | http://localhost:3002 | 3002 |

### Core Endpoints

#### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information dan daftar endpoints |
| GET | `/health` | Health check endpoint |

#### User Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/users` | Mendapatkan semua users | - |
| GET | `/api/users/:id` | Mendapatkan user berdasarkan ID | - |
| POST | `/api/users` | Membuat user baru | `{email, name?}` |
| PUT | `/api/users/:id` | Update user | `{email?, name?}` |
| DELETE | `/api/users/:id` | Hapus user | - |

#### Post Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/posts` | Mendapatkan semua posts | - |
| GET | `/api/posts/:id` | Mendapatkan post berdasarkan ID | - |
| GET | `/api/posts/published` | Mendapatkan posts yang published | - |
| POST | `/api/posts` | Membuat post baru | `{title, content?, published?, authorId}` |
| PUT | `/api/posts/:id` | Update post | `{title?, content?, published?}` |
| DELETE | `/api/posts/:id` | Hapus post | - |

### Request/Response Examples

#### Create User

**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Post

**Request:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post",
    "published": true,
    "authorId": 1
  }'
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content of my first post",
    "published": true,
    "authorId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}
```

## 🗄️ Database Management

### Schema Definition

Database schema didefinisikan di `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

### Prisma Commands

```bash
# Generate Prisma Client
npm run db:generate

# Create dan run migration
npm run db:migrate

# Deploy migration (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Migration Workflow

1. **Development:**
   ```bash
   # Ubah schema di prisma/schema.prisma
   npm run db:migrate
   # Akan membuat migration file dan update database
   ```

2. **Staging/Production:**
   ```bash
   # Deploy migration tanpa prompt
   npx prisma migrate deploy
   ```

## 🔧 Script Runner

File `run.sh` menyediakan interface unified untuk mengelola semua environment:

### Available Commands

```bash
# Development mode
./run.sh dev

# Staging mode
./run.sh staging

# Production mode
./run.sh prod

# Stop all environments
./run.sh stop

# View logs
./run.sh logs

# Check status
./run.sh status
```

### Command Details

#### Development Mode
```bash
./run.sh dev
```
- Starts development environment dengan hot reload
- Port: 3000
- Auto migration dan seeding
- Volume mounting untuk live code changes

#### Staging Mode
```bash
./run.sh staging
```
- Starts staging environment dengan PM2
- Port: 3001
- Production-like configuration
- Background execution

#### Production Mode
```bash
./run.sh prod
```
- Starts production environment dengan PM2 cluster
- Port: 3002
- Requires `.env.production` file
- Resource limits dan optimization

#### Stop All
```bash
./run.sh stop
```
- Stops semua running environments
- Cleans up containers dan networks

#### View Logs
```bash
./run.sh logs
```
- Shows logs dari semua environments
- Useful untuk debugging

#### Check Status
```bash
./run.sh status
```
- Shows status dari semua environments
- Container health dan port information

## 🧪 Testing

### Manual Testing

#### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'

# Get user by ID
curl http://localhost:3000/api/users/1

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Post", "content": "Test content", "authorId": 1}'

# Get all posts
curl http://localhost:3000/api/posts
```

#### Using GUI Tools

- **Postman**: Import collection dari API documentation
- **Insomnia**: REST client dengan environment support
- **Thunder Client**: VS Code extension untuk API testing

### Load Testing

```bash
# Install artillery untuk load testing
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/health"
      - get:
          url: "/api/users"
EOF

# Run load test
artillery run load-test.yml
```

## 🚀 Deployment

### Local Development

```bash
# Clone boilerplate
git clone <repository-url> my-project
cd my-project

# Setup environment
cp .env.example .env

# Start development
./run.sh dev
```

### Staging Deployment

```bash
# Setup staging environment
cp .env.staging.example .env.staging
# Edit .env.staging dengan staging values

# Deploy to staging
./run.sh staging

# Monitor logs
docker-compose -f docker-compose.staging.yml logs -f
```

### Production Deployment

#### Prerequisites

1. **Production Database**: Setup PostgreSQL database
2. **Environment Variables**: Configure production values
3. **SSL Certificate**: Setup HTTPS (recommended)
4. **Monitoring**: Setup logging dan monitoring

#### Deployment Steps

```bash
# 1. Setup production environment
cp .env.production.example .env.production

# 2. Edit production values
nano .env.production

# 3. Deploy to production
./run.sh prod

# 4. Verify deployment
curl http://localhost:3002/health

# 5. Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Production Environment Variables

```env
# Database (required)
DATABASE_URL="postgresql://username:password@hostname:5432/database_name?schema=public&sslmode=require"
POSTGRES_DB=fastify_prisma_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Server (required)
PORT=3000
NODE_ENV=production

# Security (recommended)
JWT_SECRET=your_jwt_secret_here
API_KEY=your_api_key_here

# Monitoring (optional)
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=warn
```

### Cloud Deployment

#### Docker Registry

```bash
# Build dan push ke registry
docker build -f Dockerfile.prod -t my-app:latest .
docker tag my-app:latest registry.example.com/my-app:latest
docker push registry.example.com/my-app:latest
```

#### Kubernetes

```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastify-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fastify-app
  template:
    metadata:
      labels:
        app: fastify-app
    spec:
      containers:
      - name: fastify-app
        image: registry.example.com/my-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
```

#### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml fastify-stack
```

## 🔧 Customization

### Menambah Model Baru

1. **Update Schema:**
```prisma
// prisma/schema.prisma
model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

model Post {
  // ... existing fields
  category   Category? @relation(fields: [categoryId], references: [id])
  categoryId Int?
}
```

2. **Generate dan Migrate:**
```bash
npx prisma migrate dev --name add_categories
```

3. **Create Routes:**
```javascript
// routes/categories.js
const prisma = require("../lib/prisma");

async function categoryRoutes(fastify, options) {
  fastify.get("/categories", async (request, reply) => {
    const categories = await prisma.category.findMany({
      include: { posts: true }
    });
    return { data: categories };
  });

  // Add more CRUD operations...
}

module.exports = categoryRoutes;
```

4. **Register Routes:**
```javascript
// server.js
fastify.register(require("./routes/categories"), { prefix: "/api" });
```

### Menambah Middleware

```javascript
// server.js
fastify.addHook('preHandler', async (request, reply) => {
  // Authentication middleware
  const token = request.headers.authorization;
  if (!token && request.url.startsWith('/api/protected')) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Rate limiting
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});
```

### Environment-Specific Configuration

```javascript
// lib/config.js
const config = {
  development: {
    logLevel: 'debug',
    cors: { origin: '*' }
  },
  staging: {
    logLevel: 'info',
    cors: { origin: ['https://staging.example.com'] }
  },
  production: {
    logLevel: 'warn',
    cors: { origin: ['https://example.com'] }
  }
};

module.exports = config[process.env.NODE_ENV] || config.development;
```

### Custom Validation

```javascript
// routes/users.js
const userSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { 
      type: 'string', 
      format: 'email',
      minLength: 5,
      maxLength: 100
    },
    name: { 
      type: 'string',
      minLength: 2,
      maxLength: 50,
      pattern: '^[a-zA-Z\\s]+$'
    }
  }
};

fastify.post('/users', { schema: { body: userSchema } }, handler);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:**
```
Error: P1001: Can't reach database server
```

**Solutions:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists
- Check network connectivity

**Debug Steps:**
```bash
# Test database connection
npx prisma db push --preview-feature

# Check Docker containers
docker ps

# View database logs
docker-compose logs postgres
```

#### 2. Prisma Client Error

**Error:**
```
Error: Prisma Client is not configured
```

**Solutions:**
```bash
# Regenerate Prisma Client
npm run db:generate

# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE :::3000
```

**Solutions:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 4. Docker Build Fails

**Error:**
```
Error: Docker build failed
```

**Solutions:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build -f Dockerfile.dev .
```

#### 5. Migration Fails

**Error:**
```
Error: Migration failed to apply
```

**Solutions:**
```bash
# Reset database (development only)
npx prisma migrate reset

# Force migration
npx prisma db push --force-reset

# Check migration status
npx prisma migrate status
```

### Debug Mode

#### Application Debugging

```bash
# Enable debug logging
DEBUG=* npm run dev

# Prisma query debugging
DATABASE_URL="..." npx prisma studio
```

#### Docker Debugging

```bash
# View container logs
docker-compose logs -f app

# Execute commands in container
docker-compose exec app sh

# Inspect container
docker inspect <container_id>
```

#### PM2 Debugging

```bash
# View PM2 status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart application
pm2 restart fastify-app
```

### Performance Monitoring

#### Application Metrics

```javascript
// Add to server.js
fastify.register(require('fastify-metrics'), {
  endpoint: '/metrics'
});
```

#### Database Monitoring

```bash
# Prisma query analysis
npx prisma studio

# Database performance
EXPLAIN ANALYZE SELECT * FROM users;
```

#### Container Monitoring

```bash
# Resource usage
docker stats

# Container health
docker-compose ps
```

## 📖 Resources dan References

### Official Documentation

- [Fastify Documentation](https://www.fastify.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### Tutorials dan Guides

- [Fastify Getting Started](https://www.fastify.io/docs/latest/Guides/Getting-Started/)
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/usage/process-management/)

### Best Practices

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [API Design Guidelines](https://github.com/microsoft/api-guidelines)
- [Database Design Patterns](https://www.prisma.io/docs/concepts/components/prisma-schema)

## 🤝 Contributing

### Development Workflow

1. **Fork** repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Create** Pull Request

### Code Standards

- Use **ESLint** untuk code linting
- Follow **Prettier** untuk code formatting
- Write **JSDoc** comments untuk functions
- Add **tests** untuk new features
- Update **documentation** untuk changes

### Testing Guidelines

```bash
# Run linting
npm run lint

# Run tests
npm test

# Run coverage
npm run coverage
```

## 📄 License

Proyek ini menggunakan **MIT License**. Lihat file `LICENSE` untuk detail lengkap.

## 👥 Authors

- **Manus AI** - Boilerplate dan dokumentasi awal
- **Contributors** - Lihat [Contributors](https://github.com/your-repo/contributors)

## 🙏 Acknowledgments

- Tim **Fastify** untuk framework yang luar biasa
- Tim **Prisma** untuk ORM yang modern dan powerful
- Komunitas **Node.js** dan **PostgreSQL**
- **Docker** team untuk containerization technology
- **PM2** team untuk process management solution

---

## 🎯 Next Steps

Setelah setup boilerplate ini, Anda dapat:

1. **Customize** schema database sesuai kebutuhan
2. **Add** authentication dan authorization
3. **Implement** business logic spesifik
4. **Setup** monitoring dan logging
5. **Deploy** ke production environment
6. **Scale** aplikasi sesuai traffic

**Happy Coding! 🚀**

---

*Boilerplate ini dirancang untuk memberikan foundation yang solid untuk proyek Node.js modern dengan best practices dan production-ready configuration.*

