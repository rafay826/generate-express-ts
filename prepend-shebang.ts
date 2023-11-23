import * as fs from 'fs';
import * as path from 'path';

const prependShebang = (): void => {
  const filePath = path.join(__dirname, 'dist', 'setup.js');
  const shebang = '#!/usr/bin/env node\n';

  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    if (!fileData.startsWith(shebang)) {
      fs.writeFileSync(filePath, shebang + fileData);
    }
  } catch (error) {
    console.error('Error prepending shebang:', error);
    process.exit(1);
  }
};

prependShebang();

