#!/bin/bash

# Create and enter project directory
mkdir my-express-ts-app
cd my-express-ts-app

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express
npm install --save-dev typescript ts-node @types/node @types/express

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

# Create project structure
mkdir -p src/features/users
mkdir src/config
mkdir src/middlewares
mkdir src/utils

# Create sample feature files
touch src/features/users/userRoutes.ts
touch src/features/users/userController.ts
touch src/features/users/userService.ts
touch src/features/users/userModel.ts

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
' > src/app.ts

# Add scripts to package.json using Node.js
node -e "
let fs = require('fs');
let packageJson = require('./package.json');
packageJson.scripts = {
  ...packageJson.scripts,
  'start': 'ts-node src/app.ts',
  'build': 'tsc',
  'serve': 'node dist/app.js'
};
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
"

# End of script
echo "Express TypeScript project setup complete."
