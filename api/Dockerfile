# Use the official Node.js 18 image as the base
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock or package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of your app's code
COPY . .

# Build the app (compiles TypeScript to JavaScript)
RUN yarn run build

# Expose the port your app runs on
EXPOSE 4000

# Command to start your app
CMD ["yarn", "start"]
