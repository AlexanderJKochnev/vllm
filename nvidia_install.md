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
