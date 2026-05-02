import os
import sys
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'civicfix_api.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

BASE_URL = "http://localhost:8000"

def test_classify():
    print("\n=== TEST 1: CLASSIFY ENDPOINT ===")
    data = {
        "issueDescription": "Garbage piling up on street corner",
        "location": "MG Road, Bangalore"
    }
    try:
        r = requests.post(f"{BASE_URL}/api/classify", json=data)
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
        return r.json() if r.status_code == 200 else None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_classify_with_gps():
    print("\n=== TEST 2: CLASSIFY WITH GPS ===")
    data = {
        "issueDescription": "Pothole on main road",
        "location": "Church Street",
        "latitude": "12.97194",
        "longitude": "77.59369"
    }
    try:
        r = requests.post(f"{BASE_URL}/api/classify", json=data)
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
        return r.json() if r.status_code == 200 else None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_generate(classification):
    print("\n=== TEST 3: GENERATE COMPLAINT ===")
    if not classification:
        print("SKIPPED: No classification data")
        return None
    
    data = {
        "issueDescription": "Garbage piling up on street corner",
        "location": "MG Road, Bangalore",
        "classification": {
            "category": classification.get("category"),
            "severity": classification.get("severity"),
            "urgency": classification.get("urgency"),
            "reasoning": classification.get("reasoning", ""),
            "authority": classification.get("authority", {})
        }
    }
    try:
        r = requests.post(f"{BASE_URL}/api/generate", json=data)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            print(f"Response: {json.dumps(r.json(), indent=2)[:500]}...")
            return r.json()
        else:
            print(f"ERROR Response: {r.text}")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_generate_with_gps(classification):
    print("\n=== TEST 4: GENERATE WITH GPS ===")
    if not classification:
        print("SKIPPED: No classification data")
        return None
    
    data = {
        "issueDescription": "Pothole on main road",
        "location": "Church Street",
        "latitude": "12.97194",
        "longitude": "77.59369",
        "classification": {
            "category": classification.get("category"),
            "severity": classification.get("severity"),
            "urgency": classification.get("urgency"),
            "reasoning": classification.get("reasoning", ""),
            "authority": classification.get("authority", {})
        }
    }
    try:
        r = requests.post(f"{BASE_URL}/api/generate", json=data)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            print(f"Response: {json.dumps(r.json(), indent=2)[:500]}...")
            return r.json()
        else:
            print(f"ERROR Response: {r.text}")
            return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_improve(complaint):
    print("\n=== TEST 5: IMPROVE COMPLAINT ===")
    if not complaint:
        print("SKIPPED: No complaint data")
        return
    
    data = {
        "complaint": complaint.get("formattedComplaint", ""),
        "improvementTypes": ["make_formal", "add_urgency"]
    }
    try:
        r = requests.post(f"{BASE_URL}/api/improve", json=data)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            print(f"Response: {json.dumps(r.json(), indent=2)[:500]}...")
        else:
            print(f"ERROR Response: {r.text}")
    except Exception as e:
        print(f"ERROR: {e}")

def test_community():
    print("\n=== TEST 6: COMMUNITY ISSUES ===")
    try:
        r = requests.get(f"{BASE_URL}/api/issues")
        print(f"Status: {r.status_code}")
        if r.status_code != 200:
            print(f"ERROR Response: {r.text}")
            return
        data = r.json()
        issues = data.get("issues", [])
        print(f"Total issues: {data.get('count', 0)}")
        if issues:
            print(f"First issue: {json.dumps(issues[0], indent=2)}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    print("Starting comprehensive backend tests...")
    print("Make sure Django server is running on port 8000")
    
    # Test without GPS
    c1 = test_classify()
    g1 = test_generate(c1)
    test_improve(g1)
    
    # Test with GPS
    c2 = test_classify_with_gps()
    g2 = test_generate_with_gps(c2)
    
    # Test community
    test_community()
    
    print("\n=== TESTS COMPLETE ===")

# Made with Bob
