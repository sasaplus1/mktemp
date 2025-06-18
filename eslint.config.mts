import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import jsPlugin from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nodePlugin from 'eslint-plugin-n';
import prettierConfig from 'eslint-config-prettier/flat';
import tseslintPlugin from 'typescript-eslint';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default defineConfig([
  globalIgnores(['coverage/', 'dist/', '**/*.d.ts']),
  {
    extends: ['js/recommended', 'n/flat/recommended'],
    plugins: {
      js: jsPlugin,
      n: nodePlugin
    }
  },
  {
    files: ['src/*.ts'],
    extends: [
      // tseslintPlugin.configs.recommended,
      // nodePlugin.configs['flat/recommended-module']
      'typescript-eslint/recommended',
      'n/flat/recommended-module'
    ],
    languageOptions: {
      globals: {
        ...globals.es2015,
        ...globals.node
      }
    },
    plugins: {
      //'@typescript-eslint': tseslintPlugin,
      n: nodePlugin
      // tsdoc: compat.extends('tsdoc')
    },
    rules: {
      'tsdoc/syntax': 'warn'
    },
    settings: {
      n: {
        tryExtensions: ['.d.ts', '.ts', '.js', '.json']
      }
    }
  },
  {
    extends: [prettierConfig]
  }
]);
