FROM node:current-alpine

LABEL org.opencontainers.image.source="https://github.com/endworks/app-link"
LABEL org.opencontainers.image.description="Express server that redirects users to Play Store or App Store based on device"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="app-link"
LABEL org.opencontainers.image.vendor="endworks"

WORKDIR /app

COPY package.json ./
RUN yarn install --production && \
    if [ -f yarn.lock ]; then true; else echo "Warning: yarn.lock not found"; fi

COPY server.js ./

EXPOSE 3000

USER node

CMD ["node", "server.js"]
