# Use the official Node.js runtime as a base image
FROM node:14

# Set the working directory for the app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the port that the app listens on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
