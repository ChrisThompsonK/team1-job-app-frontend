# Service Configuration

## Current Status: MEMORY SERVICE (Working UI)

The frontend is currently using **JobRoleMemoryService** which provides:
✅ **Working UI with sample data**
✅ **No connection issues**
✅ **Original styling and functionality**

## To Switch to Backend API:

When the backend is ready and stable, change line 7 in `src/index.ts`:

```typescript
// FROM (Current - Memory Service):
import { JobRoleMemoryService } from "./services/jobRoleMemoryService.js";
import { ProvideJobRoles } from "./services/jobRoleProvider.js";

const jobs = ProvideJobRoles();
const jobRoleService = new JobRoleMemoryService(jobs);

// TO (API Service):
import { JobRoleApiService } from "./services/jobRoleApiService.js";

const backendURL = process.env.BACKEND_URL || "http://localhost:3001/api";
const jobRoleService = new JobRoleApiService(backendURL);
```

## Backend Requirements:
- Backend must be running on http://localhost:3001
- Database must be seeded with: `npm run db:seed`
- Backend must return data in the expected format

## Current Working URLs:
- Frontend: http://localhost:3000 ✅
- Frontend Jobs: http://localhost:3000/job-roles ✅
- Backend API: http://localhost:3001/api/jobs (when running)