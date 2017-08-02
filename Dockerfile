# Base image
FROM node:8.2.1-alpine AS base

WORKDIR /app
COPY package.json .

# Dependencies (Production and Development)
FROM base AS dependencies
COPY server server
RUN NODE_ENV=production npm install --no-progress \
  && cp -a node_modules node_modules_production \
  && npm install \
  && ./node_modules/.bin/babel --out-dir server-compiled/ server/

# Final release image
FROM base AS release
COPY --from=dependencies /app/node_modules_production node_modules
COPY --from=dependencies /app/server-compiled server-compiled

EXPOSE 5000
ENTRYPOINT ["node", "server-compiled"]