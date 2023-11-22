#!/bin/bash

# Set project name from first script argument, default to 'my-express-ts-app'
PROJECT_NAME=${1:-my-express-ts-app}

# Create and enter project directory
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize Node.js project with Yarn
yarn init -y

# Install dependencies with Yarn
yarn add express
yarn add --dev typescript ts-node @types/node @types/express

# TypeScript configuration
npx tsc --init
echo '{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}' > tsconfig.json

# Create Express server entry point
echo 'import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
' > app.ts

# Add scripts to package.json using Node.js
node -e "
let fs = require('fs');
let packageJson = require('./package.json');
packageJson.scripts = {
  ...packageJson.scripts,
  'start': 'ts-node app.ts',
  'build': 'tsc',
  'serve': 'node dist/app.js'
};
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
"

# End of script
echo "Express TypeScript project setup complete."
