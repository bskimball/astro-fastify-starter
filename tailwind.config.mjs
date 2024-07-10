import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    // "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "'./node_modules/@nextui-org/theme/dist/components/(button|).js'",
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
