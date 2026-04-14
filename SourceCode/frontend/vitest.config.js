import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        include: ["src/**/*.test.{js,jsx}"],
        css: true,
    },
    esbuild: {
        loader: "jsx",
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
});
