# vllm
vllm service
0. примонтировать volumes  на внешний диск:
    /mnt/hdd_data/volumes/vllm_node/models:/root/.cache/huggingface
    слева внешний лиск путь. в конце файл этот volumer  не указывать 
1. curl -LsSf https://hf.co/cli/install.sh | bash
   # утсановки hf-cli
2. hf auth login
   #  авторизация - подставить token
3. hf auth login --force
4. pip install hf_transfer
5. export HF_HUB_ENABLE_HF_TRANSFER=1
6. export HF_DEBUG=1
7. export HF_ENDPOINT=https://hf-mirror.com
8. hf download Qwen/Qwen3-8B --local-dir /mnt/hdd_data/volumes/vllm_node/models
9. hf download Qwen3-4B-Instruct-2507-FP8 --local-dir /mnt/hdd_data/volumes/vllm_node/qwen3_4
10. hf download google/translategemma-4b-it --local-dir /mnt/hdd_data/volumes/vllm_node/translategemma-4b-it









1. если не грузится автоматически:
docker exec -it vllm-node python3 -c "
from huggingface_hub import snapshot_download
import os
token = os.getenv('HF_TOKEN')
print(f'Using token: {token[:5]}***')
snapshot_download(
    repo_id='Qwen/Qwen3-8B',
    cache_dir='/root/.cache/huggingface',
    token=token,
    resume_download=True
)"
2. еще один вариант 
docker exec -it vllm-node bash -c "
pip install hf_transfer && \
HF_HUB_ENABLE_HF_TRANSFER=1 python3 -c \"
from huggingface_hub import snapshot_download
import os
snapshot_download(
    repo_id='Qwen/Qwen3-8B',
    cache_dir='/root/.cache/huggingface',
    token=os.getenv('HF_TOKEN'),
    resume_download=True,
    max_workers=8
)\""
