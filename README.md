# CivicFix – AI Public Issue Reporting System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://www.djangoproject.com/)

An intelligent, AI-powered civic issue reporting system that empowers citizens to transform informal complaints into professional, structured reports suitable for government submission. Built for the IBM Bob Hackathon.

## 🌟 Features

- **Intelligent Classification**: Automatically categorizes civic issues into predefined domains (sanitation, roads, water, electricity, etc.)
- **Severity Assessment**: AI-powered analysis determines issue severity (low, medium, high, critical) and urgency levels
- **Professional Complaint Generation**: Transforms informal descriptions into well-structured, formal government complaints
- **Smart Authority Mapping**: Automatically identifies the appropriate government department for each issue type
- **Complaint Enhancement**: Refine complaints with options to add urgency, legal references, or strengthen language
- **Responsive Design**: Clean, modern UI that works seamlessly across desktop, tablet, and mobile devices
- **No Authentication Required**: Stateless operation for maximum simplicity and speed

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 3000)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│ Django Backend  │
│  (Port 8000)    │
└────────┬────────┘
         │ API Calls
         ▼
┌─────────────────┐
│ IBM watsonx.ai  │
│  (flan-t5-xl)   │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- IBM watsonx.ai account with API credentials

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your IBM watsonx.ai credentials

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env to point to your backend URL

# Start development server
npm start
```

Frontend will be available at `http://localhost:3000`

## 📋 API Documentation

### Endpoints

#### 1. Classify Issue
Analyzes and categorizes a civic issue.

**Endpoint**: `POST /api/classify`

**Request Body**:
```json
{
  "issueDescription": "Garbage has been piling up on Main Street for the past week",
  "location": "Main Street, Ward 5"
}
```

**Response**:
```json
{
  "category": "Sanitation",
  "severity": "medium",
  "urgency": "high",
  "authority": {
    "department": "Municipal Corporation - Sanitation Department",
    "jurisdiction": "Ward Office",
    "contact": "Ward Sanitation Officer"
  },
  "reasoning": "Garbage accumulation affects public health and requires prompt attention"
}
```

#### 2. Generate Complaint
Creates a formal complaint document.

**Endpoint**: `POST /api/generate`

**Request Body**:
```json
{
  "issueDescription": "Garbage has been piling up on Main Street for the past week",
  "location": "Main Street, Ward 5",
  "classification": {
    "category": "Sanitation",
    "severity": "medium",
    "urgency": "high"
  }
}
```

**Response**:
```json
{
  "formattedComplaint": "To,\nThe Sanitation Officer\nMunicipal Corporation\n[City Name]\n\nSubject: Complaint Regarding Garbage Accumulation on Main Street, Ward 5\n\nRespected Sir/Madam,\n\nI am writing to bring to your attention..."
}
```

#### 3. Improve Complaint
Enhances an existing complaint based on selected criteria.

**Endpoint**: `POST /api/improve`

**Request Body**:
```json
{
  "complaint": "Original complaint text...",
  "improvementTypes": ["make_formal", "add_urgency", "reference_rights"]
}
```

**Response**:
```json
{
  "improvedComplaint": "Enhanced complaint text with requested improvements..."
}
```

## 🎨 User Interface

### Main Features

1. **Issue Submission Form**
   - Large textarea for issue description
   - Optional location field
   - Clear submit button with loading state

2. **Classification Card**
   - Issue category with icon
   - Color-coded severity indicator
   - Urgency level badge
   - Mapped authority information

3. **Complaint Display**
   - Formatted complaint text
   - Copy-to-clipboard functionality
   - Improve button for refinements

4. **Improvement Modal**
   - Multiple enhancement options
   - Real-time complaint updates
   - Easy-to-use interface

### Color Coding

