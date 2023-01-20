const http = require('http');
const qrcode = require('qrcode');
const url = require('url');

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const query = url.parse(req.url, true).query;
        const { url: qrUrl } = query;
        if (!qrUrl) {
            res.statusCode = 400;
            res.end('Bad Request: Missing url query parameter');
            return;
        }
        qrcode.toBuffer(qrUrl, {
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        }, (err, buffer) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Error generating QR code');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(buffer);
        });
    } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

