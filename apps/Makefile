dev:
	docker compose -f docker-compose.dev.yaml up --build

prod:
	docker compose -f docker-compose.prod.mac.yaml --env-file .env.prod up --build

prod-pi:
	docker compose -f docker-compose.prod.yaml --env-file .env.prod up --build

stop: 
	docker compose -f docker-compose.dev.yaml down
	docker compose -f docker-compose.prod.mac.yaml down
	docker compose -f docker-compose.prod.yaml down

stop-prod:
	docker compose -f docker-compose.prod.mac.yaml down

stop-prod-pi:
	docker compose -f docker-compose.prod.yaml down

reset:
	docker compose -f docker-compose.dev.yaml down -v
	
drop:
	docker volume rm server_db_data
