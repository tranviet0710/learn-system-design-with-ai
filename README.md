# Start
docker-compose up --build -d

# Check load balancing

```
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 67736b7c6434
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 2782ad71af88
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 7f9f9745f753
```

# Stop
docker-compose stop web2

# Check load balancing
curl http://localhost:8080 => IP web2 gone

# Start
docker-compose start web2

# Check load balancing
curl http://localhost:8080 => IP web2 back

