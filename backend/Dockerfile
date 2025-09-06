FROM node:lts

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y curl

# Install dotenvx
RUN curl -sfS https://dotenvx.sh/install.sh | sh

COPY . .

# Run prebuild check
RUN dotenvx ext prebuild

EXPOSE 5000
CMD ["node", "index.js"]