"""
Issue Clustering Algorithm
Groups nearby issues within specified radius
"""
from math import radians, cos, sin, asin, sqrt
from collections import defaultdict


def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two GPS coordinates in meters"""
    lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371000  # Earth radius in meters
    return c * r


def cluster_issues(issues, radius_meters=500):
    """
    Cluster issues within radius_meters of each other
    Returns list of clusters with representative issue and count
    """
    if not issues:
        return []
    
    # Filter issues with coordinates
    valid_issues = [
        i for i in issues
        if i.latitude is not None and i.longitude is not None
    ]
    if not valid_issues:
        return []
    
    clusters = []
    used = set()
    
    for i, issue in enumerate(valid_issues):
        if i in used:
            continue
            
        cluster = {
            'id': issue.id,
            'latitude': float(issue.latitude),
            'longitude': float(issue.longitude),
            'category': issue.category,
            'severity': issue.severity,
            'location': issue.location,
            'count': 1,
            'issue_ids': [issue.id]
        }
        used.add(i)
        
        # Find nearby issues
        for j, other in enumerate(valid_issues[i+1:], start=i+1):
            if j in used:
                continue
                
            distance = haversine_distance(
                issue.latitude, issue.longitude,
                other.latitude, other.longitude
            )
            
            if distance <= radius_meters:
                cluster['count'] += 1
                cluster['issue_ids'].append(other.id)
                used.add(j)
        
        clusters.append(cluster)
    
    return clusters


def get_heatmap_data(issues):
    """
    Generate heatmap data points from issues
    Returns list of [lat, lng, intensity] for heatmap visualization
    """
    heatmap_data = []
    
    for issue in issues:
        if issue.latitude is not None and issue.longitude is not None:
            # Intensity based on severity
            intensity_map = {
                'low': 0.3,
                'medium': 0.6,
                'high': 0.8,
                'critical': 1.0
            }
            intensity = intensity_map.get(issue.severity, 0.5)
            
            heatmap_data.append([
                float(issue.latitude),
                float(issue.longitude),
                intensity
            ])
    
    return heatmap_data

# Made with Bob
