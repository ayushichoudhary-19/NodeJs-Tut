const http = require('http');
const url = require('url');

const myServer = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') return;

    const queryParams = url.parse(req.url, true).query;
    const name = queryParams.name;

    if (!name) {
        res.end('Hello World!');
    } else {
        res.end(`Hello ${name}!`);
    }
});

myServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
