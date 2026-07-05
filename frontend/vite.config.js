import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any request to /api/* is forwarded to the backend in dev
      "/api": "http://localhost:5000",
    },
  },
});