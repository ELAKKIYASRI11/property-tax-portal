# Multi-stage Docker build for Property Tax Portal
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci || npm install
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && (npm ci --only=production || npm install --production)

# Copy server code
COPY server/ ./server/

# Copy built frontend assets from client-builder stage
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port
EXPOSE 5000

# Start server
WORKDIR /app/server
CMD ["node", "server.js"]
