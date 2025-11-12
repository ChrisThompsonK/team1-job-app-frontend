FROM node:22-alpine
WORKDIR /app
# Copy package files
COPY package*.json ./
USER 1001:1001
RUN npm ci && npm cache clean --force
 
# Copy essential application files
COPY . .

# Expose the port
EXPOSE 3000
 
# Start the application
CMD ["npm", "start"]