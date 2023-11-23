[//]: # ([![Node.js CI]&#40;https://github.com/rafay826/generate-express-ts/actions/workflows/run_tests.yml/badge.svg&#41;]&#40;https://github.com/rafay826/generate-express-ts/actions/workflows/run_tests.yml&#41;)

# Express TypeScript App Setup

This script sets up a new Express application with TypeScript. It's designed to create a project structure, initialize version control, install dependencies, and configure TypeScript, ESLint, Prettier, and Jest for testing.

## Features

- Sets up an Express server with TypeScript
- Configures ESLint with TypeScript support
- Adds Prettier for code formatting
- Sets up Jest and Supertest for endpoint testing
- Initializes a new Git repository
- Configures Husky for pre-commit hooks

## Prerequisites

Before running this script, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or Yarn
- Git

## Installation

Install the package globally using npm:

```bash
npm install -g generate-express-ts
```

Or using Yarn:

```bash
yarn global add generate-express-ts
```

## Usage

After installing the package globally, you can set up a new Express TypeScript application by running:

```bash
generate-express-ts <project-name>
```

Replace `<project-name>` with your desired project directory name. If you don't specify a name, it defaults to `my-express-ts-app`.

The script will create a new directory with the given project name (or the default name) and set up the project structure and configurations within that directory.

## What's Included

The script will create the following files and directories:

- `.eslintrc.yml`: ESLint configuration file
- `.prettierrc.yml`: Prettier configuration file
- `.gitignore`: Basic `.gitignore` file for a Node.js project
- `app.ts`: Entry point for the Express application
- `app.spec.ts`: Sample test file using Jest and Supertest
- `tsconfig.json`: TypeScript configuration file
- `.lintstagedrc`: Configuration for lint-staged
- `package.json`: Node.js package manifest with scripts for common tasks

## Scripts

The generated `package.json` includes the following scripts:

- `start`: Runs the Express server using `ts-node`
- `build`: Compiles TypeScript files to JavaScript in the `dist/` directory
- `test`: Runs tests using Jest

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## Contact

Rafay Choudhury - [x: @rafay_io](https://twitter.com/rafay_io) - [website: rafay.io](https://rafay.io)
