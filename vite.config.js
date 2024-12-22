import { defineConfig } from 'vite'

export default defineConfig({
    // Tauri 工作于固定端口，如果端口不可用则报错
    strictPort: true,
    root: './src',
    server: {
        strictPort: true
    },
    clearScreen: false,
    base: './',
    fs: {
        strict: false
    },
    headers: {
        'Content-Type': 'application/javascript'
    },
    optimizeDeps: {
        exclude: ['@tauri-apps/api']
    },
    build: {
        outDir: './dist/',
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.')
                    const ext = info[info.length - 1]
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return `images/[name][extname]`
                    }
                    if (/css/i.test(ext)) {
                        return `css/[name][extname]`
                    }
                    return `assets/[name][extname]`
                },
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
            }
        }
    }
})
