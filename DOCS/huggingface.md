# huggingface
# В директорию, которую вы монтируете в контейнер
uvx --from huggingface_hub hf download unsloth/gemma-3-4b-it --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/unsloth/unsloth-gemma-3-4b-it

uvx --from huggingface_hub hf download tiiuae/Falcon-H1-3B-Instruct --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/

tiiuae/Falcon-H1-3B-Instruct

Qwen/Qwen2.5-Coder-7B-Instruct-GPTQ-Int4
 
uvx --from huggingface_hub hf download Qwen/Qwen2.5-7B-Instruct-GPTQ-Int4 --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/Qwen/Qwen2.5-7B-Instruct-GPTQ-Int4

RedHatAI/Mistral-Nemo-Instruct-2407-quantized.w4a16

uvx --from huggingface_hub hf download RedHatAI/Mistral-Nemo-Instruct-2407-quantized.w4a16 --local-dir /mnt/hdd_data/@named_volumes/vllm_node/models/Mistral-Nemo-Instruct-2407-quantized