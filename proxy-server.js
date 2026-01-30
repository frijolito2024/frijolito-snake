/**
 * Pablo Devorador de Huevos - Score Proxy Server
 * Recibe scores del juego y los guarda en GitHub automáticamente
 * Token se carga desde .env (nunca en el código)
 */

require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SCORES_FILE = path.join(__dirname, '.scores-cache.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'frijolito2024';
const GITHUB_REPO = 'frijolito-snake';
const GITHUB_PATH = 'db.json';

// Validate token
if (!GITHUB_TOKEN) {
    console.error('❌ ERROR: GITHUB_TOKEN not found!');
    console.error('Set it via:');
    console.error('  1. Create .env file with: GITHUB_TOKEN=your_token_here');
    console.error('  2. Or export: export GITHUB_TOKEN=your_token_here');
    process.exit(1);
}

// Leer scores en caché
function readScoresCache() {
    try {
        if (fs.existsSync(SCORES_FILE)) {
            return JSON.parse(fs.readFileSync(SCORES_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error reading cache:', e);
    }
    return [];
}

// Guardar scores en caché local
function writeScoresCache(scores) {
    try {
        fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
    } catch (e) {
        console.error('Error writing cache:', e);
    }
}

// Actualizar db.json en GitHub
async function updateGitHubDB(scores) {
    try {
        // 1. Fetch db.json actual
        const getResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!getResponse.ok) {
            console.error('Failed to fetch db.json:', getResponse.status);
            return false;
        }

        const data = await getResponse.json();
        const sha = data.sha;

        // 2. Preparar nuevo contenido
        const newContent = {
            leaderboard: scores.sort((a, b) => b.score - a.score).slice(0, 100),
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        };

        // 3. Actualizar en GitHub
        const updateResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `🌭 Scores updated: ${scores.length} total`,
                    content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
                    sha: sha
                })
            }
        );

        if (updateResponse.ok) {
            console.log(`✅ GitHub updated: ${scores.length} scores`);
            return true;
        } else {
            console.error('Failed to update GitHub:', updateResponse.status);
            return false;
        }
    } catch (err) {
        console.error('Error updating GitHub:', err);
        return false;
    }
}

// Server
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // GET /api/scores - Obtener todos los scores
    if (req.method === 'GET' && req.url === '/api/scores') {
        const scores = readScoresCache();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, scores }));
        return;
    }

    // POST /api/save-score - Guardar un score
    if (req.method === 'POST' && req.url === '/api/save-score') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const entry = JSON.parse(body);

                // Validar
                if (!entry.name || entry.score === undefined || entry.level === undefined) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, error: 'Missing fields' }));
                    return;
                }

                // Guardar en caché local
                const scores = readScoresCache();
                scores.push({
                    name: String(entry.name).substring(0, 15),
                    score: parseInt(entry.score),
                    level: parseInt(entry.level),
                    date: new Date().toISOString()
                });
                writeScoresCache(scores);

                // Actualizar GitHub
                const success = await updateGitHubDB(scores);

                res.writeHead(success ? 201 : 200);
                res.end(JSON.stringify({
                    success: true,
                    message: 'Score saved',
                    githubSync: success
                }));
            } catch (err) {
                console.error('Error:', err);
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, error: 'Invalid request' }));
            }
        });
        return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: 'Not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n🌭 Pablo Devorador - Proxy Server`);
    console.log(`🌭 Running on http://127.0.0.1:${PORT}\n`);
    console.log(`POST  /api/save-score   → Save a score to GitHub`);
    console.log(`GET   /api/scores       → Get all scores\n`);
    console.log(`✅ Ready to sync scores!\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    process.exit(0);
});
