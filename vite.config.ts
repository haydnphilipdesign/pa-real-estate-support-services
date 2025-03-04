import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';
import { imagetools } from 'vite-imagetools';

// Get the directory name using ES modules compatible approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Add React refresh options
      // fastRefresh: true, // Removed fastRefresh option
      // Include specific imports for better tree-shaking
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    imagetools(),
    visualizer({
      open: true, // Open the visualization after build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Enable minification in production
    minify: mode === 'production',
    // Source maps only in development
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        // Ensure stable chunk names
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'animation-vendor': ['framer-motion', 'lucide-react'],
        },
      },
      // Ensure development-only code is tree-shaken
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 10000, // 10kb
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    // Force include problematic dependencies
    include: [
      'framer-motion',
      'react',
      'react-dom',
      'react-router-dom',
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled'
    ],
    // Ensure these are processed correctly
    entries: [
      'src/**/*.{ts,tsx}',
    ],
    // Force Vite to process these modules
    force: true,
    esbuildOptions: {
      target: 'es2020',
      // Drop development-only code
      drop: mode === 'production' ? ['console', 'debugger'] : []
    }
  },
  esbuild: {
    target: 'es2020',
    // Drop development-only code
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // Ensure pure annotations are respected
    pure: mode === 'production' ? ['console.log', 'debugger', 'console.debug'] : []
  },
  // Enable detailed logging
  logLevel: 'info',
  // Enable clear screen
  clearScreen: false,
  // Define environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'import.meta.env.DEV': mode === 'development',
    'import.meta.env.PROD': mode === 'production',
    'process.env': {
      VITE_AIRTABLE_API_KEY: JSON.stringify(process.env.VITE_AIRTABLE_API_KEY),
      VITE_AIRTABLE_BASE_ID: JSON.stringify(process.env.VITE_AIRTABLE_BASE_ID)
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/**',
        '**/*.d.ts',
      ],
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  cacheDir: './.vite'  // Explicit cache directory
}));
