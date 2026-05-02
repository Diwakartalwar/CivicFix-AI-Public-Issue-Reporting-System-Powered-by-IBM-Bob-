# CivicFix Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [AWS Deployment](#aws-deployment)
3. [Azure Deployment](#azure-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn
- IBM watsonx.ai account with API credentials

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
# Required variables:
# - WATSONX_API_KEY
# - WATSONX_PROJECT_ID
# - WATSONX_URL
# - DJANGO_SECRET_KEY
```

5. **Run migrations:**
```bash
python manage.py migrate
```

6. **Start development server:**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:8000/api
```

4. **Start development server:**
```bash
npm start
```

Frontend will be available at `http://localhost:3000`

---

## AWS Deployment

### Architecture Overview
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or ECS
- **Secrets**: AWS Systems Manager Parameter Store

### Frontend Deployment (S3 + CloudFront)

1. **Build production bundle:**
```bash
cd frontend
npm run build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://civicfix-frontend --region us-east-1
```

3. **Configure bucket for static website hosting:**
```bash
aws s3 website s3://civicfix-frontend \
  --index-document index.html \
  --error-document index.html
```

4. **Upload build files:**
```bash
aws s3 sync build/ s3://civicfix-frontend --delete
```

5. **Create CloudFront distribution:**
```bash
aws cloudfront create-distribution \
  --origin-domain-name civicfix-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

6. **Update bucket policy for CloudFront access:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::civicfix-frontend/*"
    }
  ]
}
```

### Backend Deployment (EC2)

1. **Launch EC2 instance:**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.small or larger
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **Connect to instance and setup:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx -y

# Clone repository
git clone https://github.com/yourusername/civicfix.git
cd civicfix/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn
```

3. **Configure environment variables:**
```bash
# Create .env file
nano .env

# Add your configuration
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-ec2-ip
CORS_ALLOWED_ORIGINS=https://your-cloudfront-domain.cloudfront.net

WATSONX_API_KEY=your-api-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-3-3-8b-instruct
```

4. **Create systemd service:**
```bash
sudo nano /etc/systemd/system/civicfix.service
```

```ini
[Unit]
Description=CivicFix Django Application
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/civicfix/backend
Environment="PATH=/home/ubuntu/civicfix/backend/venv/bin"
ExecStart=/home/ubuntu/civicfix/backend/venv/bin/gunicorn \
  --workers 3 \
  --bind 0.0.0.0:8000 \
  civicfix_api.wsgi:application

[Install]
WantedBy=multi-user.target
```

5. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/civicfix
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/ubuntu/civicfix/backend/staticfiles/;
    }
}
```

6. **Enable and start services:**
```bash
sudo ln -s /etc/nginx/sites-available/civicfix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable civicfix
sudo systemctl start civicfix
```

7. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Backend Deployment (ECS with Docker)

1. **Build and push Docker image:**
```bash
cd backend

# Build image
docker build -t civicfix-backend .

# Tag for ECR
docker tag civicfix-backend:latest \
  your-account-id.dkr.ecr.us-east-1.amazonaws.com/civicfix-backend:latest

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/civicfix-backend:latest
```

2. **Create ECS task definition:**
```json
{
  "family": "civicfix-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "civicfix-backend",
      "image": "your-account-id.dkr.ecr.us-east-1.amazonaws.com/civicfix-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DEBUG",
          "value": "False"
        }
      ],
      "secrets": [
        {
          "name": "WATSONX_API_KEY",
          "valueFrom": "arn:aws:ssm:us-east-1:account-id:parameter/civicfix/watsonx-api-key"
        }
      ]
    }
  ]
}
```

3. **Create ECS service with Application Load Balancer**

---

## Azure Deployment

### Frontend Deployment (Azure Static Web Apps)

1. **Build production bundle:**
```bash
cd frontend
npm run build
```

2. **Install Azure CLI:**
```bash
# Windows
winget install Microsoft.AzureCLI

# macOS
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

3. **Login to Azure:**
```bash
az login
```

4. **Create Static Web App:**
```bash
az staticwebapp create \
  --name civicfix-frontend \
  --resource-group civicfix-rg \
  --source https://github.com/yourusername/civicfix \
  --location "East US 2" \
  --branch main \
  --app-location "/frontend" \
  --output-location "build"
```

5. **Configure environment variables:**
```bash
az staticwebapp appsettings set \
  --name civicfix-frontend \
  --setting-names REACT_APP_API_URL=https://civicfix-backend.azurewebsites.net/api
```

### Backend Deployment (Azure App Service)

1. **Create App Service Plan:**
```bash
az appservice plan create \
  --name civicfix-plan \
  --resource-group civicfix-rg \
  --sku B1 \
  --is-linux
```

2. **Create Web App:**
```bash
az webapp create \
  --name civicfix-backend \
  --resource-group civicfix-rg \
  --plan civicfix-plan \
  --runtime "PYTHON:3.11"
```

3. **Configure deployment:**
```bash
cd backend

# Create deployment package
zip -r deploy.zip . -x "venv/*" -x ".git/*"

# Deploy
az webapp deployment source config-zip \
  --resource-group civicfix-rg \
  --name civicfix-backend \
  --src deploy.zip
```

4. **Configure environment variables:**
```bash
az webapp config appsettings set \
  --resource-group civicfix-rg \
  --name civicfix-backend \
  --settings \
    DJANGO_SECRET_KEY="your-secret-key" \
    DEBUG="False" \
    WATSONX_API_KEY="your-api-key" \
    WATSONX_PROJECT_ID="your-project-id" \
    WATSONX_URL="https://us-south.ml.cloud.ibm.com" \
    WATSONX_MODEL_ID="ibm/granite-3-3-8b-instruct"
```

5. **Configure startup command:**
```bash
az webapp config set \
  --resource-group civicfix-rg \
  --name civicfix-backend \
  --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 civicfix_api.wsgi"
```

---

## Docker Deployment

### Using Docker Compose

1. **Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}
      - DEBUG=False
      - ALLOWED_HOSTS=localhost,127.0.0.1
      - CORS_ALLOWED_ORIGINS=http://localhost:3000
      - WATSONX_API_KEY=${WATSONX_API_KEY}
      - WATSONX_PROJECT_ID=${WATSONX_PROJECT_ID}
      - WATSONX_URL=${WATSONX_URL}
      - WATSONX_MODEL_ID=ibm/granite-3-3-8b-instruct
    volumes:
      - ./backend:/app
    command: gunicorn civicfix_api.wsgi:application --bind 0.0.0.0:8000

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm start

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
      - frontend
```

2. **Create backend Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "civicfix_api.wsgi:application", "--bind", "0.0.0.0:8000"]
```

3. **Create frontend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application
COPY . .

# Build for production
RUN npm run build

# Install serve
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
```

