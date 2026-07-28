const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace('async function startServer() {\n  const app = express();', 'const app = express();\nasync function startServer() {');

// Remove the PORT definition from inside startServer
content = content.replace('  const PORT = 3000;\n', '');
// Add PORT to top
content = content.replace('const app = express();', 'const app = express();\nconst PORT = process.env.PORT || 3000;');

content = content.replace('  app.listen(PORT, "0.0.0.0", () => {\n    console.log(`Server running on http://localhost:${PORT}`);\n  });\n}', '  if (!process.env.VERCEL) {\n    app.listen(PORT, "0.0.0.0", () => {\n      console.log(`Server running on http://localhost:${PORT}`);\n    });\n  }\n}\n\nif (!process.env.VERCEL) {\n  startServer();\n}\n\nexport default app;');

content = content.replace('startServer();', ''); // we already replaced it or we just remove the old one

fs.writeFileSync('server.ts', content);
