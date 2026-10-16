const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('D:/aimeducare-frontend/src');
let fixedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Match className=something where something does not start with " or ' or {
  // e.g. <div className=w-64 bg-slate-900 ...>
  content = content.replace(/className=([a-zA-Z0-9_\-/\.\$\#\:\@\[\]\%\,\s]+?)(\s+[a-zA-Z0-9_\-]+=|[\/>])/g, (match, val, end) => {
    // If val is already wrapped in quotes or braces, don't change
    val = val.trim();
    if (val.startsWith('"') || val.startsWith("'") || val.startsWith('{')) {
      return match;
    }
    return `className="${val}"${end.startsWith(' ') ? end : (end.startsWith('/') ? ' /' : (end.startsWith('>') ? '>' : end))}`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
    console.log('Fixed quotes in: ' + file);
  }
}

console.log('Total files checked: ' + files.length + ', modified: ' + fixedCount);