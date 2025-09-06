setup:
	cd apps/server && ./setup.sh

test:
	cd apps/server && PYTHONPATH=$$(pwd) .venv/bin/pytest -q

run: 
	docker compose up --build

stop:
	docker compose down