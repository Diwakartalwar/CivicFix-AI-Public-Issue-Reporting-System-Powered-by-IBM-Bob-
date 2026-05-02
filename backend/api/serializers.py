"""
Serializers for CivicFix API
Handles request/response data validation and serialization
"""

from rest_framework import serializers
from .models import CivicIssue


class ClassifyIssueSerializer(serializers.Serializer):
    """Serializer for issue classification request"""
    issueDescription = serializers.CharField(
        required=True,
        min_length=10,
        max_length=2000,
        help_text="Description of the civic issue"
    )
    location = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=500,
        help_text="Location of the issue (optional)"
    )
    latitude = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=12,
        decimal_places=8,
        help_text="Latitude coordinate (optional)"
    )
    longitude = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=12,
        decimal_places=8,
        help_text="Longitude coordinate (optional)"
    )


class ClassificationResponseSerializer(serializers.Serializer):
    """Serializer for classification response"""
    category = serializers.CharField()
    severity = serializers.CharField()
    urgency = serializers.CharField()
    authority = serializers.DictField()
    reasoning = serializers.CharField()


class GenerateComplaintSerializer(serializers.Serializer):
    """Serializer for complaint generation request"""
    issueDescription = serializers.CharField(
        required=True,
        min_length=10,
        max_length=2000
    )
    location = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=500
    )
    latitude = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=12,
        decimal_places=8
    )
    longitude = serializers.DecimalField(
        required=False,
        allow_null=True,
        max_digits=12,
        decimal_places=8
    )
    classification = serializers.DictField(required=False)


class ComplaintResponseSerializer(serializers.Serializer):
    """Serializer for complaint generation response"""
    formattedComplaint = serializers.CharField()
    issueId = serializers.IntegerField()


class ImproveComplaintSerializer(serializers.Serializer):
    """Serializer for complaint improvement request"""
    complaint = serializers.CharField(
        required=True,
        min_length=50,
        max_length=5000,
        help_text="Original complaint text"
    )
    improvementTypes = serializers.ListField(
        child=serializers.CharField(),
        required=True,
        min_length=1,
        help_text="List of improvement types to apply"
    )


class ImprovedComplaintResponseSerializer(serializers.Serializer):
    """Serializer for improved complaint response"""
    improvedComplaint = serializers.CharField()


class CivicIssueSerializer(serializers.ModelSerializer):
    """Serializer for CivicIssue model"""
    age_in_days = serializers.ReadOnlyField()
    has_location_coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = CivicIssue
        fields = [
            'id',
            'issue_description',
            'location',
            'latitude',
            'longitude',
            'category',
            'severity',
            'urgency',
            'reasoning',
            'formatted_complaint',
            'authority_department',
            'authority_jurisdiction',
            'authority_contact',
            'status',
            'created_at',
            'updated_at',
            'view_count',
            'vote_count',
            'verification_score',
            'is_verified',
            'escalation_level',
            'escalated_at',
            'age_in_days',
            'has_location_coordinates'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'view_count']


class CivicIssueListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing issues"""
    age_in_days = serializers.ReadOnlyField()
    has_location_coordinates = serializers.ReadOnlyField()
    
    class Meta:
        model = CivicIssue
        fields = [
            'id',
            'issue_description',
            'location',
            'latitude',
            'longitude',
            'category',
            'severity',
            'urgency',
            'authority_department',
            'status',
            'created_at',
            'view_count',
            'vote_count',
            'is_verified',
            'escalation_level',
            'age_in_days',
            'has_location_coordinates'
        ]


class ErrorResponseSerializer(serializers.Serializer):
    """Serializer for error responses"""
    error = serializers.CharField()
    detail = serializers.CharField(required=False)

# Made with Bob