4. **Run with Docker Compose:**
```bash
# Create .env file with your credentials
cp .env.example .env

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DJANGO_SECRET_KEY` | Django secret key | Yes | `your-secret-key-here` |
| `DEBUG` | Debug mode | Yes | `False` (production) |
| `ALLOWED_HOSTS` | Allowed hosts | Yes | `yourdomain.com,api.yourdomain.com` |
| `CORS_ALLOWED_ORIGINS` | CORS origins | Yes | `https://yourdomain.com` |
| `WATSONX_API_KEY` | IBM watsonx.ai API key | Yes | `your-api-key` |
| `WATSONX_PROJECT_ID` | IBM watsonx.ai project ID | Yes | `your-project-id` |
| `WATSONX_URL` | IBM watsonx.ai URL | Yes | `https://us-south.ml.cloud.ibm.com` |
| `WATSONX_MODEL_ID` | Model to use | Yes | `ibm/granite-3-3-8b-instruct` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | `https://api.yourdomain.com/api` |

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend due to CORS policy.

**Solution**:
- Ensure `CORS_ALLOWED_ORIGINS` in backend includes your frontend URL
- Check that `django-cors-headers` is installed and configured
- Verify middleware order in Django settings

#### 2. IBM watsonx.ai Authentication Errors
**Problem**: API calls fail with authentication errors.

**Solution**:
- Verify `WATSONX_API_KEY` is correct
- Check `WATSONX_PROJECT_ID` matches your project
- Ensure API key has proper permissions
- Verify URL is correct for your region

#### 3. Model Not Found Errors
**Problem**: watsonx.ai returns model not found.

**Solution**:
- Verify model ID is correct: `ibm/granite-3-3-8b-instruct`
- Check model is available in your region
- Ensure project has access to the model

#### 4. Slow Response Times
**Problem**: API responses take too long.

**Solution**:
- Increase timeout settings in Django
- Use smaller model if needed (flan-t5-base)
- Implement caching for repeated requests
- Consider using async processing

#### 5. Build Errors in Frontend
**Problem**: `npm run build` fails.

**Solution**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for syntax errors in code

#### 6. Static Files Not Loading
**Problem**: CSS/JS not loading in production.

**Solution**:
- Run `python manage.py collectstatic`
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify Nginx/Apache configuration for static files
- Check file permissions

### Health Check Endpoints

Add these to your Django backend for monitoring:

```python
# api/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat()
    })

@api_view(['GET'])
def ai_health_check(request):
    try:
        # Test watsonx.ai connection
        # Add actual test here
        return Response({
            'status': 'healthy',
            'ai_service': 'connected'
        })
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'error': str(e)
        }, status=503)
```

### Monitoring and Logging

#### Backend Logging
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'civicfix.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

#### Frontend Error Tracking
Consider integrating Sentry or similar service for production error tracking.

---

## Performance Optimization

### Backend
1. Enable Django caching
2. Use connection pooling
3. Implement rate limiting
4. Add request timeout handling
5. Use CDN for static files

### Frontend
1. Enable code splitting
2. Lazy load components
3. Optimize images
4. Use service workers for caching
5. Minimize bundle size

---

## Security Checklist

- [ ] All API keys stored in environment variables
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Regular dependency updates
- [ ] Secrets rotation policy in place

---

## Backup and Recovery

### Database Backup (if added later)
```bash
# Backup
python manage.py dumpdata > backup.json

# Restore
python manage.py loaddata backup.json
```

### Configuration Backup
- Store environment variables in secure vault
- Keep backup of deployment configurations
- Document all custom settings

---

## Support and Maintenance

### Regular Maintenance Tasks
1. Update dependencies monthly
2. Review and rotate API keys quarterly
3. Monitor error logs weekly
4. Check performance metrics daily
5. Test backup/restore procedures monthly

### Scaling Considerations
- Horizontal scaling: Add more backend instances behind load balancer
- Vertical scaling: Increase instance size for higher traffic
- Caching: Implement Redis for frequently accessed data
- CDN: Use CloudFront/Azure CDN for global distribution

---

For additional support, refer to:
- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
