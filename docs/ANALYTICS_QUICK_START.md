# Google Analytics Quick Reference

## 🎯 Quick Setup Checklist

- [ ] Create GA4 property and get Property ID
- [ ] Create Google Cloud service account
- [ ] Download service account JSON key
- [ ] Enable Google Analytics Data API in Google Cloud
- [ ] Add service account email to GA4 with Viewer role
- [ ] Create `credentials/` folder in project root
- [ ] Move JSON key to `credentials/service-account-key.json`
- [ ] Update `.env` with your `GA4_PROPERTY_ID`
- [ ] Test: Run `npm run dev` and check for success message

## 📊 API Endpoints

All endpoints require authentication (user must be logged in):

```
GET /api/analytics/dashboard
GET /api/analytics/page-views?startDate=7daysAgo&endDate=today
GET /api/analytics/job-roles?startDate=30daysAgo&endDate=today
GET /api/analytics/events?eventName=job_application&startDate=7daysAgo&endDate=today
```

## 🔧 Environment Variables

```env
GA4_PROPERTY_ID=123456789
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account-key.json
```

## 🧪 Test Command

```bash
curl http://localhost:3000/api/analytics/dashboard \
  -H "Cookie: authToken=YOUR_TOKEN"
```

## 📁 Files Created

- `src/services/analyticsService.ts` - Core analytics logic
- `src/controllers/analyticsController.ts` - API endpoints handler
- `src/index.ts` - Routes added
- `docs/GOOGLE_ANALYTICS_SETUP.md` - Full setup guide

## 🔍 Troubleshooting

1. **Check console output** when server starts
2. **Verify Property ID** is just the number (no "properties/" prefix)
3. **Confirm API enabled** in Google Cloud Console
4. **Wait 5 minutes** after adding service account to GA4
5. **Check file path** to credentials matches `.env`

## 📖 Full Documentation

See `docs/GOOGLE_ANALYTICS_SETUP.md` for complete step-by-step guide.
