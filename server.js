const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    // os.hostname() sẽ in ra ID của máy chủ ảo (container) đang chạy code này
    res.end(`Xin chào! Request của bạn được xử lý bởi máy chủ: ${os.hostname()}\n`);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy ở port ${PORT}`);
});