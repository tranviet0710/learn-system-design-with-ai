# LOAD BALANCING VỚI NGINX TRONG DOCKER COMPOSE
## Mục tiêu: Tạo một hệ thống cân bằng tải đơn giản với Nginx và ba container web.
docker-compose up --build -d

## Kiểm tra hệ thống

```
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 67736b7c6434
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 2782ad71af88
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 7f9f9745f753
```

## Tắt web2
docker-compose stop web2

## Kiểm tra load balancing sau khi tắt web2
curl http://localhost:8080 => IP web2 gone

## Khởi động lại web2
docker-compose start web2

## Kiểm tra load balancing sau khi khởi động lại web2
curl http://localhost:8080 => IP web2 back

# HORIZONTAL SCALING

## Tăng số lượng container web từ 3 lên 5
docker-compose up --build -d --scale web=5

## Kiểm tra hệ thống sau khi tăng số lượng container web
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 677367c6434
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 2782ad71af88
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 7f9f9745f753
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 123456789abc
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: abcdef123456    

## Giảm số lượng container web từ 5 xuống 2
docker-compose up --build -d --scale web=2

## Kiểm tra hệ thống sau khi giảm số lượng container web
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 677367c6434
curl http://localhost:8080 => Xin chào! Request của bạn được xử lý bởi máy chủ: 2782ad71af88
