import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [vue(),
    Components({
        dts: fileURLToPath(new URL('./src/components.d.ts', import.meta.url)),
        resolvers: [AntDesignVueResolver({ importStyle: false })],
      }),
  ],
})
