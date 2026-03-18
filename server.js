const http = require('http');
const os = require('os');
const redis = require('redis');

// 1. Kết nối tới anh "Thủ kho" Redis qua mạng nội bộ của Docker
const client = redis.createClient({
    url: 'redis://redis-server:6379' 
});

client.on('error', (err) => console.log('Redis Lỗi rồi:', err));

async function startServer() {
    await client.connect();
    console.log('Đã kết nối thành công tới Redis!');

    const server = http.createServer(async (req, res) => {
        // Trình duyệt hay gửi request ngầm xin cái icon, ta bỏ qua để đếm cho chuẩn
        if (req.url === '/favicon.ico') return res.end(); 

        // 2. NHỜ REDIS LÀM TOÁN: Tăng biến 'luot_truy_cap' lên 1 và lấy kết quả về
        // Lệnh incr (increment) của Redis cực kỳ an toàn, dù 100 máy gọi cùng lúc cũng không bị cộng sai
        const luotTruyCap = await client.incr('luot_truy_cap');

        // 3. Trả kết quả cho người dùng
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.write(`Xin chào! Bạn là người thứ ${luotTruyCap} truy cập vào hệ thống.\n`);
        res.write(`Request này vừa được xử lý bởi máy chủ: ${os.hostname()}\n`);
        res.end();
    });

    const PORT = 3000;
    server.listen(PORT, () => {
        console.log(`Server đang chạy ở port ${PORT}`);
    });
}

startServer();