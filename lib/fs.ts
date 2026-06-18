import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readJson<T>(fileName: string, defaultValue: T): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    return defaultValue;
  }
}

export async function writeJson<T>(fileName: string, data: T): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    // Ensure the data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${fileName}:`, error);
    return false;
  }
}

export async function readMarkdown(filePathFromData: string): Promise<string> {
  try {
    const filePath = path.join(DATA_DIR, filePathFromData);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading markdown ${filePathFromData}:`, error);
    return '';
  }
}

export async function writeMarkdown(filePathFromData: string, content: string): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, filePathFromData);
    // Ensure parent directories exist
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing markdown ${filePathFromData}:`, error);
    return false;
  }
}
