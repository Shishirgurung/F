# 👀 **VISUAL TESTING GUIDE - Step by Step**

## 🚀 **EXACTLY How to Test Your Ad Demo System**

Follow these exact steps to test your ad demonstration system with real images:

---

## 📋 **STEP 1: Start Your Website**

```bash
# In your terminal/command prompt:
cd "OneDrive\Desktop\Carbon emisson"
npm run dev
```

**Expected Result:** Website starts at `http://localhost:5173`

---

## 📋 **STEP 2: Access the Ad Demo System**

1. **Open Browser**: Go to `http://localhost:5173/ad-demo`
2. **Look for Settings Icon**: Bottom-right corner (⚙️ gear icon)
3. **Click the Settings Icon**

**What You'll See:**
- A login popup appears
- Password field asking for demo password

---

## 📋 **STEP 3: Login as Admin**

1. **Enter Password**: `aviation-demo-2024`
2. **Click "Access Demo Panel"**

**Expected Result:**
- Login popup disappears
- Settings icon changes color (becomes green/blue)
- Admin panel becomes available

---

## 📋 **STEP 4: Enable Demo Mode**

1. **Click Settings Icon Again** (now you're logged in)
2. **See Admin Panel** with three tabs: Control, Metrics, Companies
3. **In Control Tab**: Click **"Enable"** next to Demo Mode
4. **Quick Test**: Click **"Boeing Demo"** button

**What You'll See:**
- **Green indicator** appears: "Demo Active - Boeing"
- Admin panel shows Boeing is selected

---

## 📋 **STEP 5: See Demo Ads in Action**

1. **Navigate to Dashboard**: Click "Dashboard" in top menu
2. **Look for Ads**:
   - **Top of page**: Blue/purple banner ad with Boeing text
   - **Right sidebar**: Square ad with Boeing branding

**Expected Result:**
- Ads appear with "DEMO" labels
- Professional Boeing-themed styling
- Ads integrate seamlessly with your content

---

## 📋 **STEP 6: Test Company Switching**

1. **Go back to Ad Demo page**: `/ad-demo`
2. **Open Admin Panel**: Click settings icon
3. **Try Different Companies**:
   - Click **"Airbus Demo"** → Ads change to Airbus
   - Click **"Shell Demo"** → Ads change to Shell
   - Click **"Rolls-Royce Demo"** → Ads change to Rolls-Royce

**Expected Result:**
- Ads change instantly when you switch companies
- Different colors and messaging for each company

---

## 📋 **STEP 7: Test Your Own Images**

### **Option A: Download Sample Images**
1. **Go to Ad Demo page**: `/ad-demo`
2. **Click "Testing Helper" tab**
3. **Download sample images**: Click download buttons for banner, sidebar, video samples
4. **Save to your computer**

### **Option B: Use Your Own Images**
1. **Find any image** on your computer
2. **Recommended sizes**:
   - **Banner**: Wide rectangle (like 728x90 or any wide image)
   - **Sidebar**: Square or rectangle (like 300x250)

---

## 📋 **STEP 8: Upload Custom Content**

1. **Go to "Content Manager" tab** in Ad Demo page
2. **Fill in form**:
   - **Company Name**: "Test Company" (or any name)
   - **Ad Type**: "Banner Ad"
3. **Upload Image**:
   - **Drag and drop** your image, OR
   - **Click to browse** and select image
4. **Wait for success message**: "File uploaded successfully!"

**Expected Result:**
- Green success message appears
- File appears in "Manage Files" tab

---

## 📋 **STEP 9: Test Your Uploaded Content**

1. **Go to "Manage Files" tab**
2. **See your uploaded file** in the list
3. **Enable demo mode** with your custom content
4. **Navigate to Dashboard** to see your custom ad

**Expected Result:**
- Your uploaded image appears as an ad
- Professional styling applied to your content

---

## 📋 **STEP 10: Test Analytics Dashboard**

1. **Go to "Performance Analytics" tab**
2. **See realistic metrics**:
   - Impressions, click-through rates
   - Charts and graphs
   - Audience demographics

**Expected Result:**
- Professional analytics dashboard
- Realistic aviation industry data
- Interactive charts and metrics

---

## ✅ **SUCCESS CHECKLIST**

After testing, you should have verified:

- [ ] **Admin login works** with password `aviation-demo-2024`
- [ ] **Demo mode enables/disables** properly
- [ ] **Company switching** changes ads instantly
- [ ] **Banner ads appear** at top of Dashboard
- [ ] **Sidebar ads appear** in right column
- [ ] **File upload works** with your own images
- [ ] **Analytics dashboard** shows professional metrics
- [ ] **Mobile responsive** (try resizing browser window)
- [ ] **Demo labels** appear on all ads
- [ ] **Regular users don't see ads** (test by logging out)

---

## 🎯 **WHAT YOU SHOULD SEE**

### **When Demo Mode is OFF:**
- No ads visible anywhere
- Clean website as normal
- Settings icon is gray/inactive

### **When Demo Mode is ON:**
- **Dashboard page**: Banner ad at top, sidebar ad on right
- **Ad Demo page**: All ad placements visible with demo content
- **Settings icon**: Green/blue indicating active demo
- **Demo indicator**: "Demo Active - [Company Name]"

---

## 🐛 **IF SOMETHING DOESN'T WORK**

### **Ads Don't Appear:**
1. **Check demo mode**: Make sure it's enabled (green indicator)
2. **Check admin login**: Make sure you're logged in
3. **Refresh page**: Try refreshing the browser
4. **Check browser console**: Press F12, look for errors

### **Upload Doesn't Work:**
1. **Check file size**: Must be under 10MB
2. **Check file type**: Use JPG, PNG, GIF for images
3. **Try different browser**: Chrome, Firefox, Edge
4. **Clear cache**: Clear browser cache and try again

### **Admin Panel Doesn't Open:**
1. **Check password**: Must be exactly `aviation-demo-2024`
2. **Try different browser**: Some browsers block popups
3. **Clear storage**: Clear browser localStorage

---

## 🎉 **CONGRATULATIONS!**

If you can see ads appearing and changing when you switch companies, **your ad demonstration system is working perfectly!**

**You're now ready to:**
- Demo to real clients
- Upload their specific content
- Show professional analytics
- Close advertising deals

**Your aviation emissions website is now a professional advertising platform!** ✈️💰

---

## 📞 **NEXT STEPS**

1. **Practice the demo flow** several times
2. **Prepare professional content** for real client meetings
3. **Create pricing packages** for different ad placements
4. **Start reaching out** to aviation companies
5. **Schedule demo meetings** with potential advertisers

**You have everything you need to start monetizing your website!** 🚀
