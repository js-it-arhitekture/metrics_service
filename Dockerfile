# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the rest of your application code into the container
COPY . .

# Expose the port your Express app runs on
EXPOSE 8085

# Command to run your application
CMD ["node", "index.js"]
