import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import imageminGifsicle from "imagemin-gifsicle";
import imageminJpegExifRotate from "imagemin-jpeg-exif-rotate";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminSvgo from "imagemin-svgo";
import imageminZopfli from "imagemin-zopfli";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import { sitePath } from "./siteconfig.json";

export default defineConfig({
  base: sitePath,
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    imagetools(),
    react(),
    svgr(),
    vike(),
    viteImagemin({
      plugins: {
        gif: imageminGifsicle({ optimizationLevel: 3 }),
        jpg: [imageminJpegExifRotate(), imageminMozjpeg({ quality: 100 })],
        png: imageminZopfli({ more: true, transparent: true }),
        svg: imageminSvgo({
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        }),
      },
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: { disabled: true },

      manifest: false,

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
