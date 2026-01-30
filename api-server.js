/**
 * Pablo el Devorador de Huevos - Leaderboard API Server
 * Simple Node.js server to persist global leaderboard
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DB_FILE = path.join(__dirname, 'db.json');
const PORT = 3000;
const CORS_ORIGIN = '*';

// Helper: Read database
function readDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading DB:', e);
    }
    return { leaderboard: [], version: '1.0.0', lastUpdated: new Date().toISOString() };
}

// Helper: Write database
function writeDB(data) {
    try {
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.error('Error writing DB:', e);
        return false;
    }
}

// Helper: Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': CORS_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// Routes
const routes = {
    'GET /api/leaderboard': (req, res) => {
        const db = readDB();
        const leaderboard = db.leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 50)
            .map((entry, index) => ({
                ...entry,
                rank: index + 1
            }));
        sendJSON(res, 200, { success: true, leaderboard });
    },

    'GET /api/leaderboard/top10': (req, res) => {
        const db = readDB();
        const leaderboard = db.leaderboard
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((entry, index) => ({
                ...entry,
                rank: index + 1
            }));
        sendJSON(res, 200, { success: true, leaderboard });
    },

    'POST /api/leaderboard': (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const entry = JSON.parse(body);
                
                // Validate
                if (!entry.name || entry.score === undefined || entry.level === undefined) {
                    sendJSON(res, 400, { success: false, error: 'Missing required fields' });
                    return;
                }
                
                const db = readDB();
                db.leaderboard.push({
                    name: String(entry.name).substring(0, 15),
                    score: parseInt(entry.score),
                    level: parseInt(entry.level),
                    date: new Date().toISOString()
                });
                
                writeDB(db);
                sendJSON(res, 201, { success: true, message: 'Score saved' });
            } catch (e) {
                sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
            }
        });
    },

    'GET /api/leaderboard/stats': (req, res) => {
        const db = readDB();
        const stats = {
            totalScores: db.leaderboard.length,
            uniquePlayers: new Set(db.leaderboard.map(e => e.name)).size,
            highestScore: db.leaderboard.length > 0 ? Math.max(...db.leaderboard.map(e => e.score)) : 0,
            averageScore: db.leaderboard.length > 0 ? Math.round(db.leaderboard.reduce((sum, e) => sum + e.score, 0) / db.leaderboard.length) : 0,
            lastUpdated: db.lastUpdated
        };
        sendJSON(res, 200, { success: true, stats });
    },

    'OPTIONS /api': (req, res) => {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': CORS_ORIGIN,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
    }
};

// Server
const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    const method = req.method;
    const routeKey = `${method} ${pathname}`;
    
    // CORS preflight
    if (method === 'OPTIONS') {
        routes['OPTIONS /api']?.(req, res) || sendJSON(res, 200, {});
        return;
    }
    
    // Route matching
    const handler = routes[routeKey] || 
                   Object.entries(routes).find(([key]) => {
                       const [m, p] = key.split(' ');
                       return m === method && pathname.startsWith(p);
                   })?.[1];
    
    if (handler) {
        handler(req, res);
    } else {
        sendJSON(res, 404, { success: false, error: 'Not found' });
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`🌭 Leaderboard API Server running on http://127.0.0.1:${PORT}`);
    console.log(`GET  /api/leaderboard       - Get top 50 scores`);
    console.log(`GET  /api/leaderboard/top10 - Get top 10 scores`);
    console.log(`POST /api/leaderboard       - Save new score`);
    console.log(`GET  /api/leaderboard/stats - Get global stats`);
});
