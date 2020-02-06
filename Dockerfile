# Base image
FROM node:10-alpine

RUN apk update

# Expose port
ENV PORT 8080
EXPOSE 8080

# Mk & Set working dir
WORKDIR /usr/src/app

# Copy package.json
COPY . .

# Install depends
RUN npm install && npm run build

# Default Command
CMD ["npm", "run", "start:prod"]




