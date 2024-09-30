# Use Node.js to build the frontend
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend app
RUN npm run build

# Use nginx to serve the frontend files
FROM nginx:alpine

# Copy the build files to the nginx html folder
COPY --from=build /usr/src/app/dist /usr/share/nginx/html  

# Expose port 80 to serve the frontend
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
