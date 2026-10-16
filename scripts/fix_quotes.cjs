const fs = require('fs');

const files = [
  'D:/aimeducare-frontend/src/layouts/PublicLayout.jsx',
  'D:/aimeducare-frontend/src/layouts/AdminLayout.jsx',
  'D:/aimeducare-frontend/src/layouts/StudentLayout.jsx'
];

for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/className=min-h-screen([^\n>]+)/g, 'className="min-h-screen$1"');
  fs.writeFileSync(f, content, 'utf8');
}
console.log('Fixed quotes successfully');