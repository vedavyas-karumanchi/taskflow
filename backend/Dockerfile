# Small official base image: Debian-slim + Node 20
FROM node:20-slim

# Everything below happens inside /app in the image
WORKDIR /app

# 1) Copy ONLY the dependency manifests first…
COPY package*.json ./

# 2) …install deps. This layer is cached until package.json changes.
#    "npm ci" installs exactly what package-lock.json specifies —
#    reproducible builds, which is why CI systems use it over "npm install".
RUN npm ci --omit=dev

# 3) Now copy the source (changes often; cheap layer)
COPY src ./src

# Run as a non-root user — a security baseline in real deployments
USER node

# Documentation for humans/tools; doesn't actually open the port
EXPOSE 5000

CMD ["node", "src/index.js"]