# LAYA-AI
проверка
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Привет! Ты работаешь без PyTorch?"}]
  }'
