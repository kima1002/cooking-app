FROM node:18-alpine

WORKDIR /app

# Install MongoDB
RUN apk add --no-cache mongodb

# Create MongoDB data directory
RUN mkdir -p /data/db

# Copy application files
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Create startup script
RUN echo '#!/bin/sh\nmongod --dbpath /data/db --nojournal --bind_ip 127.0.0.1 --port 27017 --smallfiles --fork\nnpm run start:prod' > /app/start.sh

# Make startup script executable
RUN chmod +x /app/start.sh

# Start MongoDB and NestJS app
CMD ["/app/start.sh"]