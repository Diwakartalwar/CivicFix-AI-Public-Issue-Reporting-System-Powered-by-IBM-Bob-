"""
URL Configuration for CivicFix API
"""

from django.urls import path
from . import views

urlpatterns = [
    # Original endpoints
    path('classify', views.classify_issue, name='classify_issue'),
    path('generate', views.generate_complaint, name='generate_complaint'),
    path('improve', views.improve_complaint, name='improve_complaint'),
    
    # Community issues endpoints
    path('issues', views.get_community_issues, name='get_community_issues'),
    path('issues/<int:issue_id>', views.get_issue_detail, name='get_issue_detail'),
    path('issues/stats', views.get_issue_stats, name='get_issue_stats'),
    
    # Health check
    path('health', views.health_check, name='health_check'),
]

# Made with Bob
