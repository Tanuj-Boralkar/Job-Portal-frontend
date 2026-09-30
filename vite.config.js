import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Both API calls and uploaded files go to the Express server
      "/api": {
        target: "https://job-portal-backend-sopc.onrender.com",
        changeOrigin: true,
      },
      "/uploads": {
        target: "https://job-portal-backend-sopc.onrender.com",
        changeOrigin: true,
      },
    },
  },
});