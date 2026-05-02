# CivicFix Backend Setup Instructions

## Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- IBM Cloud account with watsonx.ai access

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_ibm_cloud_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Django Configuration
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration (for React frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### How to Get IBM watsonx.ai Credentials:

1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Create a watsonx.ai service instance
3. Get your API key from IBM Cloud IAM
4. Get your Project ID from watsonx.ai project settings

## Step 3: Run Database Migrations

**IMPORTANT**: The type checking errors you see from basedpyright are NOT runtime errors. They are static type analysis warnings about Django's ORM patterns. Django uses dynamic Python features that type checkers can't always understand. These warnings are safe to ignore.

Run these commands to create the database tables:

```bash
# Create migration files for the CivicIssue model
python manage.py makemigrations

# Apply migrations to create database tables
python manage.py migrate
```

Expected output:
```
Migrations for 'api':
  api/migrations/0001_initial.py
    - Create model CivicIssue
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
```

## Step 4: Create Django Superuser (Optional)

To access the Django admin panel:

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

## Step 5: Start the Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## Step 6: Test the API

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Test Classification
```bash
curl -X POST http://localhost:8000/api/classify \
  -H "Content-Type: application/json" \
  -d '{
    "issueDescription": "There is a large pothole on Main Street causing traffic issues",
    "location": "Main Street, Downtown"
  }'
```

## API Endpoints

### 1. Classify Issue
- **URL**: `POST /api/classify`
- **Body**: `{ "issueDescription": "string", "location": "string" }`
- **Response**: Classification with category, severity, urgency, authority

### 2. Generate Complaint
- **URL**: `POST /api/generate`
- **Body**: `{ "issueDescription": "string", "location": "string", "latitude": decimal, "longitude": decimal, "classification": {...} }`
- **Response**: Formatted complaint text and issue ID

### 3. Improve Complaint
- **URL**: `POST /api/improve`
- **Body**: `{ "complaint": "string", "improvementTypes": ["formal", "urgent", ...] }`
- **Response**: Improved complaint text

### 4. Get Community Issues
- **URL**: `GET /api/issues?category=Sanitation&severity=high`
- **Response**: List of all issues with optional filtering

### 5. Get Issue Detail
- **URL**: `GET /api/issues/{id}`
- **Response**: Detailed information about a specific issue

### 6. Get Issue Statistics
- **URL**: `GET /api/issues/stats`
- **Response**: Statistics about all issues

## Database Schema

### CivicIssue Model
- `issue_description`: User's description of the problem
- `location`: Text location (e.g., "Main Street, Downtown")
- `latitude`, `longitude`: GPS coordinates for map view
- `category`: AI-classified category (Sanitation, Road Infrastructure, etc.)
- `severity`: low, medium, high, critical
- `urgency`: low, medium, high, immediate
- `reasoning`: AI's reasoning for classification
- `formatted_complaint`: Generated formal complaint text
- `authority_department`: Responsible government department
- `authority_jurisdiction`: Jurisdiction area
- `authority_contact`: Contact information
- `status`: pending, in_progress, resolved, rejected
- `created_at`, `updated_at`: Timestamps
- `view_count`: Number of times viewed

## Django Admin Panel

Access at: `http://localhost:8000/admin`

Use the superuser credentials you created to:
- View all submitted issues
- Update issue status (pending → in_progress → resolved)
- Manually edit any issue details
- View statistics and analytics

## Troubleshooting

### Type Checking Errors
**Q**: I see many errors from basedpyright about Django models and queries.
**A**: These are static type analysis warnings, NOT runtime errors. Django uses dynamic Python features that confuse type checkers. The code will run perfectly fine. You can:
- Ignore these warnings (recommended)
- Add `# type: ignore` comments
- Configure basedpyright to exclude Django patterns

### Migration Issues
**Q**: `python manage.py migrate` fails
**A**: 
1. Delete `db.sqlite3` file
2. Delete `api/migrations/` folder (except `__init__.py`)
3. Run `python manage.py makemigrations` again
4. Run `python manage.py migrate`

### IBM watsonx.ai Connection Issues
**Q**: API returns "Failed to classify/generate"
**A**: 
1. Verify your API key and Project ID in `.env`
2. Check your IBM Cloud account has watsonx.ai access
3. Ensure you have sufficient credits/quota
4. Check the watsonx.ai service status

### CORS Issues
**Q**: Frontend can't connect to backend
**A**: 
1. Verify `CORS_ALLOWED_ORIGINS` in `.env` includes your frontend URL
2. Restart the Django server after changing `.env`
3. Check browser console for specific CORS errors

## Production Deployment

### Environment Variables
Set these in your production environment:
- `DEBUG=False`
- `SECRET_KEY=<strong-random-key>`
- `ALLOWED_HOSTS=yourdomain.com`
- `CORS_ALLOWED_ORIGINS=https://yourdomain.com`

### Database
Replace SQLite with PostgreSQL:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'civicfix_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Static Files
```bash
python manage.py collectstatic
```

### WSGI Server
Use Gunicorn or uWSGI instead of `runserver`:
```bash
pip install gunicorn
gunicorn civicfix.wsgi:application --bind 0.0.0.0:8000
```

## Next Steps

1. ✅ Run migrations to create database
2. ✅ Start the backend server
3. ✅ Test API endpoints
4. ✅ Set up the React frontend (see frontend/README.md)
5. ✅ Test the complete flow: submit issue → view on community page

## Support

For issues or questions:
- Check Django documentation: https://docs.djangoproject.com/
- Check IBM watsonx.ai docs: https://www.ibm.com/docs/en/watsonx-as-a-service
- Review the code comments in `api/views.py` and `api/models.py`

---
Made with Bob for IBM Hackathon