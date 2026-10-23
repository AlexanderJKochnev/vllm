# LAYA-AI
проверка

curl http://localhost:8080/embeddings \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Пример текста для обработки моделью принятия решений"
  }'
v1/systemone

curl http://localhost:8080/v1/systemone \
  -H "Content-Type: application/json" \
  -d '{
    "content": "это текст?"
  }'