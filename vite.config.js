import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
const {
  uniPostcssPlugin
} = require('@dcloudio/uni-cli-shared')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni()
  ],
  css: {
    postcss: {
      plugins: [
        require('postcss-import')({
          resolve(id, basedir, importOptions) {
            if (id.startsWith('~@/')) {
              return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
            } else if (id.startsWith('@/')) {
              return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
            } else if (id.startsWith('/') && !id.startsWith('//')) {
              return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
            }
            return id
          }
        }),
        require('tailwindcss')(),

        // 根据平台差异进行不同的样式处理
        ...(process.env.UNI_PLATFORM !== 'h5' ? [
          // 使用postcss-class-name 包将小程序不支持的类名转换为支持的类名
          require('postcss-class-rename')({
            '\\:': '--',
            '\\/': '--',
            '\\.': '--',
            '.:': '--',
            '\*': '--'
          }),
          require('css-byebye')({
            rulesToRemove: [],
            map: false
          })
        ] : []),
              uniPostcssPlugin(),
              require('autoprefixer')({
                remove: true
              }),
            ]
          }
    }
  })

