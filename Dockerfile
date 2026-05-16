# Backend API + Playwright runner
FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install Chrome browser (needed for channel: 'chrome' in playwright.config.ts)
RUN npx playwright install chrome

# Copy project files
COPY . .

EXPOSE 3000

CMD ["npx", "ts-node", "server/index.ts"]
