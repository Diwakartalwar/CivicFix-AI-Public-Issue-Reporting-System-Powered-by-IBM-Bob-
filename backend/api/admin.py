from django.contrib import admin
from .models import CivicIssue


@admin.register(CivicIssue)
class CivicIssueAdmin(admin.ModelAdmin):
    """
    Admin interface for CivicIssue model
    """
    list_display = [
        'id',
        'category',
        'severity',
        'urgency',
        'location',
        'status',
        'created_at',
        'view_count'
    ]
    
    list_filter = [
        'category',
        'severity',
        'urgency',
        'status',
        'created_at'
    ]
    
    search_fields = [
        'issue_description',
        'location',
        'formatted_complaint'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'view_count',
        'age_in_days'
    ]
    
    fieldsets = (
        ('Issue Information', {
            'fields': ('issue_description', 'location', 'latitude', 'longitude')
        }),
        ('AI Classification', {
            'fields': ('category', 'severity', 'urgency', 'reasoning')
        }),
        ('Generated Complaint', {
            'fields': ('formatted_complaint',)
        }),
        ('Authority Information', {
            'fields': ('authority_department', 'authority_jurisdiction', 'authority_contact')
        }),
        ('Status & Metadata', {
            'fields': ('status', 'view_count', 'created_at', 'updated_at', 'age_in_days')
        }),
    )
    
    ordering = ['-created_at']
    
    def age_in_days(self, obj):
        return f"{obj.age_in_days} days"
    age_in_days.short_description = 'Age'

# Made with Bob
