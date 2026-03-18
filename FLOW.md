### 1. Phân tích câu lệnh `docker-compose up --build -d`

* **`docker-compose up`**: Lệnh khởi động toàn bộ hệ thống dựa trên file "kịch bản" `docker-compose.yml`.
* **`--build`**: Ra lệnh cho Docker: *"Ê, trước khi chạy, hãy tự tay đóng lại các máy chủ web theo bản thiết kế mới nhất nhé, lỡ tôi vừa sửa code"*.
* **`-d` (Detached mode)**: Chạy ngầm. Trả lại màn hình Terminal cho bạn gõ lệnh khác, trong khi các máy chủ vẫn chạy âm thầm phía sau.

### 2. Luồng thực thi: Câu chuyện của 4 file

Khi bạn gõ Enter, Docker sẽ làm việc như một "Tổng thầu xây dựng", thực hiện tuần tự các bước sau:

#### Bước 1: Đọc bản thiết kế tổng thể (`docker-compose.yml`)
Docker đọc file này đầu tiên. Nó thấy bạn yêu cầu tạo ra 4 Dịch vụ (Services): `web1`, `web2`, `web3` và `load_balancer`. Đặc biệt, nó tạo ra một **mạng ảo nội bộ (Internal Network)** để 4 ông này có thể nói chuyện với nhau.

#### Bước 2: Đúc máy chủ Web (`Dockerfile` + `server.js`)
Docker nhìn vào cấu hình của `web1`, nó thấy dòng `build: .` (dấu chấm nghĩa là thư mục hiện tại).
* Nó đi tìm file **`Dockerfile`**. File này nói: *"Lấy hệ điều hành Node.js về, copy file **`server.js`** vào, và chạy nó"*.
* Docker làm theo và tạo ra một "khuôn đúc" (Image).
* Sau đó, nó dùng đúng cái khuôn đúc này để đúc ra 3 cái máy ảo giống hệt nhau, đặt tên là `web1`, `web2` và `web3`. Bên trong mỗi máy đều đang chạy đoạn code Node.js chực chờ ở port `3000`.

#### Bước 3: Thuê Lễ tân và nhét "Luật đi cửa" vào tay (`nginx.conf`)
Tiếp theo, Docker đọc đến cấu hình `load_balancer`. Nó không cần đúc nữa vì dùng sẵn ảnh `nginx:alpine` từ trên mạng.
* **Mối liên kết quan trọng nhất:** Cấu hình `volumes: - ./nginx.conf:/etc/nginx/nginx.conf`. Docker sẽ lấy cái file **`nginx.conf`** nằm trên laptop của bạn, "nhét" thẳng vào bên trong cái máy ảo Nginx đè lên file mặc định của nó. 
* Lúc này Nginx mở file đó ra đọc và thấy luật: *"À, hễ có khách vào, tao sẽ đẩy lần lượt sang 3 thằng tên là `web1:3000`, `web2:3000` và `web3:3000`"*.
* **Tại sao Nginx biết `web1` là ai?** Nhờ cái mạng ảo nội bộ ở Bước 1! Trong Docker Compose, tên của service (`web1`) cũng chính là địa chỉ (Domain/IP) nội bộ của nó. Nginx chỉ cần gọi tên là gọi trúng máy.

#### Bước 4: Mở cửa đón khách (Port Mapping)
Ở cuối file compose có dòng `ports: - "8080:80"`. 
Docker sẽ khoan một "lỗ hổng" xuyên qua bức tường của mạng ảo, nối cái cổng số **8080** trên laptop thực tế của bạn, đi thẳng vào cổng số **80** của anh Lễ tân Nginx. 3 máy `web1`, `web2`, `web3` bị giấu kín hoàn toàn bên trong, không ai ngoài internet chạm vào được.

---

### 3. Tóm tắt luồng dữ liệu (Data Flow) khi bạn F5 trình duyệt

Bây giờ hệ thống đã chạy. Khi bạn mở Chrome và gõ `http://localhost:8080`:

1. **Request** từ Chrome đập vào port **8080** của laptop.
2. Nước chảy qua ống (Port mapping), chui tọt vào port **80** của container **Nginx** (`load_balancer`).
3. Nginx giở sổ tay (**`nginx.conf`**) ra xem: *"Lần trước cho qua `web1` rồi, lần này ông khách này phải chuyển sang `web2` qua port **3000**"*.
4. Mạng nội bộ của Docker dẫn đường cho request tới cửa **3000** của container **`web2`**.
5. Code Node.js (**`server.js`**) ở máy `web2` giật mình tỉnh dậy, lấy cái tên định danh (Hostname) của chính nó ghép vào câu *"Xin chào..."* rồi gửi trả lại kết quả qua đúng con đường cũ về lại Chrome.

Đó chính là bức tranh toàn cảnh! Sự kết hợp này mô phỏng chính xác 100% cách các hệ thống thật ngoài đời hoạt động, chỉ khác là ngoài đời họ dùng hàng chục máy chủ thật thay vì các container ảo trên laptop của bạn.

Bây giờ, để thấy rõ sức mạnh của anh Lễ tân Nginx, bạn có muốn tôi hướng dẫn bạn chạy một lệnh để **"bắn hạ" (tắt đột ngột) máy `web2`**, sau đó chúng ta ra ngoài trình duyệt F5 xem hệ thống có bị sập không nhé?