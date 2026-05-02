# 🚀 OpenAI Setup Guide for CivicFix

Since you have OpenAI Premium, this will be super easy! Let's get your CivicFix app running with OpenAI.

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Get Your OpenAI API Key (2 minutes)

1. **Go to OpenAI Platform**: https://platform.openai.com/
2. **Log in** with your OpenAI account (the one with Premium)
3. **Navigate to API Keys**:
   - Click your profile icon (top right)
   - Select **"API keys"** or go directly to: https://platform.openai.com/api-keys
4. **Create a new key**:
   - Click **"Create new secret key"**
   - Name it: `CivicFix` (or any name you like)
   - Click **"Create secret key"**
5. **Copy the key immediately!**
   - You'll see something like: `sk-proj-abc123xyz...`
   - **IMPORTANT**: Copy it now - you can't see it again!
   - Save it somewhere safe

---

### Step 2: Create .env File (1 minute)

Create a file named `.env` in the `backend` directory:

**Windows PowerShell:**
```powershell
cd backend
New-Item -Path .env -ItemType File
```

**Add this content to `backend/.env`:**

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4o-mini

# Django Configuration
SECRET_KEY=django-insecure-change-this-later
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**⚠️ IMPORTANT**: Replace `sk-proj-your-actual-key-here` with your actual API key from Step 1!

---

### Step 3: Install OpenAI Package (30 seconds)

```bash
cd backend
pip install openai
```

That's it! You're done! 🎉

---

## 🎯 Which Model to Use?

Since you have OpenAI Premium, you have access to all models. Here are your options:

### Recommended: `gpt-4o-mini` (Default)
- ✅ **Fast**: Quick responses
- ✅ **Cost-effective**: Cheaper than GPT-4
- ✅ **Good quality**: Perfect for this use case
- ✅ **Already configured** in your settings

### Alternative: `gpt-4o` (Better Quality)
- ✅ **Higher quality**: More accurate classifications
- ✅ **Better complaints**: More professional language
- ⚠️ **More expensive**: But still reasonable
- 📝 **To use**: Change `OPENAI_MODEL=gpt-4o` in `.env`

### Alternative: `gpt-4-turbo` (Balanced)
- ✅ **Great quality**: Almost as good as GPT-4
- ✅ **Faster**: Quicker than regular GPT-4
- ✅ **Good value**: Balance of cost and quality
- 📝 **To use**: Change `OPENAI_MODEL=gpt-4-turbo` in `.env`

**My recommendation**: Start with `gpt-4o-mini` (already set). It's perfect for this app!

---

## 🚀 Start Your App

Now you're ready to run CivicFix!

### Terminal 1 - Backend:
```bash
cd backend
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```

### Test It:
1. Open http://localhost:3000
2. Submit a civic issue
3. Watch OpenAI classify it and generate a complaint!

---

## 💰 Cost Information

### With OpenAI Premium:
- You already have credits included
- API usage is separate from ChatGPT Plus subscription
- But you get better rates and higher limits

### Pricing (as of 2024):
- **gpt-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **gpt-4o**: ~$5 per 1M input tokens, ~$15 per 1M output tokens
- **gpt-4-turbo**: ~$10 per 1M input tokens, ~$30 per 1M output tokens

### What does this mean?
- Each civic issue classification: ~$0.001 (less than a penny!)
- Each complaint generation: ~$0.002
- **100 issues**: ~$0.30 total
- **1000 issues**: ~$3.00 total

**Very affordable!** 🎉

---

## 🔧 Troubleshooting

### Error: "Invalid API Key"
**Solution**:
- Check your `.env` file
- Make sure the key starts with `sk-`
- No extra spaces or quotes
- Key should be on one line

### Error: "Rate limit exceeded"
**Solution**:
- You're making too many requests too fast
- Wait a few seconds between requests
- Or upgrade your OpenAI plan limits

### Error: "Insufficient quota"
**Solution**:
- Check your OpenAI billing: https://platform.openai.com/account/billing
- Add payment method if needed
- Check usage limits

### Error: "Model not found"
**Solution**:
- Check the model name in `.env`
- Make sure it's one of: `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
- No typos!

---

## 📊 Monitor Your Usage

### Check Usage:
1. Go to https://platform.openai.com/usage
2. See your API calls and costs
3. Set up usage alerts if needed

### Set Spending Limits:
1. Go to https://platform.openai.com/account/billing/limits
2. Set monthly budget cap
3. Get email alerts when approaching limit

---

## 🎓 Why OpenAI is Better for This Project

### Advantages over IBM watsonx.ai:
1. ✅ **Easier setup**: No account issues, no project IDs
2. ✅ **Better quality**: GPT-4 models are more accurate
3. ✅ **Faster**: Lower latency, quicker responses
4. ✅ **More reliable**: Better uptime and stability
5. ✅ **You already have it**: No new account needed!

### Perfect for Hackathons:
- Quick to set up
- Reliable performance
- Great demo quality
- Easy to explain

---

## 🔄 Switching Back to IBM (If Needed)

If you later get IBM watsonx.ai working and want to switch back:

1. **Install IBM package**:
   ```bash
   pip install ibm-watsonx-ai
   ```

2. **Update `backend/api/ai_service.py`**:
   - Change `OpenAIService` back to `WatsonXAIService`
   - Update imports

3. **Update `.env`**:
   - Add IBM credentials
   - Remove OpenAI key

But honestly, OpenAI works great for this project! 🚀

---

## ✅ Quick Checklist

Before running your app:

- [ ] OpenAI account created (you have this!)
- [ ] API key obtained from platform.openai.com
- [ ] `.env` file created in `backend/` directory
- [ ] API key added to `.env` file
- [ ] OpenAI package installed (`pip install openai`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Database migrations run (`python manage.py migrate`)

---

## 🎉 You're All Set!

Your CivicFix app is now powered by OpenAI!

**What works:**
- ✅ AI classification of civic issues
- ✅ Automatic complaint generation
- ✅ Complaint improvement suggestions
- ✅ Community map view
- ✅ Issue filtering and search

**Next steps:**
1. Start the backend: `python manage.py runserver`
2. Start the frontend: `npm start`
3. Test with real civic issues
4. Show off your demo! 🎊

---

## 💡 Pro Tips

1. **Use gpt-4o-mini for development**: It's fast and cheap
2. **Switch to gpt-4o for demos**: Better quality for presentations
3. **Monitor your usage**: Check the dashboard regularly
4. **Set spending limits**: Avoid surprises
5. **Cache responses**: For repeated testing, save API calls

---

## 📞 Need Help?

### OpenAI Resources:
- **Documentation**: https://platform.openai.com/docs
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Community Forum**: https://community.openai.com/
- **Status Page**: https://status.openai.com/

### CivicFix Issues:
- Check `QUICK_START.md` for general setup
- Check `TYPE_CHECKING_EXPLAINED.md` for code "errors"
- Check `SETUP_INSTRUCTIONS.md` for backend details

---

**Happy coding!** 🚀

Your CivicFix app is now powered by the best AI available!

---
Made with Bob for IBM Hackathon (now with OpenAI!)