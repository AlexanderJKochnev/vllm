1. ## имя подели ищем на сайет https://modelscope.cn/
    ModelCloud.AI/Mistral-Nemo-Instruct-2407-gptq-4bit
2. uvx modelscope
3. modelscope download --model <ИМЯ_МОДЕЛИ> --local_dir <ПУТЬ_К_ПАПКЕ>
4. запускать из под su
5. uvx modelscope download --model ModelCloud.AI/Mistral-Nemo-Instruct-2407-gptq-4bit --local_dir /mnt/hdd_data/@named_volumes/vllm_node/models/Mistral-Nemo-4bit --max-workers 8
6. Qwen2.5-7B-Instruct-GPTQ-Int8
7. uvx modelscope download --model Qwen2.5-7B-Instruct-GPTQ-Int8 --local_dir /mnt/hdd_data/@named_volumes/vllm_node/models/Qwen2.5-7B-Instruct-GPTQ-Int8 --max-workers 8

# через hg
1. uv tool install huggingface_hub[cli]
2. export PATH="/root/.local/bin:$PATH"
3. hf auth 
4. hf download Qwen/Qwen2.5-7B-Instruct-GPTQ-Int8 \
  --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/Qwen2.5-7B-Instruct-GPTQ-Int8

5. google/gemma-3-4b-it 
hf download google/gemma-3-4b-it \
  --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/google/gemma-3-4b-it

# RedHatAI/gemma-3-4b-it-quantized.w4a16

hf download RedHatAI/gemma-3-4b-it-quantized.w4a16 \
  --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/google/gemma-3-4b-it-quantized.w4a16
