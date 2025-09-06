FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    chromium \
    fontconfig \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
run dotenvx ext prebuild
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]