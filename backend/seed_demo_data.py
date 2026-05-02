import os
import sys
import django
from datetime import timedelta
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'civicfix_api.settings')
sys.path.insert(0, os.path.dirname(__file__))
django.setup()

from django.utils import timezone
from api.models import CivicIssue

# Indian cities with coordinates
CITIES = {
    'Bangalore': {'lat': 12.9716, 'lng': 77.5946},
    'Delhi': {'lat': 28.7041, 'lng': 77.1025},
    'Mumbai': {'lat': 19.0760, 'lng': 72.8777},
    'Chennai': {'lat': 13.0827, 'lng': 80.2707},
    'Hyderabad': {'lat': 17.3850, 'lng': 78.4867},
}

DEMO_ISSUES = [
    # Sanitation
    {"desc": "Garbage accumulation near bus stop for past week", "cat": "Sanitation", "sev": "high", "urg": "high", "loc": "MG Road"},
    {"desc": "Overflowing dustbins attracting stray dogs", "cat": "Sanitation", "sev": "medium", "urg": "medium", "loc": "Indiranagar"},
    {"desc": "Illegal dumping of construction waste", "cat": "Sanitation", "sev": "critical", "urg": "immediate", "loc": "Whitefield"},
    {"desc": "Public toilet not cleaned for days", "cat": "Sanitation", "sev": "high", "urg": "high", "loc": "Koramangala"},
    {"desc": "Plastic waste blocking drainage", "cat": "Sanitation", "sev": "medium", "urg": "medium", "loc": "HSR Layout"},
    
    # Road Infrastructure
    {"desc": "Large pothole causing accidents on main road", "cat": "Road Infrastructure", "sev": "critical", "urg": "immediate", "loc": "Outer Ring Road"},
    {"desc": "Road cracks spreading near school zone", "cat": "Road Infrastructure", "sev": "high", "urg": "high", "loc": "Jayanagar"},
    {"desc": "Uneven road surface after recent digging", "cat": "Road Infrastructure", "sev": "medium", "urg": "medium", "loc": "Marathahalli"},
    {"desc": "Missing speed breaker near hospital", "cat": "Road Infrastructure", "sev": "high", "urg": "immediate", "loc": "Bannerghatta Road"},
    {"desc": "Road subsidence after heavy rain", "cat": "Road Infrastructure", "sev": "critical", "urg": "immediate", "loc": "Electronic City"},
    
    # Water Supply
    {"desc": "Water leakage from main pipeline wasting water", "cat": "Water Supply", "sev": "high", "urg": "immediate", "loc": "Malleshwaram"},
    {"desc": "No water supply for 3 days in residential area", "cat": "Water Supply", "sev": "critical", "urg": "immediate", "loc": "Yelahanka"},
    {"desc": "Contaminated water supply causing health issues", "cat": "Water Supply", "sev": "critical", "urg": "immediate", "loc": "BTM Layout"},
    {"desc": "Broken water meter leaking continuously", "cat": "Water Supply", "sev": "medium", "urg": "high", "loc": "Rajajinagar"},
    {"desc": "Low water pressure in apartment complex", "cat": "Water Supply", "sev": "medium", "urg": "medium", "loc": "Bellandur"},
    
    # Electricity
    {"desc": "Frequent power cuts disrupting work from home", "cat": "Electricity", "sev": "high", "urg": "high", "loc": "Sarjapur Road"},
    {"desc": "Exposed electrical wires near children's park", "cat": "Electricity", "sev": "critical", "urg": "immediate", "loc": "JP Nagar"},
    {"desc": "Transformer making loud buzzing noise", "cat": "Electricity", "sev": "medium", "urg": "high", "loc": "Vijayanagar"},
    {"desc": "Street lights not working for 2 weeks", "cat": "Electricity", "sev": "high", "urg": "high", "loc": "Hebbal"},
    {"desc": "Voltage fluctuation damaging appliances", "cat": "Electricity", "sev": "high", "urg": "immediate", "loc": "Kalyan Nagar"},
    
    # Drainage
    {"desc": "Blocked drainage causing waterlogging", "cat": "Drainage", "sev": "high", "urg": "immediate", "loc": "Cunningham Road"},
    {"desc": "Open manhole without cover near school", "cat": "Drainage", "sev": "critical", "urg": "immediate", "loc": "Basavanagudi"},
    {"desc": "Sewage overflow on residential street", "cat": "Drainage", "sev": "critical", "urg": "immediate", "loc": "RT Nagar"},
    {"desc": "Stagnant water breeding mosquitoes", "cat": "Drainage", "sev": "high", "urg": "high", "loc": "Nagarbhavi"},
    {"desc": "Drainage grill broken and dangerous", "cat": "Drainage", "sev": "medium", "urg": "high", "loc": "Yeshwanthpur"},
    
    # Public Safety
    {"desc": "Broken footpath causing pedestrian injuries", "cat": "Public Safety", "sev": "high", "urg": "high", "loc": "Brigade Road"},
    {"desc": "Stray dogs attacking residents at night", "cat": "Public Safety", "sev": "high", "urg": "immediate", "loc": "Banashankari"},
    {"desc": "Illegal parking blocking emergency access", "cat": "Public Safety", "sev": "medium", "urg": "high", "loc": "Commercial Street"},
    {"desc": "Missing traffic signal at busy junction", "cat": "Public Safety", "sev": "critical", "urg": "immediate", "loc": "Silk Board"},
    {"desc": "Broken railing on flyover", "cat": "Public Safety", "sev": "critical", "urg": "immediate", "loc": "Hosur Road"},
]

