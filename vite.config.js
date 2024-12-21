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
        outDir: './dist', // 确保输出目录与 tauri.conf.json 中的 frontendDist 设置一致
    }
})
