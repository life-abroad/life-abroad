setup:
	./setup.sh

test:
	PYTHONPATH=$$(pwd) .venv/bin/pytest -q

freeze:
	pip freeze > requirements.txt
