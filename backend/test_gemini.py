"""
Quick test script to verify Gemini API is working
Run with: python test_gemini.py
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'civicfix_api.settings')
django.setup()

from api.ai_service import get_ai_service
from api.prompts import get_classification_prompt

def test_gemini():
    print("=" * 60)
    print("Testing Gemini API Connection")
    print("=" * 60)
    
    try:
        # Initialize service
        print("\n1. Initializing Gemini service...")
        ai_service = get_ai_service()
        print("✅ Gemini service initialized successfully!")
        
        # Test simple generation
        print("\n2. Testing simple text generation...")
        simple_response = ai_service.generate_text("Say 'Hello from Gemini!' in one sentence.")
        print(f"✅ Response: {simple_response}")
        
        # Test classification
        print("\n3. Testing issue classification...")
        test_issue = "There is a large pothole on Main Street causing traffic problems"
        test_location = "Main Street, Downtown"
        
        prompt = get_classification_prompt(test_issue, test_location)
        print(f"Prompt length: {len(prompt)} characters")
        
        classification = ai_service.classify_issue(prompt)
        print(f"✅ Classification result:")
        print(f"   Category: {classification['category']}")
        print(f"   Severity: {classification['severity']}")
        print(f"   Urgency: {classification['urgency']}")
        print(f"   Reasoning: {classification['reasoning'][:100]}...")
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED! Gemini is working correctly!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check your GEMINI_API_KEY in backend/.env")
        print("2. Make sure it starts with 'AIza'")
        print("3. Verify you have internet connection")
        print("4. Check https://makersuite.google.com/app/apikey")
        return False
    
    return True

if __name__ == "__main__":
    success = test_gemini()
    sys.exit(0 if success else 1)

# Made with Bob
