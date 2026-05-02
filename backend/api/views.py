"""
API Views for CivicFix
Handles all API endpoints for classification, generation, and improvement
"""

import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import CivicIssue
from .serializers import (
    ClassifyIssueSerializer,
    GenerateComplaintSerializer,
    ImproveComplaintSerializer,
    CivicIssueSerializer,
    CivicIssueListSerializer
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
    Generate a formal complaint document and save to database
    
    POST /api/generate
    Request body:
    {
        "issueDescription": "string",
        "location": "string (optional)",
        "latitude": "decimal (optional)",
        "longitude": "decimal (optional)",
        "classification": {
            "category": "string",
            "severity": "string",
            "urgency": "string",
            "reasoning": "string",
            "authority": {
                "department": "string",
                "jurisdiction": "string",
                "contact": "string"
            }
        }
    }
    
    Response:
    {
        "formattedComplaint": "string",
        "issueId": integer
    }
    """
    try:
        # Log incoming request for debugging
        logger.info(f"Received generate request with data keys: {request.data.keys()}")
        logger.info(f"Issue description length: {len(request.data.get('issueDescription', ''))}")
        logger.info(f"Has classification: {'classification' in request.data}")
        
        # Validate request data
        serializer = GenerateComplaintSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(
                {"error": "Invalid request data", "detail": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        issue_description = serializer.validated_data['issueDescription']
        location = serializer.validated_data.get('location', '')
        latitude = serializer.validated_data.get('latitude')
        longitude = serializer.validated_data.get('longitude')
        classification = serializer.validated_data.get('classification')
        if not classification:
            # Backward compatibility for clients that send classification fields at top-level
            classification = {
                "category": request.data.get('category', 'Other'),
                "severity": request.data.get('severity', 'medium'),
                "urgency": request.data.get('urgency', 'medium'),
                "reasoning": request.data.get('reasoning', ''),
                "authority": request.data.get('authority', {})
            }
        
        # Extract classification details
        category = classification.get('category', 'Other')
        severity = classification.get('severity', 'medium')
        urgency = classification.get('urgency', 'medium')
        reasoning = classification.get('reasoning', '')
        authority = classification.get('authority', {})
        
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
        
        # Save to database
        civic_issue = CivicIssue.objects.create(
            issue_description=issue_description,
            location=location,
            latitude=latitude,
            longitude=longitude,
            category=category,
            severity=severity,
            urgency=urgency,
            reasoning=reasoning,
            formatted_complaint=formatted_complaint,
            authority_department=authority.get('department', ''),
            authority_jurisdiction=authority.get('jurisdiction', ''),
            authority_contact=authority.get('contact', ''),
            status='pending'
        )
        
        # Prepare response
        response_data = {
            "formattedComplaint": formatted_complaint,
            "issueId": civic_issue.id
        }
        
        logger.info(f"Successfully generated and saved complaint with ID {civic_issue.id}")
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

@api_view(['POST'])
def vote_issue(request, issue_id):
    """Vote/upvote an issue"""
    try:
        issue = CivicIssue.objects.get(id=issue_id)
        issue.vote_count += 1
        issue.save(update_fields=['vote_count'])
        return Response({"vote_count": issue.vote_count}, status=status.HTTP_200_OK)
    except CivicIssue.DoesNotExist:
        return Response({"error": "Issue not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_issue(request, issue_id):
    """Calculate and update verification score"""
    from .clustering import haversine_distance
    try:
        issue = CivicIssue.objects.get(id=issue_id)
        score = 0
        
        # Has GPS coordinates (+20)
        if issue.latitude and issue.longitude:
            score += 20
            # Check nearby similar issues (+30)
            nearby = CivicIssue.objects.filter(category=issue.category).exclude(id=issue.id)
            for other in nearby:
                if other.latitude and other.longitude:
                    dist = haversine_distance(issue.latitude, issue.longitude, other.latitude, other.longitude)
                    if dist < 1000:  # Within 1km
                        score += 30
                        break
        
        # High severity (+20)
        if issue.severity in ['high', 'critical']:
            score += 20
        
        # Age factor (+30 if recent)
        if issue.age_in_days < 7:
            score += 30
        
        issue.verification_score = min(score, 100)
        issue.is_verified = score >= 50
        issue.save(update_fields=['verification_score', 'is_verified'])
        
        return Response({
            "verification_score": issue.verification_score,
            "is_verified": issue.is_verified
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def check_escalation(request, issue_id):
    """Check and update escalation level"""
    try:
        issue = CivicIssue.objects.get(id=issue_id)
        
        # Escalation logic
        if issue.status == 'resolved':
            return Response({"message": "Issue already resolved"}, status=status.HTTP_200_OK)
        
        should_escalate = False
        new_level = issue.escalation_level
        
        # Emergency: critical + high votes
        if issue.severity == 'critical' and issue.vote_count > 20:
            new_level = 'emergency'
            should_escalate = True
        # City: pending >7 days or high severity + votes
        elif issue.age_in_days > 7 or (issue.severity == 'high' and issue.vote_count > 10):
            new_level = 'city' if issue.escalation_level == 'ward' else issue.escalation_level
            should_escalate = new_level != issue.escalation_level
        
        if should_escalate:
            issue.escalation_level = new_level
            issue.escalated_at = timezone.now()
            issue.save(update_fields=['escalation_level', 'escalated_at'])
        
        return Response({
            "escalation_level": issue.escalation_level,
            "escalated": should_escalate
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_issue_clusters(request):
    """
    Get clustered issues for map visualization
    
    GET /api/clusters?radius=500
    
    Query Parameters:
    - radius: Clustering radius in meters (default: 500)
    """
    from .clustering import cluster_issues
    from .models import CivicIssue
    
    try:
        radius = int(request.GET.get('radius', 500))
        issues = CivicIssue.objects.all()
        clusters = cluster_issues(issues, radius)
        
        return Response(clusters, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_issue_clusters: {str(e)}")
        return Response(
            {"error": "Failed to cluster issues", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_heatmap_data(request):
    """
    Get heatmap data for visualization
    
    GET /api/heatmap
    
    Returns array of [lat, lng, intensity] for heatmap layer
    """
    from .clustering import get_heatmap_data
    from .models import CivicIssue
    
    try:
        issues = CivicIssue.objects.all()
        heatmap_data = get_heatmap_data(issues)
        
        return Response(heatmap_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error in get_heatmap_data: {str(e)}")
        return Response(
            {"error": "Failed to generate heatmap data", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_community_issues(request):
    """
    Get all community issues with optional filtering
    
    GET /api/issues?category=Sanitation&severity=high&status=pending
    
    Query Parameters:
    - category: Filter by category
    - severity: Filter by severity
    - status: Filter by status
    - search: Search in description and location
    """
    try:
        issues = CivicIssue.objects.all()
        
        # Apply filters
        category = request.GET.get('category')
        if category:
            issues = issues.filter(category=category)
        
        severity = request.GET.get('severity')
        if severity:
            issues = issues.filter(severity=severity)
        
        status_filter = request.GET.get('status')
        if status_filter:
            issues = issues.filter(status=status_filter)
        
        search = request.GET.get('search')
        if search:
            issues = issues.filter(
                Q(issue_description__icontains=search) |
                Q(location__icontains=search)
            )
        
        # Serialize and return
        serializer = CivicIssueListSerializer(issues, many=True)
        
        return Response({
            "count": issues.count(),
            "issues": serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_community_issues: {str(e)}")
        return Response(
            {"error": "Failed to retrieve issues", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_issue_detail(request, issue_id):
    """
    Get detailed information about a specific issue
    
    GET /api/issues/{id}
    """
    try:
        issue = CivicIssue.objects.get(id=issue_id)
        
        # Increment view count
        issue.increment_view_count()
        
        # Serialize and return
        serializer = CivicIssueSerializer(issue)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except CivicIssue.DoesNotExist:
        return Response(
            {"error": "Issue not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error in get_issue_detail: {str(e)}")
        return Response(
            {"error": "Failed to retrieve issue", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_issue_stats(request):
    """
    Get statistics about community issues
    
    GET /api/issues/stats
    """
    try:
        total_issues = CivicIssue.objects.count()
        
        # Count by category
        categories = CivicIssue.objects.values('category').distinct()
        category_counts = {}
        for cat in categories:
            category_counts[cat['category']] = CivicIssue.objects.filter(
                category=cat['category']
            ).count()
        
        # Count by severity
        severity_counts = {
            'low': CivicIssue.objects.filter(severity='low').count(),
            'medium': CivicIssue.objects.filter(severity='medium').count(),
            'high': CivicIssue.objects.filter(severity='high').count(),
            'critical': CivicIssue.objects.filter(severity='critical').count(),
        }
        
        # Count by status
        status_counts = {
            'pending': CivicIssue.objects.filter(status='pending').count(),
            'in_progress': CivicIssue.objects.filter(status='in_progress').count(),
            'resolved': CivicIssue.objects.filter(status='resolved').count(),
            'rejected': CivicIssue.objects.filter(status='rejected').count(),
        }
        
        return Response({
            "total_issues": total_issues,
            "by_category": category_counts,
            "by_severity": severity_counts,
            "by_status": status_counts
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error in get_issue_stats: {str(e)}")
        return Response(
            {"error": "Failed to retrieve statistics", "detail": str(e)},
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