def generate_coordinates(city_name, offset_km=5):
    from decimal import Decimal
    city = CITIES[city_name]
    lat_offset = (random.random() - 0.5) * (offset_km / 111)
    lng_offset = (random.random() - 0.5) * (offset_km / 111)
    lat = Decimal(str(round(city['lat'] + lat_offset, 6))).quantize(Decimal('0.000001'))
    lng = Decimal(str(round(city['lng'] + lng_offset, 6))).quantize(Decimal('0.000001'))
    return lat, lng

def generate_complaint(issue):
    return f"""Subject: Urgent Attention Required - {issue['cat']} Issue

Dear Sir/Madam,

I am writing to bring to your immediate attention a serious {issue['cat'].lower()} issue in our locality.

Issue Description:
{issue['desc']}

Location: {issue['loc']}

This issue is causing significant inconvenience to residents and requires urgent intervention. I request you to kindly take necessary action at the earliest.

Thank you for your attention to this matter.

Regards,
Concerned Citizen"""

print("Seeding demo data...")
CivicIssue.objects.all().delete()

cities = list(CITIES.keys())
statuses = ['pending', 'in_progress', 'resolved']
status_weights = [0.5, 0.3, 0.2]

for i, issue in enumerate(DEMO_ISSUES):
    city = random.choice(cities)
    lat, lng = generate_coordinates(city)
    days_ago = random.randint(1, 30)
    created = timezone.now() - timedelta(days=days_ago)
    
    status = random.choices(statuses, weights=status_weights)[0]
    
    # Calculate verification score
    verification_score = 20  # Has GPS
    if issue['sev'] in ['high', 'critical']:
        verification_score += 20
    if days_ago < 7:
        verification_score += 30
    verification_score += random.randint(0, 30)  # Nearby issues simulation
    
    obj = CivicIssue(
        issue_description=issue['desc'],
        location=f"{issue['loc']}, {city}",
        category=issue['cat'],
        severity=issue['sev'],
        urgency=issue['urg'],
        reasoning=f"Classified as {issue['cat']} with {issue['sev']} severity",
        formatted_complaint=generate_complaint(issue),
        authority_department=f"{issue['cat']} Department",
        authority_jurisdiction=f"{city} Municipal Corporation",
        authority_contact="Ward Officer",
        status=status,
        created_at=created,
        updated_at=created,
        view_count=random.randint(5, 50),
        vote_count=random.randint(0, 25),
        verification_score=min(verification_score, 100),
        is_verified=verification_score >= 50,
        escalation_level='city' if (days_ago > 7 or issue['sev'] == 'critical') else 'ward'
    )
    obj.latitude = lat
    obj.longitude = lng
    obj.save()
    CivicIssue.objects.filter(id=obj.id).update(
        created_at=created,
        updated_at=created
    )
    print(f"Created issue {i+1}/{len(DEMO_ISSUES)}: {issue['desc'][:50]}...")

print(f"\nSuccessfully seeded {len(DEMO_ISSUES)} demo issues!")
print(f"Cities covered: {', '.join(cities)}")
print(f"Status distribution: {dict(zip(statuses, [int(w*len(DEMO_ISSUES)) for w in status_weights]))}")

# Made with Bob
