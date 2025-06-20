#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importFromExport() {
  try {
    console.log('📥 Starting import from exported data...');
    
    // Read exported data
    const data = JSON.parse(fs.readFileSync('exported-data-2025-06-20.json', 'utf8'));
    
    console.log('📊 Data summary:');
    console.log(`- Waste Banks: ${data.wasteBanks?.length || 0}`);
    console.log(`- Articles: ${data.articles?.length || 0}`);
    console.log(`- Users: ${data.users?.length || 0}`);
    console.log(`- Classifications: ${data.classifications?.length || 0}`);
    console.log(`- Subscriptions: ${data.subscriptions?.length || 0}`);
    
    // Clear existing data first (optional)
    console.log('🧹 Clearing existing data...');
    await prisma.classification.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.article.deleteMany();
    await prisma.wasteBank.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    
    // Import Users first
    if (data.users && data.users.length > 0) {
      console.log(`👤 Importing ${data.users.length} users...`);
      let userCount = 0;
      for (const user of data.users) {
        try {
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
              plan: user.plan || 'free',
              usageCount: user.usageCount || 0,
              usageLimit: user.usageLimit || 100,
              lastUsageReset: user.lastUsageReset ? new Date(user.lastUsageReset) : null,
              createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
              updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
            }
          });
          userCount++;
        } catch (err) {
          console.log(`⚠️ Skipped user ${user.email}: already exists or invalid data`);
        }
      }
      console.log(`✅ Imported ${userCount} users`);
    }
    
    // Import Waste Banks
    if (data.wasteBanks && data.wasteBanks.length > 0) {
      console.log(`🏪 Importing ${data.wasteBanks.length} waste banks...`);
      let bankCount = 0;
      for (const wasteBank of data.wasteBanks) {
        try {
          await prisma.wasteBank.create({
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
              isActive: wasteBank.isActive !== false,
              createdAt: wasteBank.createdAt ? new Date(wasteBank.createdAt) : new Date(),
              updatedAt: wasteBank.updatedAt ? new Date(wasteBank.updatedAt) : new Date()
            }
          });
          bankCount++;
        } catch (err) {
          console.log(`⚠️ Skipped waste bank ${wasteBank.nama}: ${err.message}`);
        }
      }
      console.log(`✅ Imported ${bankCount} waste banks`);
    }
    
    // Import Articles
    if (data.articles && data.articles.length > 0) {
      console.log(`📰 Importing ${data.articles.length} articles...`);
      let articleCount = 0;
      for (const article of data.articles) {
        try {
          await prisma.article.create({
            data: {
              id: article.id,
              title: article.title,
              slug: article.slug,
              content: article.content,
              excerpt: article.excerpt,
              coverImage: article.coverImage,
              category: article.category,
              tags: article.tags,
              author: article.author || 'Tim EcoWaste',
              readTime: article.readTime,
              viewCount: article.viewCount || 0,
              isPublished: article.isPublished !== false,
              createdAt: article.createdAt ? new Date(article.createdAt) : new Date(),
              updatedAt: article.updatedAt ? new Date(article.updatedAt) : new Date()
            }
          });
          articleCount++;
        } catch (err) {
          console.log(`⚠️ Skipped article ${article.title}: ${err.message}`);
        }
      }
      console.log(`✅ Imported ${articleCount} articles`);
    }
    
    // Import Classifications
    if (data.classifications && data.classifications.length > 0) {
      console.log(`🗂️ Importing ${data.classifications.length} classifications...`);
      let classificationCount = 0;
      for (const classification of data.classifications) {
        try {
          await prisma.classification.create({
            data: {
              id: classification.id,
              userId: classification.userId,
              imageUrl: classification.imageUrl,
              result: classification.result,
              confidence: classification.confidence,
              wasteType: classification.wasteType,
              category: classification.category,
              location: classification.location,
              source: classification.source || 'web',
              createdAt: classification.createdAt ? new Date(classification.createdAt) : new Date()
            }
          });
          classificationCount++;
        } catch (err) {
          console.log(`⚠️ Skipped classification ${classification.id}: ${err.message}`);
        }
      }
      console.log(`✅ Imported ${classificationCount} classifications`);
    }
    
    // Import Subscriptions
    if (data.subscriptions && data.subscriptions.length > 0) {
      console.log(`💳 Importing ${data.subscriptions.length} subscriptions...`);
      let subscriptionCount = 0;
      for (const subscription of data.subscriptions) {
        try {
          await prisma.subscription.create({
            data: {
              id: subscription.id,
              userId: subscription.userId,
              plan: subscription.plan,
              status: subscription.status || 'active',
              startDate: subscription.startDate ? new Date(subscription.startDate) : new Date(),
              endDate: subscription.endDate ? new Date(subscription.endDate) : null,
              amount: subscription.amount,
              currency: subscription.currency || 'IDR',
              paymentId: subscription.paymentId,
              paymentStatus: subscription.paymentStatus,
              createdAt: subscription.createdAt ? new Date(subscription.createdAt) : new Date(),
              updatedAt: subscription.updatedAt ? new Date(subscription.updatedAt) : new Date()
            }
          });
          subscriptionCount++;
        } catch (err) {
          console.log(`⚠️ Skipped subscription ${subscription.id}: ${err.message}`);
        }
      }
      console.log(`✅ Imported ${subscriptionCount} subscriptions`);
    }
    
    console.log('🎉 Data import completed successfully!');
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  importFromExport();
}

module.exports = { importFromExport };
