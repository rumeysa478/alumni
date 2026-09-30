---
description: Always update Swagger documentation and Postman collection when defining new routes
trigger: always_on
---

# Swagger & Postman Senkronizasyonu Kuralı

Projeye yeni bir rota (route) eklendiğinde, güncellendiğinde veya silindiğinde:
1. `src/config/swagger.js` dosyasına ilgili rotanın OpenAPI 3.0 şeması, parametreleri, requestBody (form ve JSON) ve response tanımları eksiksiz eklenmelidir.
2. `alumni.postman_collection.json` dosyasına ilgili istek ve test doğrulamaları eklenmelidir.
3. `README.md` dosyasındaki API tablosu güncellenmelidir.
