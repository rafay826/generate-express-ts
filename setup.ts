import {execSync} from 'child_process'
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'

// Helper functions
const exec = (command: string) => {
  execSync(command, {stdio: 'inherit'})
}

const write = (filePath: string, data: string) => {
  writeFileSync(filePath, data, 'utf8')
}

// Main setup function
const setup = (projectName: string) => {
  const projectPath = path.join(process.cwd(), projectName)

  if (!existsSync(projectPath)) {
    mkdirSync(projectPath)
  }

  shell.cd(projectPath)
  shell.mkdir('src')
  exec('git init')
  exec('yarn init -y')
  exec('yarn add express')
  exec('yarn add --dev typescript ts-node @types/node @types/express')
  exec('yarn add -D husky lint-staged eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier jest')
  exec('yarn add -D ts-jest @types/jest supertest @types/supertest eslint-plugin-unused-imports@latest')
  exec('npx tsc --init')

  write(path.join(projectPath, 'tsconfig.json'), `{
    "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "rootDir": "./src",
      "outDir": "./dist",
      "esModuleInterop": true,
      "strict": true,
      "skipLibCheck": true
    },
    "exclude": ["node_modules"],
    "include": ["./src/**/*"]
  }`)

  write(path.join(projectPath, './src/app.ts'), `
import express from "express";

export const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(\`Server is running at http://localhost:\${port}\`)
  })
}
  `)

  write(path.join(projectPath, '.eslintrc.yml'),
    `parser: '@typescript-eslint/parser'
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
  `)

  write(path.join(projectPath, '.gitignore'), `node_modules
.idea
dist
  `)

  write(path.join(projectPath, '.prettierrc.yml'), `printWidth: 120
semi: false
singleQuote: true
  `)

  write(path.join(projectPath, '.lintstagedrc'), `{
    "**/*.{js,ts}": [
      "prettier --write",
      "eslint --fix"
    ],
    "**/*.{json,md}": [
      "prettier --write"
    ]
  }`)

  write(path.join(projectPath, './src/app.spec.ts'), `
import request from 'supertest';
import { app } from './app';

describe('GET /', () => {
  it('responds with Hello, world!', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hello, world!');
  });
});
  `)

  exec('yarn husky install')
  exec(`yarn husky add .husky/pre-commit "yarn lint-staged"`)

  exec('npx ts-jest config:init')

  let packageJson
  const packageJsonPath = path.join(projectPath, 'package.json')
  if (existsSync(packageJsonPath)) {
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  } else {
    packageJson = {scripts: {}, license: 'MIT'}
  }

  packageJson.scripts = {
    ...packageJson.scripts,
    'start': 'ts-node ./src/app.ts',
    'build': 'tsc',
    'serve': 'node dist/app.js',
    'test': 'NODE_ENV=test jest',
    'prepare': 'husky install'
  }

  write(packageJsonPath, JSON.stringify(packageJson, null, 2))

  exec('yarn prepare')

  console.log("Express TypeScript project setup complete.")
}

// This should be the entry point when the script is run
if (require.main === module) {
  const projectName = process.argv[2] || 'my-express-ts-app'
  setup(projectName)
}
