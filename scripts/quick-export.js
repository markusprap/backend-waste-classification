#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function quickExportSQLite() {
  try {
    console.log('📤 Quick export using manual schema switch...');
    
    // Backup current schema
    const schemaPath = path.join(__dirname, '..', 'database', 'prisma', 'schema.prisma');
    const currentSchema = fs.readFileSync(schemaPath, 'utf8');
    
    // Create temporary SQLite schema
    const sqliteSchema = currentSchema.replace(
      'provider = "postgresql"',
      'provider = "sqlite"'
    ).replace(
      'url      = env("DATABASE_URL")',
      'url      = "file:./dev.db"'
    );
    
    // Write temporary schema
    fs.writeFileSync(schemaPath, sqliteSchema);
    console.log('📝 Temporary SQLite schema written');
    
    // Generate SQLite client
    const { execSync } = require('child_process');
    execSync('npx prisma generate --schema=database/prisma/schema.prisma', { stdio: 'inherit' });
    
    // Now we can export data
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('🏪 Exporting waste banks...');
    const wasteBanks = await prisma.wasteBank.findMany();
    
    console.log('📰 Exporting articles...');
    const articles = await prisma.article.findMany();
    
    console.log('👤 Exporting users...');
    const users = await prisma.user.findMany();
    
    console.log('🗂️ Exporting classifications...');
    const classifications = await prisma.classification.findMany();
    
    console.log('💳 Exporting subscriptions...');
    const subscriptions = await prisma.subscription.findMany();
    
    const exportedData = {
      wasteBanks,
      articles,
      users,
      classifications,
      subscriptions,
      exportDate: new Date().toISOString()
    };
    
    // Save export data
    const exportFile = `exported-data-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(exportFile, JSON.stringify(exportedData, null, 2));
    console.log(`💾 Data exported to: ${exportFile}`);
    
    // Cleanup
    await prisma.$disconnect();
    
    // Restore PostgreSQL schema
    fs.writeFileSync(schemaPath, currentSchema);
    console.log('🔄 PostgreSQL schema restored');
    
    // Regenerate PostgreSQL client
    execSync('npx prisma generate --schema=database/prisma/schema.prisma', { stdio: 'inherit' });
    console.log('✅ PostgreSQL client regenerated');
    
    return exportedData;
    
  } catch (error) {
    console.error('❌ Error in quick export:', error);
    
    // Restore schema on error
    try {
      const schemaPath = path.join(__dirname, '..', 'database', 'prisma', 'schema.prisma');
      const postgresqlSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NextAuth.js required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  name                  String?
  image                 String?
  emailVerified         DateTime?
  plan                  String    @default("free") // 'free', 'premium', 'corporate'
  usageCount            Int       @default(0)
  usageLimit            Int       @default(100)
  lastUsageReset        DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  accounts              Account[]
  sessions              Session[]
  classifications       Classification[]
  subscriptions         Subscription[]
  
  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Classification {
  id          String   @id @default(cuid())
  userId      String?
  imageUrl    String?
  result      String   // JSON string of classification result
  confidence  Float?
  wasteType   String?
  category    String?
  location    String?  // JSON string for location data
  source      String   @default("web") // web, mobile, api
  createdAt   DateTime @default(now())
  
  // Relations
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@map("classifications")
}

model Subscription {
  id           String   @id @default(cuid())
  userId       String
  plan         String   // free, premium, corporate
  status       String   @default("active") // active, inactive, cancelled
  startDate    DateTime @default(now())
  endDate      DateTime?
  amount       Float?   @default(10000) // Default 10000 IDR for premium
  currency     String   @default("IDR")
  paymentId    String?  // Order ID from payment gateway
  paymentStatus String? // success, pending, failed
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // Relations
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("subscriptions")
}

model WasteBank {
  id          String   @id @default(cuid())
  nama        String
  alamat      String
  latitude    Float
  longitude   Float
  telepon     String?
  email       String?
  jamOperasi  String?
  jenisWaste  String?
  deskripsi   String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("waste_banks")
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   // Full article content
  excerpt     String   // Short description for preview
  coverImage  String?  // Cover image filename
  category    String   // 'recycling', 'composting', 'plastic', 'zero-waste', etc
  tags        String   // Comma-separated tags
  author      String   @default("Tim EcoWaste")
  readTime    Int?     // Estimated reading time in minutes
  viewCount   Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("articles")
}`;
      
      fs.writeFileSync(schemaPath, postgresqlSchema);
      console.log('🔄 Schema restored to PostgreSQL');
    } catch (restoreError) {
      console.error('❌ Failed to restore schema:', restoreError);
    }
    
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  quickExportSQLite();
}

module.exports = { quickExportSQLite };
