FROM node:22-alpine
WORKDIR /app
# Copy package files
COPY package*.json ./
RUN npm ci && npm cache clean --force
USER 1001:1001
 
# Copy essential application files
COPY src ./src
COPY tsconfig.json .
COPY tailwind.config.js .
COPY public ./public
COPY views ./views
COPY locales ./locales
COPY .env.docker .env
 
# Expose the port
EXPOSE 3000
 
# Start the application
CMD ["npm", "run", "dev"]