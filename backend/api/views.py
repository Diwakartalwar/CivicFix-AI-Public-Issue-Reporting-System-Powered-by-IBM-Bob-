"""
API Views for CivicFix
Handles all API endpoints for classification, generation, and improvement
"""

import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    ClassifyIssueSerializer,
    GenerateComplaintSerializer,
    ImproveComplaintSerializer
)
from .ai_service import get_ai_service
from .prompts import (
    get_classification_prompt,
    get_generation_prompt,
    get_improvement_prompt,
    get_authority_info
)

logger = logging.getLogger(__name__)


@api_view(['POST'])
def classify_issue(request):
    """
    Classify a civic issue
    
    POST /api/classify
    Request body:
    {
        "issueDescription": "string",
        "location": "string (optional)"
    }
    
    Response:
    {
        "category": "string",
        "severity": "string",
        "urgency": "string",
        "authority": {
            "department": "string",
            "jurisdiction": "string",
            "contact": "string"
        },
        "reasoning": "string"
    }
    """
    try:
        # Validate request data
        serializer = ClassifyIssueSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid request data", "detail": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        issue_description = serializer.validated_data['issueDescription']
        location = serializer.validated_data.get('location', '')
        
        # Generate classification prompt
        prompt = get_classification_prompt(issue_description, location)
        
        # Get AI service and classify
        ai_service = get_ai_service()
        classification = ai_service.classify_issue(prompt)
        
        # Get authority information based on category
        authority = get_authority_info(classification['category'])
        
        # Prepare response
        response_data = {
            "category": classification['category'],
            "severity": classification['severity'],
            "urgency": classification['urgency'],
            "authority": authority,
            "reasoning": classification['reasoning']
        }
        
        logger.info(f"Successfully classified issue as {classification['category']}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in classify_issue: {str(e)}")
        return Response(
            {"error": "Failed to classify issue", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_complaint(request):
    """
    Generate a formal complaint document
    
    POST /api/generate
    Request body:
    {
        "issueDescription": "string",
        "location": "string (optional)",
        "classification": {
            "category": "string",
            "severity": "string",
            "urgency": "string"
        }
    }
    
    Response:
    {
        "formattedComplaint": "string"
    }
    """
    try:
        # Validate request data
        serializer = GenerateComplaintSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid request data", "detail": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        issue_description = serializer.validated_data['issueDescription']
        location = serializer.validated_data.get('location', '')
        classification = serializer.validated_data['classification']
        
        # Extract classification details
        category = classification.get('category', 'Other')
        severity = classification.get('severity', 'medium')
        urgency = classification.get('urgency', 'medium')
        
        # Generate complaint prompt
        prompt = get_generation_prompt(
            issue_description,
            location,
            category,
            severity,
            urgency
        )
        
        # Get AI service and generate complaint
        ai_service = get_ai_service()
        formatted_complaint = ai_service.generate_complaint(prompt)
        
        # Prepare response
        response_data = {
            "formattedComplaint": formatted_complaint
        }
        
        logger.info("Successfully generated complaint")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in generate_complaint: {str(e)}")
        return Response(
            {"error": "Failed to generate complaint", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def improve_complaint(request):
    """
    Improve an existing complaint
    
    POST /api/improve
    Request body:
    {
        "complaint": "string",
        "improvementTypes": ["string", ...]
    }
    
    Response:
    {
        "improvedComplaint": "string"
    }
    """
    try:
        # Validate request data
        serializer = ImproveComplaintSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid request data", "detail": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        original_complaint = serializer.validated_data['complaint']
        improvement_types = serializer.validated_data['improvementTypes']
        
        # Generate improvement prompt
        prompt = get_improvement_prompt(original_complaint, improvement_types)
        
        # Get AI service and improve complaint
        ai_service = get_ai_service()
        improved_complaint = ai_service.improve_complaint(prompt)
        
        # Prepare response
        response_data = {
            "improvedComplaint": improved_complaint
        }
        
        logger.info(f"Successfully improved complaint with {len(improvement_types)} improvements")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in improve_complaint: {str(e)}")
        return Response(
            {"error": "Failed to improve complaint", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint
    
    GET /api/health
    """
    return Response(
        {"status": "healthy", "service": "CivicFix API"},
        status=status.HTTP_200_OK
    )

# Made with Bob
