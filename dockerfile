# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy Prisma schema and generate the client
COPY prisma ./prisma


# Copy the rest of the application code
COPY . .

RUN yarn prisma generate

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["yarn", "dev"]
