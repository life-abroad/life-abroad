from fastapi.testclient import TestClient
from src.interfaces.http.api import app

client = TestClient(app)

def test_root():
    r = client.get("/")
    assert r.status_code == 200
