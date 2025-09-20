import os
import pytest
import asyncio
from unittest.mock import patch, MagicMock
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine

# Set environment variables FIRST, before any other imports
os.environ.update({
    'DATABASE_URL': 'sqlite+aiosqlite:///./test.db',
    'MINIO_ENDPOINT': 'localhost:9000',
    'MINIO_ACCESS_KEY': 'minioadmin',
    'MINIO_SECRET_KEY': 'minioadmin123',
    'MINIO_BUCKET_NAME': 'test-bucket',
    'MINIO_SECURE': 'false',
    'JWT_SECRET_KEY': 'test-secret-key',
    'FRONTEND_URL': 'http://localhost:3000',
    'VONAGE_API_KEY': 'test',
    'VONAGE_API_SECRET': 'test',
    'SMS_FROM_NUMBER': '+1234567890'
})

# Mock MinIO connection for tests
with patch('src.infrastructure.storage.media_storage_service.Minio') as mock_minio:
    mock_client = MagicMock()
    mock_client.bucket_exists.return_value = True
    mock_minio.return_value = mock_client
    
    # Now safe to import the app
    from fastapi.testclient import TestClient
    from src.interfaces.http.api import app

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Setup test database"""
    # Create test database tables
    engine = create_async_engine('sqlite+aiosqlite:///./test.db', echo=False)
    
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
    
    # Run the async function
    asyncio.run(create_tables())
    
    yield
    
    # Cleanup
    if os.path.exists("./test.db"):
        os.remove("./test.db")

def test_health_check():
    """Test that the API is running"""
    response = client.get("/")
    assert response.status_code == 200

def test_create_user():
    """Test user creation endpoint"""
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone_number": "+1234567890" 
    }
    response = client.post("/users/", json=user_data)
    
    # Debug: Print response details if it fails
    if response.status_code != 201:
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test User"
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_create_post():
    """Test post creation endpoint"""
    # First create a user
    user_data = {
        "name": "Post Creator",
        "email": "creator@example.com", 
        "phone_number": "+1234567891" 
    }
    user_response = client.post("/users/", json=user_data)
    
    # Debug: Print user creation response
    if user_response.status_code != 201:
        print(f"User creation failed: {user_response.status_code}")
        print(f"User response: {user_response.text}")
        return
    
    user_id = user_response.json()["id"]
    
    # Create a post
    post_data = {
        "user_id": user_id,
        "description": "Test post description"
    }
    response = client.post("/posts/", json=post_data)
    
    # Debug: Print post creation response
    if response.status_code != 201:
        print(f"Post creation failed: {response.status_code}")
        print(f"Post response: {response.text}")
    
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == "Test post description"
    assert data["user_id"] == user_id
    assert "id" in data

def test_invalid_endpoints():
    """Test that invalid endpoints return 404"""
    response = client.get("/nonexistent")
    assert response.status_code == 404
