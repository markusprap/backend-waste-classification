# Render Build Script
# This file tells Render how to build the application

npm install
npx prisma generate --schema=database/prisma/schema.prisma
