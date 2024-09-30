# Use Node.js as base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app 

# Copy package.json and package-lock.json
COPY package*.json ./

# Install build tools
RUN apt-get update && apt-get install -y python3 build-essential && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN npm install

# Rebuild native modules like node-pty
RUN npm rebuild node-pty --build-from-source

# Copy the rest of your application
COPY . .

# Build your app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the backend server
CMD ["node", "dist/index.js"]
