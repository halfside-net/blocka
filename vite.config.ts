import viteImagemin from "@vheemstra/vite-plugin-imagemin";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import imageminGifsicle from "imagemin-gifsicle";
import imageminJpegExifRotate from "imagemin-jpeg-exif-rotate";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminSvgo from "imagemin-svgo";
import imageminZopfli from "imagemin-zopfli";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import { description, themeColor, title, titleShort } from "./siteconfig.json";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    imagetools(),
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: { disabled: true },

      manifest: {
        background_color: themeColor,
        description,
        display: "standalone",
        icons: [
          {
            sizes: "72x72",
            src: "/icon_72.png",
            type: "image/png",
          },
          {
            sizes: "96x96",
            src: "/icon_96.png",
            type: "image/png",
          },
          {
            sizes: "120x120",
            src: "/icon_120.png",
            type: "image/png",
          },
          {
            sizes: "128x128",
            src: "/icon_128.png",
            type: "image/png",
          },
          {
            sizes: "144x144",
            src: "/icon_144.png",
            type: "image/png",
          },
          {
            sizes: "152x152",
            src: "/icon_152.png",
            type: "image/png",
          },
          {
            sizes: "180x180",
            src: "/icon_180.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "/icon_192.png",
            type: "image/png",
          },
          {
            sizes: "384x384",
            src: "/icon_384.png",
            type: "image/png",
          },
          {
            sizes: "512x512",
            src: "/icon_512.png",
            type: "image/png",
          },
        ],
        launch_handler: {
          client_mode: "focus-existing",
        },
        name: title,
        short_name: titleShort,
        theme_color: themeColor,
      },

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
    svgr(),
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
  ],
});
