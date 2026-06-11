import fs from 'fs';
import path from 'path';

const distDir = './dist';
const rootDir = '../';

// 1. Read dist/index.html
const htmlPath = path.join(distDir, 'index.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 2. Clean up paths to make them relative
// Replace /./_astro/ with _astro/
htmlContent = htmlContent.replace(/\/?\.\/_astro\//g, '_astro/');
// Replace /assets/ with assets/
htmlContent = htmlContent.replace(/"\/assets\//g, '"assets/');
// Replace favicon paths
htmlContent = htmlContent.replace(/href="\/favicon/g, 'href="./favicon');

// 3. Write back to root convertify.html
const targetHtmlPath = path.join(rootDir, 'convertify.html');
fs.writeFileSync(targetHtmlPath, htmlContent, 'utf8');
console.log('✓ Successfully exported compiled HTML to root convertify.html');

// 4. Copy dist/_astro/ to root _astro/
const sourceAstroDir = path.join(distDir, '_astro');
const targetAstroDir = path.join(rootDir, '_astro');

const copyFolderSync = (from, to) => {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
};

if (fs.existsSync(sourceAstroDir)) {
  // Clear root _astro if exists to prevent accumulation of old hashes
  if (fs.existsSync(targetAstroDir)) {
    fs.rmSync(targetAstroDir, { recursive: true, force: true });
  }
  copyFolderSync(sourceAstroDir, targetAstroDir);
  console.log('✓ Successfully copied compiled CSS/JS bundle to root _astro/');
} else {
  console.warn('⚠ Compiled _astro directory not found');
}
