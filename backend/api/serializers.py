"""
Serializers for CivicFix API
Handles request/response data validation and serialization
"""

from rest_framework import serializers


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
    classification = serializers.DictField(required=True)


class ComplaintResponseSerializer(serializers.Serializer):
    """Serializer for complaint generation response"""
    formattedComplaint = serializers.CharField()


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


class ErrorResponseSerializer(serializers.Serializer):
    """Serializer for error responses"""
    error = serializers.CharField()
    detail = serializers.CharField(required=False)

# Made with Bob
