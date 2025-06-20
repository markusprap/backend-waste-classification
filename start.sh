# Render Deploy Script  
# This runs the database migration and starts the server

npx prisma migrate deploy --schema=database/prisma/schema.prisma
npm start
