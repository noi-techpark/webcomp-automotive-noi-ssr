FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

# Copy package.json and package-lock.json
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node package.json ./

USER node

# Install dependencies
RUN yarn install

# Copy TypeScript files
COPY --chown=node:node . .

RUN yarn generate

ENV HOST=0.0.0.0

# Expose the port your app will run on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start"]
