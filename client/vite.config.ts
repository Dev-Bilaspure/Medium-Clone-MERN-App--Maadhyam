import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    exclude: ["playwright"],
  },
  plugins: [react()],

  server: {
    port: 3001, // fixed port set for e2e testing
  },

  build: {
    chunkSizeWarningLimit: 5000,
  },
});