- **Low Severity**: Green (#10B981)
- **Medium Severity**: Yellow (#F59E0B)
- **High Severity**: Orange (#F97316)
- **Critical Severity**: Red (#EF4444)

## 🛠️ Technology Stack

### Frontend
- React 18+
- Tailwind CSS
- Axios
- React Icons

### Backend
- Django 4.2+
- Django REST Framework
- IBM watsonx.ai Python SDK
- django-cors-headers

### AI Model
- IBM watsonx.ai
- Model: `google/flan-t5-xl` (cost-effective, high-quality)

## 📁 Project Structure

```
civicfix/
├── backend/
│   ├── civicfix_api/          # Django project settings
│   ├── api/                   # API application
│   │   ├── views.py          # API endpoints
│   │   ├── serializers.py    # Data serialization
│   │   ├── ai_service.py     # watsonx.ai integration
│   │   ├── authority_mapper.py # Department mapping
│   │   └── prompts.py        # AI prompt templates
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utility functions
│   │   └── App.jsx           # Main application
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
├── docs/
│   └── deployment.md         # Deployment guide
├── TECHNICAL_PLAN.md         # Technical specifications
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Django Configuration
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your-api-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=google/flan-t5-xl
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🚢 Deployment

Detailed deployment instructions for AWS, Azure, and Docker are available in [`docs/deployment.md`](docs/deployment.md).

### Quick Deploy Options

- **AWS**: S3 + CloudFront (Frontend) + EC2/ECS (Backend)
- **Azure**: Static Web Apps (Frontend) + App Service (Backend)
- **Docker**: Docker Compose for containerized deployment

## 📊 Issue Categories

The system recognizes and classifies the following civic issue types:

- **Sanitation**: Garbage accumulation, waste management, cleanliness
- **Road Infrastructure**: Potholes, road damage, broken roads
- **Water Supply**: Leakage, broken pipes, water shortage
- **Electricity**: Power outages, streetlight issues, electrical problems
- **Drainage**: Blocked drains, flooding, sewage issues
- **Public Safety**: Illegal construction, noise pollution, safety hazards
- **Other**: Any other civic concerns

## 🎯 Authority Mapping

Each issue category is automatically mapped to the appropriate government department:

| Category | Department | Contact |
|----------|------------|---------|
| Sanitation | Municipal Corporation - Sanitation Dept | Ward Sanitation Officer |
| Road Infrastructure | Public Works Department (PWD) | Executive Engineer - Roads |
| Water Supply | Water Board / Public Health Engineering | Assistant Engineer - Water |
| Electricity | Electricity Board / Power Distribution | Sub-Divisional Officer (SDO) |
| Drainage | Municipal Corporation - Drainage Dept | Drainage Inspector |
| Public Safety | Municipal Corporation / Local Police | Ward Officer / SHO |

## 🧪 Testing

### Sample Test Cases

**Test Case 1: Garbage Issue**
```
Input: "Garbage has been piling up near the park entrance for 2 weeks"
Location: "Central Park, Ward 12"
Expected: Category=Sanitation, Severity=Medium/High, Urgency=High
```

**Test Case 2: Pothole Issue**
```
Input: "Large pothole on highway causing accidents"
Location: "NH-44, near toll plaza"
Expected: Category=Road Infrastructure, Severity=High/Critical, Urgency=Immediate
```

**Test Case 3: Water Leakage**
```
Input: "Water pipe burst, water flowing on street"
Location: "MG Road, Sector 5"
Expected: Category=Water Supply, Severity=High, Urgency=Immediate
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for the IBM Bob Hackathon
- Powered by IBM watsonx.ai
- Inspired by the need for better civic engagement tools

## 📞 Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Check the [Technical Plan](TECHNICAL_PLAN.md) for detailed specifications
- Review the [Deployment Guide](docs/deployment.md) for setup help

## 🔮 Future Enhancements

- User authentication and complaint history
- Image upload for visual evidence
- Real-time complaint tracking
- Multi-language support
- SMS/Email notifications
- Admin dashboard for authorities
- Mobile app (React Native)
- Integration with government portals

---

**Made with ❤️ for better civic engagement**
