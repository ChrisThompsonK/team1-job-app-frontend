FROM node:22-alpine
WORKDIR /app
# Copy package files
COPY package*.json ./
RUN npm ci && npm cache clean --force
 
# Copy application files (see .dockerignore for exclusions)
COPY . .
 
# Build the application
RUN npm run build
 
# Switch to non-root user for security
USER 1001:1001
 
# Expose the port
EXPOSE 3000
 
# Start the application
CMD ["npm", "start"]