# IBM watsonx.ai Setup Guide - Step by Step

This guide will walk you through setting up IBM watsonx.ai for the CivicFix application, with screenshots descriptions and exact steps.

---

## 🎯 What You Need

1. IBM Cloud account (free tier available)
2. Access to watsonx.ai service
3. A project in watsonx.ai
4. API credentials

---

## 📋 Step-by-Step Setup

### Step 1: Create IBM Cloud Account

1. Go to **https://cloud.ibm.com/**
2. Click **"Create an account"** (or **"Log in"** if you have one)
3. Fill in your details:
   - Email address
   - Password
   - Country/Region
4. Verify your email
5. Complete the registration

**Cost**: Free tier available with limited usage

---

### Step 2: Access watsonx.ai

1. **Log in to IBM Cloud**: https://cloud.ibm.com/
2. In the top search bar, type **"watsonx.ai"**
3. Click on **"watsonx.ai"** from the results
4. Click **"Launch watsonx.ai"** button

**Alternative Path**:
- From IBM Cloud dashboard
- Click **"Catalog"** in the top menu
- Search for **"watsonx.ai"**
- Click on it and then **"Launch"**

---

### Step 3: Create a watsonx.ai Project

1. Once in watsonx.ai, you'll see the main dashboard
2. Click **"Projects"** in the left sidebar (or top menu)
3. Click **"New project"** button (usually blue button on the right)
4. Choose **"Create an empty project"**
5. Fill in project details:
   - **Name**: `CivicFix` (or any name you prefer)
   - **Description**: `AI-powered civic issue reporting system`
   - **Storage**: Select or create a Cloud Object Storage instance
6. Click **"Create"**

**Important**: Save your **Project ID** - you'll need it later!

---

### Step 4: Get Your Project ID

**Method 1 - From Project Settings**:
1. Open your project (`CivicFix`)
2. Click **"Manage"** tab at the top
3. Click **"General"** in the left sidebar
4. Look for **"Project ID"**
5. Copy the ID (looks like: `12345678-abcd-1234-abcd-123456789abc`)

**Method 2 - From URL**:
1. When you're in your project, look at the browser URL
2. It will look like: `https://dataplatform.cloud.ibm.com/projects/YOUR-PROJECT-ID?context=wx`
3. The part after `/projects/` and before `?` is your Project ID

**Save this ID** - you'll put it in your `.env` file as `WATSONX_PROJECT_ID`

---

### Step 5: Create API Key

1. Go to **IBM Cloud Dashboard**: https://cloud.ibm.com/
2. Click your **profile icon** (top right corner)
3. Select **"Profile and settings"** or **"Manage"** → **"Access (IAM)"**
4. In the left sidebar, click **"API keys"**
5. Click **"Create"** button (blue button on the right)
6. Fill in:
   - **Name**: `CivicFix-API-Key` (or any descriptive name)
   - **Description**: `API key for CivicFix watsonx.ai integration`
7. Click **"Create"**
8. **IMPORTANT**: Copy the API key immediately!
   - You can only see it once
   - Click **"Copy"** or **"Download"** to save it
   - Store it securely

**Save this API Key** - you'll put it in your `.env` file as `WATSONX_API_KEY`

---

### Step 6: Determine Your Region/URL

Your watsonx.ai URL depends on your IBM Cloud region:

| Region | URL |
|--------|-----|
| **US South (Dallas)** | `https://us-south.ml.cloud.ibm.com` |
| **US East (Washington DC)** | `https://us-east.ml.cloud.ibm.com` |
| **EU Germany (Frankfurt)** | `https://eu-de.ml.cloud.ibm.com` |
| **EU United Kingdom (London)** | `https://eu-gb.ml.cloud.ibm.com` |
| **Japan (Tokyo)** | `https://jp-tok.ml.cloud.ibm.com` |

**How to find your region**:
1. In IBM Cloud dashboard, look at the top right
2. You'll see your region (e.g., "Dallas", "Frankfurt")
3. Use the corresponding URL from the table above

**Most common**: `https://us-south.ml.cloud.ibm.com`

---

### Step 7: Create Your .env File

Now create a `.env` file in the `backend` directory:

```bash
# Navigate to backend directory
cd backend

# Create .env file (Windows PowerShell)
New-Item -Path .env -ItemType File

# Or use a text editor to create backend/.env
```

**Add these contents to `backend/.env`**:

```env
# IBM watsonx.ai Configuration
WATSONX_API_KEY=paste_your_api_key_here
WATSONX_PROJECT_ID=paste_your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Django Configuration
SECRET_KEY=django-insecure-change-this-in-production-xyz123
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Replace**:
- `paste_your_api_key_here` with your actual API key from Step 5
- `paste_your_project_id_here` with your actual Project ID from Step 4
- Update `WATSONX_URL` if you're not in US South region

---

### Step 8: Verify Your Setup

Test if your credentials work:

```bash
cd backend
python manage.py shell
```

Then in the Python shell:

```python
from api.ai_service import get_ai_service

