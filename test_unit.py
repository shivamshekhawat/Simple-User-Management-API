import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, get_db, Base
import tempfile
import os

# Create a temporary database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_register_user():
    """Test user registration"""
    response = client.post(
        "/register",
        json={"name": "Test User", "email": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data

def test_register_duplicate_email():
    """Test registration with duplicate email"""
    # First registration
    client.post(
        "/register",
        json={"name": "User 1", "email": "duplicate@example.com", "password": "password123"}
    )
    
    # Second registration with same email
    response = client.post(
        "/register",
        json={"name": "User 2", "email": "duplicate@example.com", "password": "password456"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_success():
    """Test successful login"""
    # Register user first
    client.post(
        "/register",
        json={"name": "Login User", "email": "login@example.com", "password": "loginpass123"}
    )
    
    # Login
    response = client.post(
        "/login",
        json={"email": "login@example.com", "password": "loginpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    response = client.post(
        "/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_get_profile_authenticated():
    """Test getting profile with authentication"""
    # Register and login
    register_response = client.post(
        "/register",
        json={"name": "Profile User", "email": "profile@example.com", "password": "profilepass123"}
    )
    user_id = register_response.json()["id"]
    
    login_response = client.post(
        "/login",
        json={"email": "profile@example.com", "password": "profilepass123"}
    )
    token = login_response.json()["access_token"]
    
    # Get profile
    response = client.get(
        f"/profile/{user_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "profile@example.com"
    assert data["name"] == "Profile User"

def test_get_profile_unauthenticated():
    """Test getting profile without authentication"""
    response = client.get("/profile/1")
    assert response.status_code == 403

def test_update_profile():
    """Test updating user profile"""
    # Register and login
    register_response = client.post(
        "/register",
        json={"name": "Update User", "email": "update@example.com", "password": "updatepass123"}
    )
    user_id = register_response.json()["id"]
    
    login_response = client.post(
        "/login",
        json={"email": "update@example.com", "password": "updatepass123"}
    )
    token = login_response.json()["access_token"]
    
    # Update profile
    response = client.put(
        f"/profile/{user_id}",
        json={"name": "Updated Name", "email": "updated@example.com"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["email"] == "updated@example.com"

def test_input_validation():
    """Test input validation"""
    response = client.post(
        "/register",
        json={"name": "", "email": "invalid-email", "password": "123"}
    )
    assert response.status_code == 422

# Run tests
if __name__ == "__main__":
    pytest.main([__file__])
