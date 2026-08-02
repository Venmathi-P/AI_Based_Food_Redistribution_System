from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_inventory_flow():
    response = client.post('/inventory', json={
        'name': 'Rice Bags',
        'quantity': 50,
        'expiry_date': '2026-12-31',
        'owner': 'Business A'
    })
    assert response.status_code == 200
    data = response.json()
    assert data['name'] == 'Rice Bags'

    list_response = client.get('/inventory')
    assert list_response.status_code == 200
    assert any(item['name'] == 'Rice Bags' for item in list_response.json())


def test_donation_flow():
    response = client.post('/donations', json={
        'name': 'Vegetables',
        'quantity': 20,
        'donor': 'Business A',
        'status': 'available'
    })
    assert response.status_code == 200
    assert response.json()['name'] == 'Vegetables'

    list_response = client.get('/donations')
    assert list_response.status_code == 200
    assert any(item['name'] == 'Vegetables' for item in list_response.json())
