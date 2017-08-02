# Base image
FROM node:8.2.1-alpine AS base

WORKDIR /app
COPY package.json .

# Dependencies (Production and Development)
FROM base AS dependencies
RUN NODE_ENV=production npm install --no-progress \
  && cp -a node_modules node_modules_production \
  && npm install

# Final release image
FROM base AS release
COPY --from=dependencies /app/node_modules_production node_modules
COPY server server

EXPOSE 5000
ENTRYPOINT ["node", "server"]