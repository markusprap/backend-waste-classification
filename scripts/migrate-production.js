#!/usr/bin/env node

const { execSync } = require('child_process');
require('dotenv').config();

async function runMigration() {
    try {
        console.log('🔄 Starting database migration...');
        
        // Check if DATABASE_URL is set
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not set');
        }
        
        console.log('📍 Database URL configured');
        
        // Generate Prisma client
        console.log('🔨 Generating Prisma client...');
        execSync('npx prisma generate', { stdio: 'inherit' });
        
        // Run migrations
        console.log('🚀 Running database migrations...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        
        console.log('✅ Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runMigration();
}

module.exports = { runMigration };
