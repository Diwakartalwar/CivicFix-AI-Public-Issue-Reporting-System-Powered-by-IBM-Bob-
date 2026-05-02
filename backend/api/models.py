from django.db import models
from django.utils import timezone


class CivicIssue(models.Model):
    """
    Model to store civic issues reported by anonymous users
    """
    
    # Status choices
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    ]
    
    # User Input
    issue_description = models.TextField(
        help_text="Description of the civic issue"
    )
    location = models.CharField(
        max_length=500,
        blank=True,
        help_text="Location of the issue"
    )
    
    # Geolocation data (for map view)
    latitude = models.FloatField(null=True, blank=True,help_text="Latitude coordinate (optional)")
    longitude = models.FloatField(null=True, blank=True,help_text="Longitude coordinate (optional)")

    
    # AI Classification Results
    category = models.CharField(
        max_length=100,
        help_text="Issue category (Sanitation, Road Infrastructure, etc.)"
    )
    severity = models.CharField(
        max_length=20,
        help_text="Severity level (low, medium, high, critical)"
    )
    urgency = models.CharField(
        max_length=20,
        help_text="Urgency level (low, medium, high, immediate)"
    )
    reasoning = models.TextField(
        help_text="AI reasoning for classification"
    )
    
    # Generated Complaint
    formatted_complaint = models.TextField(
        help_text="AI-generated formal complaint"
    )
    
    # Authority Information (stored as JSON)
    authority_department = models.CharField(
        max_length=200,
        help_text="Responsible department"
    )
    authority_jurisdiction = models.CharField(
        max_length=200,
        help_text="Jurisdiction area"
    )
    authority_contact = models.CharField(
        max_length=200,
        help_text="Contact person/office"
    )
    
    # Status and Metadata
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Current status of the issue"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When the issue was reported"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last update time"
    )
    
    # Community engagement (anonymous)
    view_count = models.IntegerField(
        default=0,
        help_text="Number of times this issue was viewed"
    )
    vote_count = models.IntegerField(
        default=0,
        help_text="Number of upvotes from community"
    )
    
    # Verification system
    verification_score = models.IntegerField(
        default=0,
        help_text="Trust score 0-100 based on multiple factors"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether issue is verified as legitimate"
    )
    
    # Escalation system
    escalation_level = models.CharField(
        max_length=20,
        default='ward',
        choices=[('ward', 'Ward'), ('city', 'City'), ('emergency', 'Emergency')],
        help_text="Current escalation level"
    )
    escalated_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When issue was escalated"
    )
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['category']),
            models.Index(fields=['severity']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.category} - {self.location or 'No location'} ({self.created_at.strftime('%Y-%m-%d')})"
    
    def increment_view_count(self):
        """Increment the view count"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    @property
    def has_location_coordinates(self):
        """Check if issue has valid coordinates"""
        return self.latitude is not None and self.longitude is not None
    
    @property
    def age_in_days(self):
        """Calculate how many days since the issue was reported"""
        return (timezone.now() - self.created_at).days

# Made with Bob
