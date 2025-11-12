FROM node:22-alpine
WORKDIR /app
# Copy package files with appropriate ownership and permissions
COPY --chown=1001:1001 --chmod=644 package*.json ./

RUN npm ci && npm cache clean --force
 
# Copy application files with appropriate ownership (see .dockerignore for exclusions)
COPY --chown=1001:1001 --chmod=755 . .

# Build the application
RUN npm run build

# Switch to non-root user for security
USER 1001:1001

# Expose the port
EXPOSE 3000
 
# Start the application
CMD ["npm", "start"]