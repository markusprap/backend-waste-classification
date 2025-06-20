#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Connect to SQLite database (old)
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./database/prisma/dev.db'
    }
  }
});

// Connect to PostgreSQL database (new)
const postgresqlPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function exportData() {
  try {
    console.log('📤 Starting data export from SQLite...');
    
    // Export Waste Banks
    console.log('🏪 Exporting waste banks...');
    const wasteBanks = await sqlitePrisma.wasteBank.findMany();
    console.log(`📊 Found ${wasteBanks.length} waste banks`);
    
    // Export Articles  
    console.log('📰 Exporting articles...');
    const articles = await sqlitePrisma.article.findMany();
    console.log(`📊 Found ${articles.length} articles`);
    
    // Export Users
    console.log('👤 Exporting users...');
    const users = await sqlitePrisma.user.findMany();
    console.log(`📊 Found ${users.length} users`);
    
    // Export Classifications
    console.log('🗂️ Exporting classifications...');
    const classifications = await sqlitePrisma.classification.findMany();
    console.log(`📊 Found ${classifications.length} classifications`);
    
    // Export Subscriptions
    console.log('💳 Exporting subscriptions...');
    const subscriptions = await sqlitePrisma.subscription.findMany();
    console.log(`📊 Found ${subscriptions.length} subscriptions`);
    
    const exportedData = {
      wasteBanks,
      articles,
      users,
      classifications,
      subscriptions,
      exportDate: new Date().toISOString()
    };
    
    // Save to JSON file
    const fileName = `data-export-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(fileName, JSON.stringify(exportedData, null, 2));
    console.log(`💾 Data exported to: ${fileName}`);
    
    return exportedData;
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
  }
}

async function importData(data) {
  try {
    console.log('📥 Starting data import to PostgreSQL...');
    
    // Import Users first (referenced by other tables)
    if (data.users && data.users.length > 0) {
      console.log(`👤 Importing ${data.users.length} users...`);
      for (const user of data.users) {
        try {
          await postgresqlPrisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
              plan: user.plan,
              usageCount: user.usageCount,
              usageLimit: user.usageLimit,
              lastUsageReset: user.lastUsageReset ? new Date(user.lastUsageReset) : null,
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt)
            }
          });
          console.log(`✅ Imported user: ${user.email}`);
        } catch (err) {
          console.log(`⚠️ Skipped user ${user.email}: ${err.message}`);
        }
      }
    }
    
    // Import Waste Banks
    if (data.wasteBanks && data.wasteBanks.length > 0) {
      console.log(`🏪 Importing ${data.wasteBanks.length} waste banks...`);
      for (const wasteBank of data.wasteBanks) {
        try {
          await postgresqlPrisma.wasteBank.create({
            data: {
              id: wasteBank.id,
              nama: wasteBank.nama,
              alamat: wasteBank.alamat,
              latitude: wasteBank.latitude,
              longitude: wasteBank.longitude,
              telepon: wasteBank.telepon,
              email: wasteBank.email,
              jamOperasi: wasteBank.jamOperasi,
              jenisWaste: wasteBank.jenisWaste,
              deskripsi: wasteBank.deskripsi,
              isActive: wasteBank.isActive,
              createdAt: new Date(wasteBank.createdAt),
              updatedAt: new Date(wasteBank.updatedAt)
            }
          });
          console.log(`✅ Imported waste bank: ${wasteBank.nama}`);
        } catch (err) {
          console.log(`⚠️ Skipped waste bank ${wasteBank.nama}: ${err.message}`);
        }
      }
    }
    
    // Import Articles
    if (data.articles && data.articles.length > 0) {
      console.log(`📰 Importing ${data.articles.length} articles...`);
      for (const article of data.articles) {
        try {
          await postgresqlPrisma.article.create({
            data: {
              id: article.id,
              title: article.title,
              slug: article.slug,
              content: article.content,
              excerpt: article.excerpt,
              coverImage: article.coverImage,
              category: article.category,
              tags: article.tags,
              author: article.author,
              readTime: article.readTime,
              viewCount: article.viewCount,
              isPublished: article.isPublished,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt)
            }
          });
          console.log(`✅ Imported article: ${article.title}`);
        } catch (err) {
          console.log(`⚠️ Skipped article ${article.title}: ${err.message}`);
        }
      }
    }
    
    // Import Classifications
    if (data.classifications && data.classifications.length > 0) {
      console.log(`🗂️ Importing ${data.classifications.length} classifications...`);
      for (const classification of data.classifications) {
        try {
          await postgresqlPrisma.classification.create({
            data: {
              id: classification.id,
              userId: classification.userId,
              imageUrl: classification.imageUrl,
              result: classification.result,
              confidence: classification.confidence,
              wasteType: classification.wasteType,
              category: classification.category,
              location: classification.location,
              source: classification.source,
              createdAt: new Date(classification.createdAt)
            }
          });
          console.log(`✅ Imported classification: ${classification.id}`);
        } catch (err) {
          console.log(`⚠️ Skipped classification ${classification.id}: ${err.message}`);
        }
      }
    }
    
    // Import Subscriptions
    if (data.subscriptions && data.subscriptions.length > 0) {
      console.log(`💳 Importing ${data.subscriptions.length} subscriptions...`);
      for (const subscription of data.subscriptions) {
        try {
          await postgresqlPrisma.subscription.create({
            data: {
              id: subscription.id,
              userId: subscription.userId,
              plan: subscription.plan,
              status: subscription.status,
              startDate: new Date(subscription.startDate),
              endDate: subscription.endDate ? new Date(subscription.endDate) : null,
              amount: subscription.amount,
              currency: subscription.currency,
              paymentId: subscription.paymentId,
              paymentStatus: subscription.paymentStatus,
              createdAt: new Date(subscription.createdAt),
              updatedAt: new Date(subscription.updatedAt)
            }
          });
          console.log(`✅ Imported subscription: ${subscription.id}`);
        } catch (err) {
          console.log(`⚠️ Skipped subscription ${subscription.id}: ${err.message}`);
        }
      }
    }
    
    console.log('🎉 Data migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  } finally {
    await postgresqlPrisma.$disconnect();
  }
}

async function migrateData() {
  try {
    // Export from SQLite
    const data = await exportData();
    
    // Import to PostgreSQL 
    await importData(data);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  migrateData();
}

module.exports = { exportData, importData, migrateData };
