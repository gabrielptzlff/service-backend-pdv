build:
	sudo docker compose build --no-cache 
start:
	sudo docker compose up -d && sudo docker-compose exec service-backend-pdv npm run migrate up
down:
	sudo docker-compose exec service-backend-pdv npm run migrate down && sudo docker compose down