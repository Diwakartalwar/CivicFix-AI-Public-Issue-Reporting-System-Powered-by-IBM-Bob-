# 🎯 START HERE - CivicFix with OpenAI

## ⚡ 3-Step Quick Start

### Step 1: Get OpenAI API Key (2 minutes)

1. Go to https://platform.openai.com/api-keys
2. Log in with your OpenAI account
3. Click "Create new secret key"
4. Name it "CivicFix"
5. **Copy the key** (starts with `sk-proj-...`)

### Step 2: Create .env File (1 minute)

Create `backend/.env` file with:

```env
OPENAI_API_KEY=sk-proj-paste-your-key-here
OPENAI_MODEL=gpt-4o-mini
SECRET_KEY=django-insecure-change-later
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Replace `sk-proj-paste-your-key-here` with your actual key!**

### Step 3: Run the App (30 seconds)

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

**Open**: http://localhost:3000

---

## ✅ That's It!

Your app is now running with OpenAI!

### Test It:
1. Enter a civic issue (e.g., "Pothole on Main Street")
2. Add location
3. Click "Get Current Location" for GPS
4. Submit
5. See AI classification and complaint!

---

## 📚 More Help

- **Detailed OpenAI setup**: `OPENAI_SETUP.md`
- **General setup**: `QUICK_START.md`
- **Type errors explained**: `TYPE_CHECKING_EXPLAINED.md`

---

## 🐛 Quick Fixes

**Backend won't start?**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```

**Frontend won't start?**
```bash
cd frontend
npm install
```

**API errors?**
- Check your OpenAI API key in `.env`
- Make sure it starts with `sk-`
- No extra spaces

---

**You're all set!** 🚀

Made with Bob for IBM Hackathon (powered by OpenAI)