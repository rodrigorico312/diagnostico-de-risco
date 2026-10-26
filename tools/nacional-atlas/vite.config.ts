import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:process.env.ATLAS_BASE_PATH||'/',plugins:[react()],build:{target:'es2022',rollupOptions:{input:{index:'index.html',para:'para.html',world:'world.html'}}},server:{host:'127.0.0.1'}});
