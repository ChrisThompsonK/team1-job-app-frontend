FROM node:22-alpine
WORKDIR /app
# Copy package files with appropriate ownership and permissions
COPY --chown=1001:1001 package*.json ./

RUN npm ci && npm cache clean --force
 
# Copy application files with appropriate ownership (see .dockerignore for exclusions)
COPY --chown=1001:1001 . .

# Build the application
RUN npm run build

# Switch to non-root user for security
USER 1001:1001

# Expose the port
EXPOSE 3000

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
 
# Start the application
CMD ["npm", "start"]