# УСТАНОВКА ДРАЙВЕРОВ NVIDIA НА DEBIAN 13
1. ## подготовка системы - удаление старого 
sudo apt purge "*nvidia*" "*cuda*"
sudo apt autoremove
sudo apt update
sudo apt install build-essential linux-headers-amd64 -y
2. ## Включите нужные репозитории
sudo nano /etc/apt/sources.list
    Добавьте слова contrib non-free non-free-firmware в конец каждой строки. Файл должен выглядеть примерно так:
    deb http://deb.debian.org/debian/ trixie main contrib non-free non-free-firmware
    deb-src http://deb.debian.org/debian/ trixie main contrib non-free non-free-firmware
    deb http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
    deb-src http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
    # trixie-updates, to get updates before a point release is made;
    # see https://www.debian.org/doc/manuals/debian-reference/ch02.en.html#_updates_and_backports
    deb http://deb.debian.org/debian/ trixie-updates main contrib non-free non-free-firmware
    deb-src http://deb.debian.org/debian/ trixie-updates main contrib non-free non-free-firmware

sudo apt update

3. ## Установка драйвера и CUDA (через системный репозиторий)
sudo apt install nvidia-driver nvidia-cuda-toolkit -y
sudo reboot

4. ## Проверка установки
nvidia-smi — должна показать RTX 3060 и версию драйвера.
nvcc --version — должна показать версию CUDA Toolkit.

# УСТАНОВКА NVIDIA Container Toolkit
5. ## Добавление GPG ключа и репозитория для Debian 13
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

6. ## Установка и настройка Docker
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
