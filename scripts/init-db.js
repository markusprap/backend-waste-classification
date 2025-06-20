#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function initializeDatabase() {
    const prisma = new PrismaClient();
    
    try {
        console.log('Initializing database...');
        
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        
        // You can add any initial data seeding here if needed
        console.log('✅ Database initialization complete');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase };
