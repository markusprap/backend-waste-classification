#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const sampleWasteBanks = [
  {
    nama: "Bank Sampah Melati Jakarta Selatan",
    alamat: "Jl. Mampang Prapatan No. 123, Jakarta Selatan",
    latitude: -6.241586,
    longitude: 106.794964,
    telepon: "021-12345678",
    email: "info@banksampahmelati.com",
    jamOperasi: "Senin-Jumat 08:00-16:00",
    jenisWaste: "plastik,kertas,logam,kaca",
    deskripsi: "Bank sampah yang melayani wilayah Jakarta Selatan dengan fokus pada daur ulang plastik dan kertas"
  },
  {
    nama: "Bank Sampah Bersih Jakarta Pusat", 
    alamat: "Jl. Sudirman No. 456, Jakarta Pusat",
    latitude: -6.208763,
    longitude: 106.845599,
    telepon: "021-87654321",
    email: "contact@banksampahbersih.com", 
    jamOperasi: "Senin-Sabtu 07:00-17:00",
    jenisWaste: "plastik,kertas,elektronik",
    deskripsi: "Bank sampah modern dengan teknologi digital untuk tracking sampah"
  },
  {
    nama: "Bank Sampah Hijau Jakarta Timur",
    alamat: "Jl. Jatinegara Raya No. 789, Jakarta Timur", 
    latitude: -6.215917,
    longitude: 106.870813,
    telepon: "021-11223344",
    email: "info@banksampah-hijau.com",
    jamOperasi: "Senin-Jumat 08:30-16:30",
    jenisWaste: "organik,plastik,kertas",
    deskripsi: "Spesialis pengolahan sampah organik menjadi kompos berkualitas"
  },
  {
    nama: "Bank Sampah Mandiri Jakarta Barat",
    alamat: "Jl. Grogol Petamburan No. 321, Jakarta Barat",
    latitude: -6.170038,
    longitude: 106.789757,
    telepon: "021-55667788", 
    email: "mandiri@banksampahjakbar.com",
    jamOperasi: "Selasa-Sabtu 09:00-15:00",
    jenisWaste: "plastik,logam,kaca,kertas",
    deskripsi: "Bank sampah dengan program edukasi lingkungan untuk masyarakat"
  },
  {
    nama: "Bank Sampah Sejahtera Jakarta Utara",
    alamat: "Jl. Pantai Indah Kapuk No. 654, Jakarta Utara",
    latitude: -6.118233,
    longitude: 106.740629,
    telepon: "021-99887766",
    email: "sejahtera@banksampahutara.com", 
    jamOperasi: "Senin-Jumat 08:00-17:00, Sabtu 08:00-12:00",
    jenisWaste: "plastik,kertas,logam,tekstil",
    deskripsi: "Bank sampah terbesar di Jakarta Utara dengan fasilitas lengkap"
  },
  {
    nama: "Bank Sampah Eco Center Tangerang",
    alamat: "Jl. BSD Raya No. 888, Tangerang Selatan",
    latitude: -6.301934,
    longitude: 106.664125,
    telepon: "021-33445566",
    email: "eco@banksampah-tangerang.com",
    jamOperasi: "Senin-Sabtu 07:30-16:30", 
    jenisWaste: "plastik,kertas,elektronik,logam",
    deskripsi: "Bank sampah modern dengan teknologi AI untuk sortir otomatis"
  },
  {
    nama: "Bank Sampah Lestari Bekasi",
    alamat: "Jl. Ahmad Yani No. 777, Bekasi",
    latitude: -6.238270,
    longitude: 107.001979,
    telepon: "021-22334455",
    email: "lestari@banksampahbekasi.com",
    jamOperasi: "Senin-Jumat 08:00-16:00",
    jenisWaste: "organik,plastik,kertas,kaca",
    deskripsi: "Bank sampah dengan fokus pada ekonomi sirkular dan pemberdayaan masyarakat"
  },
  {
    nama: "Bank Sampah Digital Depok",
    alamat: "Jl. Margonda Raya No. 999, Depok", 
    latitude: -6.402484,
    longitude: 106.794243,
    telepon: "021-77889900",
    email: "digital@banksampah-depok.com",
    jamOperasi: "Senin-Sabtu 08:00-17:00",
    jenisWaste: "elektronik,plastik,logam,kertas",
    deskripsi: "Bank sampah berbasis teknologi digital dengan aplikasi mobile"
  }
];

const sampleArticles = [
  {
    title: "Cara Mudah Memilah Sampah di Rumah",
    slug: "cara-mudah-memilah-sampah-di-rumah",
    content: "Memilah sampah adalah langkah pertama dalam pengelolaan sampah yang baik. Berikut adalah panduan lengkap cara memilah sampah di rumah...",
    excerpt: "Pelajari cara praktis memilah sampah organik dan anorganik untuk lingkungan yang lebih bersih",
    category: "recycling",
    tags: "pemilahan,sampah,rumah,lingkungan",
    readTime: 5
  },
  {
    title: "Manfaat Bank Sampah untuk Ekonomi Keluarga",
    slug: "manfaat-bank-sampah-untuk-ekonomi-keluarga", 
    content: "Bank sampah tidak hanya membantu lingkungan, tetapi juga bisa menjadi sumber penghasilan tambahan untuk keluarga...",
    excerpt: "Temukan bagaimana bank sampah dapat meningkatkan pendapatan keluarga sambil menjaga lingkungan",
    category: "zero-waste",
    tags: "bank-sampah,ekonomi,keluarga,penghasilan",
    readTime: 7
  },
  {
    title: "Teknologi AI dalam Klasifikasi Sampah",
    slug: "teknologi-ai-dalam-klasifikasi-sampah",
    content: "Kecerdasan buatan (AI) kini digunakan untuk membantu klasifikasi sampah secara otomatis dan akurat...",
    excerpt: "Jelajahi bagaimana teknologi AI dapat membantu mengklasifikasikan jenis sampah dengan cepat dan tepat",
    category: "technology",
    tags: "AI,teknologi,klasifikasi,otomatis",
    readTime: 8
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Seed Waste Banks
    console.log('📍 Seeding waste banks...');
    for (const wasteBank of sampleWasteBanks) {
      await prisma.wasteBank.create({
        data: wasteBank
      });
      console.log(`✅ Created: ${wasteBank.nama}`);
    }
    
    // Seed Articles
    console.log('📰 Seeding articles...');
    for (const article of sampleArticles) {
      await prisma.article.create({
        data: article
      });
      console.log(`✅ Created: ${article.title}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${sampleWasteBanks.length} waste banks and ${sampleArticles.length} articles`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
