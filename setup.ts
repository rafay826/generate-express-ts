import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import * as shell from 'shelljs';

// Helper functions
const exec = (command: string) => {
  execSync(command, { stdio: 'inherit' });
};

const write = (path: string, data: string) => {
  writeFileSync(path, data, 'utf8');
};

// Main setup function
const setup = (projectName: string) => {
  if (!existsSync(projectName)) {
    mkdirSync(projectName);
  }
  shell.cd(projectName);
  exec('git init');
  exec('yarn init -y');
  exec('yarn add express');
  exec('yarn add --dev typescript ts-node @types/node @types/express');
  exec('yarn add -D husky lint-staged eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier jest');
  exec('yarn add -D ts-jest @types/jest supertest @types/supertest eslint-plugin-unused-imports@latest');
  exec('npx tsc --init');

  write('tsconfig.json', `{
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
  }`);

  write('app.ts', `import express from "express";

  export const app = express();
  const port = 3000;
  
  app.use(express.json());
  
  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });
  
  app.listen(port, () => {
    console.log(\`Server is running at http://localhost:\${port}\`);
  });
  `);

  write('.eslintrc.yml', `parser: '@typescript-eslint/parser'
  root: true
  env:
    browser: true
    jest: true
    es2021: true
  plugins:
    - unused-imports
  rules:
    'unused-imports/no-unused-imports': 'error'
    'no-use-before-define': 'off'
  `);

  write('.gitignore', `node_modules
  .idea
  dist
  `);

  write('.prettierrc.yml', `printWidth: 120
  semi: false
  singleQuote: true
  `);

  write('.lintstagedrc', `{
    "**/*.{js,ts}": [
      "prettier --write",
      "eslint --fix"
    ],
    "**/*.{json,md}": [
      "prettier --write"
    ]
  }`);

  write('app.spec.ts', `import request from 'supertest';
  import { app } from './app';
  
  describe('GET /', () => {
    it('responds with Hello, world!', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Hello, world!');
    });
  });
  `);

  exec('yarn husky install');
  exec(`yarn husky add .husky/pre-commit "yarn lint-staged"`);

  exec('npx ts-jest config:init');

  const packageJsonPath = './package.json';
  const packageJson = require(packageJsonPath);
  packageJson.scripts = {
    ...packageJson.scripts,
    'start': 'ts-node app.ts',
    'build': 'tsc',
    'serve': 'node dist/app.js',
    'test': 'jest',
    'prepare': 'husky install'
  };
  packageJson.license = 'MIT';
  write(packageJsonPath, JSON.stringify(packageJson, null, 2));

  exec('yarn prepare');

  console.log("Express TypeScript project setup complete.");
};

// Parse command line arguments
const projectName = process.argv[2] || 'my-express-ts-app';
setup(projectName);
