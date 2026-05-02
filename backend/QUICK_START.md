# 🚀 CivicFix Quick Start Guide

Get your CivicFix app running in 10 minutes!

---

## ⚡ Super Quick Setup (TL;DR)

```bash
# 1. Install backend dependencies
cd backend
pip install -r requirements.txt

# 2. Set up watsonx.ai credentials (see below)
# Create backend/.env with your IBM credentials

# 3. Run migrations
python manage.py makemigrations
python manage.py migrate

# 4. Start backend
python manage.py runserver

# In a new terminal:
# 5. Install frontend dependencies
cd frontend
npm install

# 6. Start frontend
npm start

# 7. Open http://localhost:3000
```

---

## 📝 Detailed Steps

### Step 1: Get IBM watsonx.ai Credentials (5 minutes)

**Need help?** See `WATSONX_SETUP_GUIDE.md` for detailed instructions with screenshots.

**Quick version:**

1. **Go to IBM Cloud**: https://cloud.ibm.com/
2. **Create account** (if you don't have one)
3. **Launch watsonx.ai**:
   - Search "watsonx.ai" in top search bar
   - Click "Launch watsonx.ai"
4. **Create a project**:
   - Click "Projects" → "New project"
   - Name it "CivicFix"
   - Copy the **Project ID** (you'll need this!)
5. **Get API Key**:
   - Click your profile icon (top right)
   - Go to "Manage" → "Access (IAM)" → "API keys"
   - Click "Create"
   - Name it "CivicFix-API-Key"
   - **Copy the key immediately** (you can only see it once!)

**You now have:**
- ✅ API Key (looks like: `abc123xyz...`)
- ✅ Project ID (looks like: `12345678-abcd-1234-abcd-123456789abc`)

---

### Step 2: Create .env File (1 minute)

Create a file named `.env` in the `backend` directory:

**Windows PowerShell:**
```powershell
cd backend
New-Item -Path .env -ItemType File
```

**Or just create it manually** in your text editor.

**Add this content to `backend/.env`:**

```env
# IBM watsonx.ai - REPLACE WITH YOUR ACTUAL VALUES
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Django settings
SECRET_KEY=django-insecure-change-this-later
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend URL
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**⚠️ IMPORTANT**: Replace `your_api_key_here` and `your_project_id_here` with your actual credentials from Step 1!

---

### Step 3: Install Backend Dependencies (2 minutes)

```bash
cd backend
pip install -r requirements.txt
```

**Wait for installation to complete.** You'll see packages being downloaded and installed.

---

### Step 4: Set Up Database (30 seconds)

```bash
# Still in backend directory
python manage.py makemigrations
python manage.py migrate
```

**Expected output:**
```
Migrations for 'api':
  api/migrations/0001_initial.py
    - Create model CivicIssue
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
```

---

### Step 5: Start Backend Server (10 seconds)

```bash
# Still in backend directory
python manage.py runserver
```

**You should see:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**✅ Backend is running!** Keep this terminal open.

**Test it:** Open http://localhost:8000/api/health in your browser
- You should see: `{"status":"healthy","service":"CivicFix API"}`

---

### Step 6: Install Frontend Dependencies (1 minute)

**Open a NEW terminal** (keep backend running in the first one)

```bash
cd frontend
npm install
```

**Wait for installation.** This downloads React and all dependencies.

---

### Step 7: Start Frontend (10 seconds)

```bash
# Still in frontend directory
npm start
```

**You should see:**
```
Compiled successfully!

You can now view civicfix-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**✅ Frontend is running!** Your browser should automatically open to http://localhost:3000

---

## 🎉 You're Done! Test the App

### Test 1: Submit an Issue

1. On the homepage, enter an issue:
   ```
   There is a large pothole on Main Street causing traffic problems
   ```
2. Add location: `Main Street, Downtown`
3. Click **"Get Current Location"** to capture GPS coordinates
4. Click **"Submit Issue"**
5. Wait a few seconds...
6. You should see:
   - ✅ Classification (category, severity, urgency)
   - ✅ Responsible authority
   - ✅ Generated formal complaint

### Test 2: View Community Issues

1. Click **"Community Issues"** in the navigation
2. You should see:
   - ✅ Your submitted issue in the list
   - ✅ A map with a marker (if you added GPS coordinates)
3. Try the filters:
   - Filter by category
   - Filter by severity
   - Search for keywords

### Test 3: Improve Complaint

1. After submitting an issue, scroll to the complaint
2. Click **"Improve Complaint"**
3. Select improvements:
   - ☑️ Make more formal
   - ☑️ Add urgency
   - ☑️ Reference citizen rights
4. Click **"Improve"**
5. See the enhanced complaint!

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: "No module named 'corsheaders'"**
```bash
cd backend
pip install -r requirements.txt
```

**Error: "Invalid API Key"**
- Check your `.env` file
- Make sure `WATSONX_API_KEY` is correct
- No extra spaces or quotes

**Error: "Project not found"**
- Check your `WATSONX_PROJECT_ID` in `.env`
- Make sure the project exists in watsonx.ai

### Frontend won't start?

**Error: "npm: command not found"**
- Install Node.js: https://nodejs.org/
- Restart your terminal

**Error: "Port 3000 already in use"**
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then try npm start again
```

### Can't connect to backend?

**Error: "Network Error" or "Failed to fetch"**
- Make sure backend is running on http://localhost:8000
- Check `frontend/src/services/api.js` has correct URL
- Check CORS settings in `backend/.env`

### Type checking errors in VS Code?

**See lots of red squiggly lines in Django code?**
- These are NOT real errors!
- Read `TYPE_CHECKING_EXPLAINED.md` for details
- Your code will run fine - ignore them

---

## 📚 Next Steps

### Want to customize?

- **Change AI model**: Edit `backend/api/ai_service.py`
- **Modify prompts**: Edit `backend/api/prompts.py`
- **Update UI**: Edit files in `frontend/src/components/`
- **Add categories**: Edit `frontend/src/utils/constants.js`

### Want to deploy?

- See `docs/deployment.md` for AWS/Azure deployment
- See `SETUP_INSTRUCTIONS.md` for production configuration

### Need more help?

- **Detailed setup**: `SETUP_INSTRUCTIONS.md`
- **watsonx.ai help**: `WATSONX_SETUP_GUIDE.md`
- **Type errors**: `TYPE_CHECKING_EXPLAINED.md`
- **API docs**: `README.md`

---

## ✅ Checklist

Before you start coding, make sure:

- [ ] IBM Cloud account created
- [ ] watsonx.ai project created
- [ ] API Key and Project ID obtained
- [ ] `.env` file created with credentials
- [ ] Backend dependencies installed
- [ ] Database migrations run
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can submit and view issues

---

## 🎯 Common Use Cases

### For Hackathons
- Use the free tier (no credit card charges)
- Focus on the demo flow
- Test with sample civic issues
- Show the map view feature

### For Development
- Use DEBUG=True in `.env`
- Check Django admin at http://localhost:8000/admin
- Monitor API calls in terminal
- Use browser DevTools for frontend debugging

### For Production
- Set DEBUG=False
- Use strong SECRET_KEY
- Set up proper database (PostgreSQL)
- Configure HTTPS
- Set up monitoring

---

## 💡 Pro Tips

1. **Save your credentials**: Keep your API key in a password manager
2. **Monitor usage**: Check IBM Cloud dashboard regularly
3. **Test locally first**: Always test changes before deploying
4. **Use Git**: Commit your code regularly (but never commit `.env`!)
5. **Read the docs**: Check the detailed guides when stuck

---

## 🚀 Ready to Build!

You now have a fully functional AI-powered civic issue reporting system!

**What you can do:**
- ✅ Submit civic issues with AI classification
- ✅ Generate formal complaints automatically
- ✅ View all issues on an interactive map
- ✅ Filter and search community issues
- ✅ Improve complaints with AI assistance

**Happy coding!** 🎉

---
Made with Bob for IBM Hackathon