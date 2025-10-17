## dừng container nếu đang chạy và xóa container cũ và xóa image cũ
docker stop ai-waiter-assistant || true 
docker rm -f ai-waiter-assistant || true    

## pull github repo
git checkout main
git pull origin main

## build docker image
docker build -t ai-waiter-assistant .

## run docker image
docker run -d -p 4173:4173 --name ai-waiter-assistant ai-waiter-assistant
