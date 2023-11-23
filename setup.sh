#!/bin/bash

# Set project name from first script argument, default to 'my-express-ts-app'
PROJECT_NAME=${1:-my-express-ts-app}

# Create and enter project directory
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize Git repository
git init

# Initialize Node.js project with Yarn
yarn init -y

# Install dependencies with Yarn
yarn add express
yarn add --dev typescript ts-node @types/node @types/express

# Install additional development tools
yarn add -D husky lint-staged eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier jest
yarn add -D ts-jest @types/jest supertest @types/supertest eslint-plugin-unused-imports@latest

# TypeScript configuration
npx tsc --init
echo '{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "rootDir": "./",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules"]
}' > tsconfig.json

# Create Express server entry point
echo 'import express from "express";

export const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
' > app.ts

# ESLint configuration
echo "parser: '@typescript-eslint/parser'
root: true
env:
  browser: true
  jest: true
  es2021: true
plugins:
  - unused-imports
rules:
  'unused-imports/no-unused-imports': 'error'
  # ... other rules ...
  'no-use-before-define': 'off'
" > .eslintrc.yml

# gitignore configuration
echo 'node_modules
.idea
dist
' > .gitignore

# Prettier configuration
echo 'printWidth: 120
      semi: false
      singleQuote: true
' > .prettierrc.yml

# lint-staged configuration
echo '{
  "**/*.{js,ts}": [
    "prettier --write",
    "eslint --fix"
  ],
  "**/*.{json,md}": [
    "prettier --write"
  ]
}' > .lintstagedrc

echo "import request from 'supertest';
      import { app } from './app';  // Adjust the path based on your project structure

      describe('GET /', () => {
        it('responds with Hello, world!', async () => {
          const response = await request(app).get('/');
          expect(response.statusCode).toBe(200);
          expect(response.text).toBe('Hello, world!');
        });
      });
" > app.spec.ts

# Initialize Husky and create pre-commit hook
yarn husky install
yarn husky add .husky/pre-commit "yarn lint-staged"

# Jest configuration
npx ts-jest config:init

# Update package.json scripts
node -e "
let fs = require('fs');
let packageJson = require('./package.json');
packageJson.scripts = {
  ...packageJson.scripts,
  'start': 'ts-node app.ts',
  'build': 'tsc',
  'serve': 'node dist/app.js',
  'test': 'jest',
  'prepare': 'husky install'
};
packageJson.license = 'MIT'; // You can change 'MIT' to your preferred license
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
"

# Run the prepare script to finalize Husky installation
yarn prepare

# End of script
echo "Express TypeScript project setup complete."
