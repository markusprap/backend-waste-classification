# Waste Classification Backend

Backend API for the Waste Classification webapp built with Hapi.js and Prisma.

## Features

- **Classification API**: Waste classification using ML services
- **Article Management**: CRUD operations for waste management articles
- **Payment Integration**: Midtrans payment gateway integration
- **Waste Bank Directory**: Location-based waste bank information
- **User Management**: User registration and authentication

## Tech Stack

- **Framework**: Hapi.js
- **Database**: PostgreSQL with Prisma ORM (SQLite for development)
- **File Upload**: Multer + Sharp for image processing
- **Payment**: Midtrans integration
- **ML Integration**: Connects to ML service API

## Database

### Production (PostgreSQL)
The application uses PostgreSQL for production deployment. The database connection is configured via `DATABASE_URL` environment variable.

### Development (SQLite)
For local development, you can use SQLite by setting:
```bash
DATABASE_URL="file:./dev.db"
```

### Migration Commands
```bash
# Development
npm run migrate              # Create and apply migration

# Production
npm run deploy              # Apply migrations in production
npm run migrate:deploy      # Alternative migration command
```

## API Endpoints

### Core
- `GET /` - Health check and API info
- `POST /api/classify` - Waste classification
- `GET /api/ml-service-status` - ML service status

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create article (admin)
- `GET /api/articles/:id` - Get specific article
- `PUT /api/articles/:id` - Update article (admin)
- `DELETE /api/articles/:id` - Delete article (admin)

### Waste Banks
- `GET /api/waste-banks` - Get waste bank locations
- `POST /api/waste-banks` - Add waste bank (admin)

### Payments
- `POST /api/payment/charge` - Create payment
- `POST /api/payment/notification` - Midtrans webhook

## Deployment

### Environment Variables Required

```bash
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public"

# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key

# Payment Gateway (Midtrans)
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_MERCHANT_ID=your-midtrans-merchant-id
MIDTRANS_ENV=sandbox

# External Services
FRONTEND_URL=https://your-frontend-app.vercel.app
ML_SERVICE_URL=https://your-ml-service.onrender.com
ML_SERVICE_TIMEOUT=30000
```

### Deploy to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Create Database**: 
   - Click "New Project" → "Provision PostgreSQL"
   - Copy the `DATABASE_URL` from the database service
3. **Deploy Backend**:
   - Add a new service → "Deploy from GitHub repo"
   - Select your backend repository
4. **Set Environment Variables**: Add all variables above in Railway dashboard
5. **Database Migration**: Railway will automatically run migrations during deployment

### Deploy to Render

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **Create PostgreSQL Database**:
   - New → "PostgreSQL"
   - Copy the connection string
3. **Deploy Web Service**:
   - New → "Web Service"
   - Connect GitHub and select this repository
4. **Settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run deploy && npm start`
5. **Environment Variables**: Add all variables above including `DATABASE_URL`

## Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your local settings

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## Production Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run build

# Run migrations and start
npm run deploy
npm start
```

## File Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── railway.json           # Railway deployment config
├── Dockerfile             # Docker configuration
├── database/
│   └── prisma/
│       └── schema.prisma  # Database schema
├── src/
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── routes/api/           # Additional API routes
├── scripts/              # Database and utility scripts
└── public/uploads/       # File uploads (development)
```

## Notes for Production

- SQLite database is suitable for small to medium applications
- For larger scale, consider PostgreSQL with DATABASE_URL
- File uploads in production should use cloud storage (AWS S3, Cloudinary)
- Ensure ML service is deployed and accessible
- Set proper CORS origins for security
