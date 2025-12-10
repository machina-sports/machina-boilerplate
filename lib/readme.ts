import fs from 'fs';
import path from 'path';

export function getReadmeContent(): string {
  try {
    const readmePath = path.join(process.cwd(), 'README.md');
    const content = fs.readFileSync(readmePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading README.md:', error);
    return '# Documentation\n\nFailed to load README.md';
  }
}