# Try to initialize the service
ai_service = get_ai_service()
print("✅ watsonx.ai connection successful!")

# Test a simple classification
test_prompt = "Classify this issue: There is garbage on the street"
result = ai_service.classify_issue(test_prompt)
print(result)
```

If you see output without errors, you're all set! ✅

---

## 🔧 Troubleshooting

### Error: "Invalid API Key"
**Solution**:
- Double-check your API key in `.env`
- Make sure there are no extra spaces
- Regenerate the API key if needed (Step 5)

### Error: "Project not found"
**Solution**:
- Verify your Project ID is correct
- Make sure the project exists in watsonx.ai
- Check you're using the right IBM Cloud account

### Error: "Region/URL mismatch"
**Solution**:
- Verify your `WATSONX_URL` matches your IBM Cloud region
- Check the region table in Step 6

### Error: "Insufficient permissions"
**Solution**:
- Make sure your API key has access to watsonx.ai
- In IBM Cloud IAM, check the API key has "Editor" or "Administrator" role

### Error: "Model not found"
**Solution**:
- The code uses `google/flan-t5-xl` which is available in watsonx.ai
- If you want to use a different model, update `backend/api/ai_service.py`

---

## 💰 Cost Considerations

### Free Tier
- IBM Cloud offers a **Lite (free) tier**
- Limited to certain number of API calls per month
- Perfect for development and testing

### Paid Plans
- **Pay-as-you-go**: Only pay for what you use
- **Subscription**: Fixed monthly cost with higher limits

### Cost-Saving Tips
1. Use the **Lite tier** for development
2. Choose smaller models like `flan-t5-xl` (already configured)
3. Implement caching to reduce API calls
4. Monitor usage in IBM Cloud dashboard

---

## 🎓 Understanding the Models

The CivicFix app uses **Google Flan-T5-XL** model:

### Why Flan-T5-XL?
- ✅ **Cost-effective**: Smaller model = lower costs
- ✅ **Fast**: Quick response times
- ✅ **Accurate**: Good for text classification and generation
- ✅ **Available**: Included in watsonx.ai

### Alternative Models (if needed)
You can change the model in `backend/api/ai_service.py`:

```python
# Current model
model_id = "google/flan-t5-xl"

# Alternatives:
# model_id = "google/flan-t5-xxl"  # Larger, more accurate, more expensive
# model_id = "google/flan-ul2"     # Even larger
# model_id = "meta-llama/llama-2-70b-chat"  # Very powerful, higher cost
```

---

## 📊 Monitoring Usage

### Check Your Usage
1. Go to **IBM Cloud Dashboard**
2. Click **"Manage"** → **"Billing and usage"**
3. Click **"Usage"**
4. Look for **watsonx.ai** service
5. See your API calls and costs

### Set Up Alerts
1. In IBM Cloud, go to **"Manage"** → **"Billing and usage"**
2. Click **"Spending notifications"**
3. Set up email alerts for spending thresholds

---

## ✅ Quick Checklist

Before running your app, make sure you have:

- [ ] IBM Cloud account created
- [ ] watsonx.ai service accessed
- [ ] Project created in watsonx.ai
- [ ] Project ID copied
- [ ] API Key created and saved
- [ ] Region/URL identified
- [ ] `.env` file created in `backend/` directory
- [ ] All credentials added to `.env`
- [ ] Tested connection in Django shell

---

## 🚀 Next Steps

Once your watsonx.ai is set up:

1. **Start the backend**:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Test the API**:
   ```bash
   curl -X POST http://localhost:8000/api/classify \
     -H "Content-Type: application/json" \
     -d '{"issueDescription": "There is a pothole on Main Street", "location": "Main Street"}'
   ```

3. **Start the frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Use the app**:
   - Open http://localhost:3000
   - Submit a civic issue
   - See AI classification and complaint generation in action!

---

## 📞 Need More Help?

### Official Documentation
- **IBM watsonx.ai Docs**: https://www.ibm.com/docs/en/watsonx-as-a-service
- **IBM Cloud Docs**: https://cloud.ibm.com/docs
- **Python SDK Docs**: https://ibm.github.io/watsonx-ai-python-sdk/

### Common Questions

**Q: Do I need a credit card for the free tier?**
A: Yes, but you won't be charged unless you exceed free tier limits.

**Q: How many API calls do I get for free?**
A: Check the current Lite tier limits in IBM Cloud pricing page.

**Q: Can I use this for a hackathon?**
A: Yes! The free tier is perfect for hackathons and demos.

**Q: What if I run out of free credits?**
A: You can upgrade to a paid plan or wait for the monthly reset.

---

## 🎉 You're All Set!

Your IBM watsonx.ai is now configured and ready to power your CivicFix application!

The AI will:
- ✅ Classify civic issues into categories
- ✅ Determine severity and urgency
- ✅ Generate formal complaint documents
- ✅ Improve complaints based on user preferences

Happy coding! 🚀

---
Made with Bob for IBM Hackathon