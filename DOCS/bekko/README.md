# bekko embeded service
модель для оценки качества перевода по косинусному схоству оригинала и перевода
скачать и скопироватьслеующие файлы в диркторию
/models/hotchpotch/bekko-embedding-v1-a8m/
config.json
tokenizer.json
tokenizer_config.json
special_tokens_map.json
onnx/model.onnx

## проверка
curl http://localhost:8200/health

curl -X POST http://localhost:8200/embed \
  -H "Content-Type: application/json" \
  -d '{"source":"Hello world","translation":"Привет мир"}'