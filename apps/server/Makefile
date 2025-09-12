setup:
	./setup.sh

test:
	PYTHONPATH=$$(pwd) .venv/bin/pytest -q

run:
	docker compose up --build

stop: 
	docker compose down

reset:
	docker compose down -v