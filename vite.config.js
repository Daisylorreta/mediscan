import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api calls to the Node server so the browser never needs its address.
    proxy: { "/api": "http://localhost:3001" },
  },
});
