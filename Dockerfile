FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build production
RUN npm run build

# Serve bản build (vite preview)
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host"]
