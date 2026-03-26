## download thru modelscope
uvx modelscope
uvx modelscope download \
  --model Qwen/Qwen2.5-7B-Instruct-AWQ \
  --local_dir /mnt/hdd_data/volumes/vllm_node/models/Qwen2.5-7B-AWQ
volumes:
      # Монтируем папку с уже скачанной моделью
      - /mnt/hdd_data/volumes/vllm_node/models/Qwen2.5-7B-AWQ:/model

# Вместо AWQ скачайте GPTQ
modelscope download --model tclf90/qwen2.5-7b-instruct-1m-gptq-int4 \
  --local_dir /mnt/hdd_data/volumes/vllm_node/models/Qwen2.5-7B-GPTQ \
  --revision g128