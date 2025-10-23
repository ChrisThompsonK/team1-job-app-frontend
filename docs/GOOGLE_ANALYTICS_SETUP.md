# Google Analytics Setup Guide

This guide will help you complete the setup of Google Analytics 4 Data API for your job application frontend.

## 📋 What You've Done So Far

✅ Installed `@google-analytics/data` npm package
✅ Enabled Google Cloud SDK (gcloud) on your local machine
✅ Created analytics service and controller
✅ Added analytics routes to your Express app

## 🎯 What You Need To Do Next

### Step 1: Create a Google Analytics 4 Property (if you haven't already)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use an existing one
3. Note down your **Property ID** (format: `properties/123456789`)
   - Find it in: Admin → Property Settings → Property ID

### Step 2: Create a Service Account in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **"Create Service Account"**
5. Give it a name like `ga4-data-api-service`
6. Grant the role: **Viewer**
7. Click **Done**

### Step 3: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **JSON** format
5. Click **Create** - this downloads the JSON key file
6. **IMPORTANT**: Rename this file to `service-account-key.json`

### Step 4: Add Service Account to Google Analytics

1. Go back to [Google Analytics](https://analytics.google.com/)
2. Admin → Property Access Management
3. Click the **+** button → **Add users**
4. Enter the service account email (format: `your-service@project-id.iam.gserviceaccount.com`)
5. Select role: **Viewer**
6. Click **Add**

### Step 5: Set Up Project Credentials

1. Create a `credentials` folder in your project root:
   ```bash
   mkdir credentials
   ```

2. Move your downloaded JSON key file to this folder:
   ```bash
   mv ~/Downloads/service-account-key.json ./credentials/
   ```

3. **IMPORTANT**: Add to `.gitignore` (if not already there):
   ```bash
   echo "credentials/" >> .gitignore
   ```

4. Update your `.env` file with your Property ID:
   ```env
   GA4_PROPERTY_ID=123456789
   ```
   (Replace `123456789` with your actual Property ID - just the number, not "properties/")

### Step 6: Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Library**
3. Search for "Google Analytics Data API"
4. Click on it and click **Enable**

### Step 7: Test Your Setup

Run your application:
```bash
npm run dev
```

Look for this message in your console:
- ✅ `Google Analytics client initialized successfully` - You're good!
- ⚠️ Warning message - Check your configuration

### Step 8: Test the API Endpoints

Once your server is running, you can test these endpoints (you need to be logged in):

1. **Dashboard Overview**:
   ```bash
   curl http://localhost:3000/api/analytics/dashboard \
     -H "Cookie: authToken=YOUR_AUTH_TOKEN"
   ```

2. **Page Views**:
   ```bash
   curl "http://localhost:3000/api/analytics/page-views?startDate=7daysAgo&endDate=today" \
     -H "Cookie: authToken=YOUR_AUTH_TOKEN"
   ```

3. **Job Role Analytics**:
   ```bash
   curl "http://localhost:3000/api/analytics/job-roles?startDate=30daysAgo&endDate=today" \
     -H "Cookie: authToken=YOUR_AUTH_TOKEN"
   ```

4. **Custom Events**:
   ```bash
   curl "http://localhost:3000/api/analytics/events?eventName=job_application&startDate=7daysAgo&endDate=today" \
     -H "Cookie: authToken=YOUR_AUTH_TOKEN"
   ```

## 📊 Available Analytics Endpoints

All endpoints require authentication (protected by `requireAuth` middleware):

| Endpoint | Description | Query Parameters |
|----------|-------------|------------------|
| `GET /api/analytics/dashboard` | Overview dashboard with page views, active users, and top job roles | None |
| `GET /api/analytics/page-views` | Detailed page view statistics | `startDate`, `endDate` |
| `GET /api/analytics/job-roles` | Analytics for job role pages | `startDate`, `endDate` |
| `GET /api/analytics/events` | Custom event tracking | `eventName`, `startDate`, `endDate` |

## 🎨 Frontend Integration Example

Here's how you can fetch analytics data from your frontend:

```javascript
// Fetch dashboard data
async function fetchAnalyticsDashboard() {
  try {
    const response = await fetch('/api/analytics/dashboard');
    const data = await response.json();
    
    if (response.ok) {
      console.log('Active Users:', data.activeUsers);
      console.log('Page Views:', data.pageViews);
      console.log('Top Job Roles:', data.topJobRoles);
    } else {
      console.error('Analytics not configured:', data.error);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
}

// Fetch job role analytics
async function fetchJobRoleAnalytics() {
  const response = await fetch(
    '/api/analytics/job-roles?startDate=30daysAgo&endDate=today'
  );
  const data = await response.json();
  return data;
}
```

## 🔧 Troubleshooting

### Error: "Analytics client not initialized"
- Check that `GA4_PROPERTY_ID` is set in `.env`
- Verify `GOOGLE_APPLICATION_CREDENTIALS` path is correct
- Ensure the credentials file exists at the specified path

### Error: "PERMISSION_DENIED"
- Make sure you added the service account email to Google Analytics with Viewer permissions
- Wait a few minutes after adding permissions (can take time to propagate)

### Error: "API not enabled"
- Enable the Google Analytics Data API in Google Cloud Console
- Make sure you're using the correct Google Cloud project

### Error: "Invalid property ID"
- Property ID should be just the number (e.g., `123456789`)
- Don't include the "properties/" prefix in the `.env` file

## 📝 Environment Variables Summary

Your `.env` file should have:

```env
# Google Analytics Configuration
GA4_PROPERTY_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account-key.json
```

## 🔒 Security Notes

1. **Never commit** your service account JSON key to Git
2. Keep `credentials/` in `.gitignore`
3. Use environment variables for sensitive configuration
4. All analytics endpoints are protected by authentication
5. Consider adding admin-only access for analytics in production

## 📚 Additional Resources

- [Google Analytics Data API Docs](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Service Account Authentication](https://cloud.google.com/docs/authentication/getting-started)
- [GA4 Property Setup](https://support.google.com/analytics/answer/9304153)

## 🚀 Next Steps

Once you have analytics working, you can:

1. Create a dashboard view in your frontend to display analytics
2. Add custom event tracking for user actions (job applications, searches, etc.)
3. Set up automated reports
4. Add more specific metrics for your job application platform
5. Create admin-only analytics pages

Need help? The code is well-documented and follows TypeScript best practices!
