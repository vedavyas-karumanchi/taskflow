# ---------- Stage 1: build the static files ----------
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build          # output lands in /app/dist

# ---------- Stage 2: serve them with nginx ----------
FROM nginx:1.27-alpine
# our routing config (below) replaces the default
COPY nginx.conf /etc/nginx/conf.d/default.conf
# only the built static files cross over; node_modules stays behind
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]