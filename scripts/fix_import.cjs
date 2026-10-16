const fs = require('fs');
let p = 'D:/aimeducare-frontend/src/pages/admin/DashboardPage.jsx';
let content = fs.readFileSync(p, 'utf8');
content = content.replace("ArrowUpRight\n} from 'lucide-react';", "ArrowUpRight,\n  FileSpreadsheet\n} from 'lucide-react';");
content = content.replace("ArrowUpRight\r\n} from 'lucide-react';", "ArrowUpRight,\r\n  FileSpreadsheet\r\n} from 'lucide-react';");
fs.writeFileSync(p, content, 'utf8');
console.log('Added FileSpreadsheet import to DashboardPage.jsx');