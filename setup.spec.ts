import * as fs from 'fs';
import { execSync } from 'child_process';
import * as shell from 'shelljs';
import * as path from 'path';
import { exec, write, setup } from './setup'; // Adjust this import to match your file structure
import { mocked } from 'jest-mock';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
jest.mock('child_process');
jest.mock('shelljs', () => ({
  cd: jest.fn(),
  mkdir: jest.fn(),
}));
jest.mock('path');

describe('Project Setup', () => {
  const mockProjectName = 'testProject';
  const mockProjectPath = `current/working/directory/${mockProjectName}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exec function', () => {
    it('executes a command using execSync', () => {
      exec('echo "Hello World"');
      expect(execSync).toHaveBeenCalledWith('echo "Hello World"', { stdio: 'inherit' });
    });
  });

  describe('write function', () => {
    it('writes data to a file using writeFileSync', () => {
      write('path/to/file', 'test data');
      expect(fs.writeFileSync).toHaveBeenCalledWith('path/to/file', 'test data', 'utf8');
    });
  });

  describe('setup function', () => {
    // it('creates project directory if it does not exist', () => {
    //   setup(mockProjectName);
    //   expect(fs.mkdirSync).toHaveBeenCalledWith(mockProjectPath);
    // });

    it('does not create project directory if it already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
      setup(mockProjectName);
      expect(fs.mkdirSync).not.toHaveBeenCalledWith(mockProjectPath);
    });

    // it('navigates to the project directory and sets up initial structure', () => {
    //   setup(mockProjectName);
    //   expect(shell.cd).toHaveBeenCalledWith(mockProjectPath);
    //   expect(shell.mkdir).toHaveBeenCalledWith('src');
    //   expect(execSync).toHaveBeenCalledWith('git init', { stdio: 'inherit' });
    //   // ... additional assertions for other shell commands
    // });
    //
    // it('creates and writes tsconfig.json', () => {
    //   setup(mockProjectName);
    //   const tsConfigContent = JSON.stringify({
    //     compilerOptions: {
    //       target: "es6",
    //       module: "commonjs",
    //       rootDir: "./src",
    //       outDir: "./dist",
    //       esModuleInterop: true,
    //       strict: true,
    //       skipLibCheck: true
    //     },
    //     exclude: ["node_modules"],
    //     include: ["./src/**/*"]
    //   }, null, 2);
    //   expect(fs.writeFileSync).toHaveBeenCalledWith(
    //     path.join(mockProjectPath, 'tsconfig.json'),
    //     tsConfigContent,
    //     'utf8'
    //   );
    // });
  });

});
