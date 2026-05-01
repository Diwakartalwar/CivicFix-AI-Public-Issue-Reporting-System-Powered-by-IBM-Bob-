# CivicFix Setup Guide

This guide will help you set up and run the CivicFix application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **IBM watsonx.ai Account** - [Sign up here](https://www.ibm.com/watsonx)

## Quick Start

### 1. Clone or Download the Project

```bash
cd "CivicFix – AI Public Issue Reporting System (Powered by IBM Bob)"
```

### 2. Backend Setup

#### Step 2.1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2.2: Create Virtual Environment (Windows)

```powershell
python -m venv venv
venv\Scripts\activate
```

For macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 2.3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 2.4: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` file with your credentials:
```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your-watsonx-api-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=google/flan-t5-xl
```

**How to get IBM watsonx.ai credentials:**
1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Create a watsonx.ai instance
3. Get your API key from IBM Cloud IAM
4. Create a project and get the project ID
5. Ensure you have access to the `google/flan-t5-xl` model

#### Step 2.5: Run Migrations

```bash
python manage.py migrate
```

#### Step 2.6: Start Backend Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

**Test the backend:**
```bash
curl http://localhost:8000/api/health
```

### 3. Frontend Setup

Open a **new terminal window** and navigate to the frontend directory.

#### Step 3.1: Navigate to Frontend Directory

```bash
cd frontend
```

#### Step 3.2: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- Axios for API calls
- React Icons
- Tailwind CSS and dependencies

#### Step 3.3: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

#### Step 3.4: Start Frontend Development Server

```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## Verification

### Backend Verification

1. **Health Check:**
   ```bash
   curl http://localhost:8000/api/health
   ```
   Expected response: `{"status": "healthy", "service": "CivicFix API"}`

2. **Admin Panel:**
   - Visit `http://localhost:8000/admin`
   - Create a superuser if needed: `python manage.py createsuperuser`

### Frontend Verification

1. Open `http://localhost:3000` in your browser
2. You should see the CivicFix interface with:
   - Header with logo and title
   - Issue submission form
   - Empty state message

## Testing the Application

### Test Case 1: Garbage Issue

1. **Issue Description:**
   ```
   There is garbage piling up on Main Street near the park entrance for the past two weeks. The smell is unbearable and attracting stray animals.
   ```

2. **Location:**
   ```
   Main Street, Ward 5, Central Park Area
   ```

3. **Expected Results:**
   - Category: Sanitation
   - Severity: Medium or High
   - Urgency: High
   - Authority: Municipal Corporation - Sanitation Department

### Test Case 2: Pothole Issue

1. **Issue Description:**
   ```
   Large pothole on the highway near toll plaza causing accidents. Multiple vehicles have been damaged.
   ```

2. **Location:**
   ```
   NH-44, near toll plaza
   ```

3. **Expected Results:**
   - Category: Road Infrastructure
   - Severity: High or Critical
   - Urgency: Immediate
   - Authority: Public Works Department (PWD)

### Test Case 3: Water Leakage

1. **Issue Description:**
   ```
   Water pipe burst on the street. Water is flowing continuously and flooding the area.
   ```

2. **Location:**
   ```
   MG Road, Sector 5
   ```

3. **Expected Results:**
   - Category: Water Supply
   - Severity: High
   - Urgency: Immediate
   - Authority: Water Board / Public Health Engineering

## Troubleshooting

### Backend Issues

#### Issue: Module not found errors
**Solution:**
```bash
pip install -r requirements.txt --upgrade
```

#### Issue: watsonx.ai authentication error
**Solution:**
- Verify your API key is correct
- Check that your project ID is valid
- Ensure you have access to the model in your region

#### Issue: CORS errors
**Solution:**
- Check that `CORS_ALLOWED_ORIGINS` in `.env` includes `http://localhost:3000`
- Restart the Django server after changing `.env`

### Frontend Issues

#### Issue: Cannot connect to backend
**Solution:**
- Ensure backend is running on port 8000
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify no firewall is blocking the connection

#### Issue: Tailwind styles not working
**Solution:**
```bash
npm install -D tailwindcss postcss autoprefixer
```

#### Issue: Module not found errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Backend Development

1. **View Logs:**
   ```bash
   python manage.py runserver
   ```
   Logs appear in the terminal

2. **Django Shell:**
   ```bash
   python manage.py shell
   ```

3. **Create Migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

### Frontend Development

1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Run Tests:**
   ```bash
   npm test
   ```

3. **Check for Issues:**
   ```bash
   npm run build
   ```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DJANGO_SECRET_KEY` | Django secret key | Yes | `your-secret-key` |
| `DEBUG` | Debug mode | Yes | `True` or `False` |
| `ALLOWED_HOSTS` | Allowed hosts | Yes | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | CORS origins | Yes | `http://localhost:3000` |
| `WATSONX_API_KEY` | IBM watsonx.ai API key | Yes | `your-api-key` |
| `WATSONX_PROJECT_ID` | Project ID | Yes | `your-project-id` |
| `WATSONX_URL` | watsonx.ai URL | Yes | `https://us-south.ml.cloud.ibm.com` |
| `WATSONX_MODEL_ID` | Model to use | Yes | `google/flan-t5-xl` |

### Frontend (.env)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | Yes | `http://localhost:8000/api` |

## Next Steps

1. **Customize the Application:**
   - Modify prompts in `backend/api/prompts.py`
   - Adjust authority mapping
   - Customize UI colors in `frontend/tailwind.config.js`

2. **Deploy to Production:**
   - See `docs/deployment.md` for deployment guides
   - Configure production environment variables
   - Set up HTTPS

3. **Add Features:**
   - User authentication
   - Complaint history
   - Image uploads
   - Email notifications

## Support

For issues or questions:
- Check the main [README.md](README.md)
- Review [TECHNICAL_PLAN.md](TECHNICAL_PLAN.md)
- See [docs/deployment.md](docs/deployment.md) for deployment help

## License

MIT License - See LICENSE file for details