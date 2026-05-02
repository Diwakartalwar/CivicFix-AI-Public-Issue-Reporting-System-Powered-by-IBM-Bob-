"""
AI Prompt Templates for CivicFix
Contains structured prompts for classification, complaint generation, and improvement
"""

def get_classification_prompt(issue_description, location):
    """
    Generate prompt for classifying civic issues
    """
    return f"""You are an AI assistant that classifies civic issues for government reporting.

Analyze the following civic issue and provide a structured classification:

Issue: {issue_description}
Location: {location if location else "Not specified"}

Classify this issue into ONE of these categories:
- Sanitation (garbage, waste management, cleanliness)
- Road Infrastructure (potholes, road damage, broken roads)
- Water Supply (leakage, broken pipes, water shortage)
- Electricity (power outage, streetlight issues, electrical problems)
- Drainage (blocked drains, flooding, sewage)
- Public Safety (illegal construction, noise pollution, safety hazards)
- Other (any other civic issue)

Assess severity level: low, medium, high, critical
Determine urgency: low, medium, high, immediate

IMPORTANT: Respond with ONLY a JSON object, no other text. Use this exact format:
{{
  "category": "Sanitation",
  "severity": "high",
  "urgency": "medium",
  "reasoning": "brief explanation here"
}}

Do not include any markdown formatting, code blocks, or explanatory text. Just the JSON object."""


def get_generation_prompt(issue_description, location, category, severity, urgency, language='English'):
    """
    Generate prompt for creating formal complaint
    """
    location_text = f"Location: {location}" if location else "Location: [Please specify]"
    target_language = language or 'English'
    
    return f"""You are an expert in writing formal government complaints.

Create a professional, well-structured complaint letter based on:

Issue: {issue_description}
{location_text}
Category: {category}
Severity: {severity}
Urgency: {urgency}
Target language: {target_language}

The complaint should:
1. Use formal government correspondence format
2. Include proper salutation and subject line
3. Clearly state the problem with specific details
4. Mention the location explicitly
5. Request appropriate action
6. Use respectful, professional language
7. Be concise but comprehensive (200-300 words)
8. Include proper closing
9. Write the complete complaint in {target_language}. Keep official department names understandable and do not add facts that were not provided.

Generate the complete complaint letter now:"""


def get_improvement_prompt(original_complaint, improvement_types):
    """
    Generate prompt for improving existing complaint
    """
    improvements_map = {
        'make_formal': 'Make the language more formal and official',
        'add_urgency': 'Emphasize the urgency and time-sensitive nature of the issue',
        'reference_rights': 'Include references to citizen rights and government responsibilities',
        'add_legal': 'Add relevant legal or policy references',
        'strengthen_language': 'Use stronger, more assertive language while remaining respectful',
        'add_consequences': 'Mention potential consequences if the issue is not addressed'
    }
    
    improvement_instructions = []
    for imp_type in improvement_types:
        if imp_type in improvements_map:
            improvement_instructions.append(f"- {improvements_map[imp_type]}")
    
    instructions_text = "\n".join(improvement_instructions)
    
    return f"""You are an expert in enhancing government complaints.

Original Complaint:
{original_complaint}

Improvement Instructions:
{instructions_text}

Enhance the complaint by applying the above improvements while:
1. Maintaining the original structure and facts
2. Keeping the complaint professional and actionable
3. Ensuring all details remain accurate
4. Preserving the respectful tone
5. Making it more likely to receive prompt attention
6. Preserving the original complaint language unless the user explicitly asked otherwise

Generate the improved complaint now:"""


# Authority mapping for different issue categories
AUTHORITY_MAP = {
    "Sanitation": {
        "department": "Municipal Corporation - Sanitation Department",
        "jurisdiction": "Ward Office",
        "contact": "Ward Sanitation Officer",
        "typical_response_time": "3-5 days"
    },
    "Road Infrastructure": {
        "department": "Public Works Department (PWD)",
        "jurisdiction": "Municipal Corporation",
        "contact": "Executive Engineer - Roads",
        "typical_response_time": "7-14 days"
    },
    "Water Supply": {
        "department": "Water Board / Public Health Engineering",
        "jurisdiction": "Water Supply Division",
        "contact": "Assistant Engineer - Water Supply",
        "typical_response_time": "2-3 days for emergencies"
    },
    "Electricity": {
        "department": "Electricity Board / Power Distribution Company",
        "jurisdiction": "Local Sub-Division",
        "contact": "Sub-Divisional Officer (SDO)",
        "typical_response_time": "24-48 hours"
    },
    "Drainage": {
        "department": "Municipal Corporation - Drainage Department",
        "jurisdiction": "Ward Office",
        "contact": "Drainage Inspector",
        "typical_response_time": "3-7 days"
    },
    "Public Safety": {
        "department": "Municipal Corporation / Local Police",
        "jurisdiction": "Ward Office / Police Station",
        "contact": "Ward Officer / Station House Officer",
        "typical_response_time": "Immediate for emergencies"
    },
    "Other": {
        "department": "Municipal Corporation - General Administration",
        "jurisdiction": "Ward Office",
        "contact": "Ward Officer",
        "typical_response_time": "5-10 days"
    }
}


def get_authority_info(category):
    """
    Get authority information for a given category
    """
    return AUTHORITY_MAP.get(category, AUTHORITY_MAP["Other"])

# Made with Bob
