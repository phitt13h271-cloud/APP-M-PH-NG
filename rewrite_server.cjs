const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace('async function startServer() {', '');
content = content.replace('  const app = express();\n  const PORT = 3000;', 'const app = express();\nconst PORT = process.env.PORT || 3000;');

// Find the vite block at the end
const viteBlock = `
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();
`;

// Replace the vite block
content = content.split('  if (process.env.NODE_ENV !== "production") {')[0];

content += `
if (!process.env.VERCEL) {
  (async () => {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(\`Server running on http://localhost:\${PORT}\`);
    });
  })();
}

export default app;
`;

// Also fix indentation of the routes (optional)

fs.writeFileSync('server.ts', content);
