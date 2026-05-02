# 🚀 Google Gemini Setup Guide - SUPER EASY & FREE!

## ⚡ 2-Step Setup (3 minutes total)

### Step 1: Get Your FREE Gemini API Key (2 minutes)

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account (any Gmail account works!)
3. **Click "Create API Key"**
4. **Copy the key** (starts with `AIza...`)

**That's it!** No credit card, no payment, completely FREE! ✅

---

### Step 2: Add to .env File (1 minute)

Create or update `backend/.env`:

```env
# Google Gemini Configuration
GEMINI_API_KEY=AIza-paste-your-key-here
GEMINI_MODEL=gemini-pro

# Django Configuration
SECRET_KEY=django-insecure-change-later
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Replace `AIza-paste-your-key-here` with your actual key!**

---

## 🎉 Done! Start Your App

```bash
# Backend
cd backend
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm start
```

Open http://localhost:3000 and test it!

---

## 💰 Why Gemini is PERFECT for Hackathons

### ✅ **Completely FREE**
- No credit card required
- No payment setup
- Generous free tier: **60 requests per minute**
- Perfect for demos and development

### ✅ **Super Easy Setup**
- Just Google account needed
- Get API key in 30 seconds
- No complex configuration

### ✅ **Great Quality**
- Gemini Pro is powerful (comparable to GPT-3.5)
- Excellent for text classification
- Good at generating formal documents
- Supports multiple languages

### ✅ **Fast & Reliable**
- Low latency
- High availability
- Google's infrastructure

---

## 📊 Free Tier Limits

**Gemini Pro (Free)**:
- ✅ 60 requests per minute
- ✅ 1500 requests per day
- ✅ Unlimited for personal projects
- ✅ No expiration

**Perfect for:**
- ✅ Hackathon demos (100+ issues easily)
- ✅ Development and testing
- ✅ Portfolio projects
- ✅ Small-scale deployments

---

## 🎯 Available Models

### **gemini-pro** (Default - Recommended)
- Best for text generation
- Fast responses
- Free tier available
- Perfect for CivicFix

### **gemini-pro-vision** (For image analysis)
- Supports image input
- Can analyze photos of civic issues
- Great for future features
- Also free!

---

## 🔧 Troubleshooting

### Error: "Invalid API Key"
**Solution**:
- Check your `.env` file
- Make sure key starts with `AIza`
- No extra spaces or quotes
- Key should be on one line

### Error: "Quota exceeded"
**Solution**:
- You hit the 60 requests/minute limit
- Wait 1 minute and try again
- Or create another API key

### Error: "API not enabled"
**Solution**:
- Go to https://makersuite.google.com/
- Make sure you're signed in
- Create a new API key
- Try again

---

## 🚀 Quick Test

Test if Gemini is working:

```bash
cd backend
python manage.py shell
```

Then:

```python
from api.ai_service import get_ai_service

# Initialize service
ai = get_ai_service()

# Test generation
result = ai.generate_text("Say hello!")
print(result)
# Should print: "Hello! How can I help you today?"
```

If you see output, you're all set! ✅

---

## 💡 Pro Tips

1. **Multiple Keys**: Create multiple API keys for different projects
2. **Monitor Usage**: Check usage at https://makersuite.google.com/
3. **Rate Limiting**: Add delays between requests if needed
4. **Error Handling**: Already built into the code!

---

## 🎊 Advantages Over OpenAI/IBM

| Feature | Gemini | OpenAI | IBM watsonx |
|---------|--------|--------|-------------|
| **Free Tier** | ✅ Yes | ⚠️ Limited | ⚠️ Complex |
| **Setup Time** | ✅ 2 min | ⚠️ 5 min | ❌ 30+ min |
| **Credit Card** | ✅ No | ⚠️ Yes | ⚠️ Yes |
| **Quality** | ✅ Great | ✅ Excellent | ✅ Good |
| **Speed** | ✅ Fast | ✅ Fast | ⚠️ Slower |
| **Hackathon Ready** | ✅ Perfect | ⚠️ If you have credits | ❌ Account issues |

---

## 🏆 For Your Hackathon

**Gemini is IDEAL because:**
1. ✅ No payment issues (completely free)
2. ✅ No account lockouts (like IBM)
3. ✅ No credit card needed (unlike OpenAI)
4. ✅ Fast setup (2 minutes vs 30+ minutes)
5. ✅ Reliable for demos (60 req/min is plenty)
6. ✅ Good quality output (judges won't notice difference)

---

## 📞 Need Help?

### Official Resources:
- **API Docs**: https://ai.google.dev/docs
- **Get API Key**: https://makersuite.google.com/app/apikey
- **Pricing**: https://ai.google.dev/pricing (Free tier is generous!)

### Common Questions:

**Q: Do I need to pay?**
A: No! Completely free for personal projects and hackathons.

**Q: Will it work for 5000 participants?**
A: Yes! 60 requests/minute is more than enough for demos.

**Q: Can I use it in production?**
A: Yes, but consider upgrading to paid tier for higher limits.

**Q: Is it as good as GPT-4?**
A: Gemini Pro is comparable to GPT-3.5, which is perfect for this use case!

---

## ✅ Final Checklist

Before running your app:

- [ ] Google account ready
- [ ] API key obtained from makersuite.google.com
- [ ] `.env` file created in `backend/` directory
- [ ] API key added to `.env` file
- [ ] Gemini package installed (`pip install google-generativeai`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migrations run (`python manage.py migrate`)

---

## 🎉 You're All Set!

Your CivicFix app is now powered by Google Gemini - completely FREE and ready for the hackathon!

**Start coding and good luck!** 🚀🍀

---
Made with Bob for IBM Hackathon (powered by Google Gemini!)