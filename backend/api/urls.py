"""
URL Configuration for CivicFix API
"""

from django.urls import path
from . import views

urlpatterns = [
    path('classify', views.classify_issue, name='classify_issue'),
    path('generate', views.generate_complaint, name='generate_complaint'),
    path('improve', views.improve_complaint, name='improve_complaint'),
    path('health', views.health_check, name='health_check'),
]

# Made with Bob
