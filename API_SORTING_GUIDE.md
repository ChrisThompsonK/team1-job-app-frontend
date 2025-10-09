# Job Sorting API - Frontend Integration Guide

This guide provides comprehensive examples for frontend developers on how to use the sorting functionality of the Job Application Backend API.

## 📍 Base URL

```
http://localhost:3000/api/jobs/search
```

## 🔧 Sorting Parameters

### Available Sort Fields (`sortBy`)

| Field | Description | Example Values |
|-------|-------------|----------------|
| `jobRoleName` | Sort by job title/name | "Senior Engineer", "Data Analyst" |
| `closingDate` | Sort by application deadline | "2025-12-31" |
| `band` | Sort by seniority level | Junior, Mid, Senior, Principal |
| `capability` | Sort by department/capability | Data & Analytics, Engineering |
| `location` | Sort by job location | London, Manchester, Remote |
| `createdDate` | Sort by when job was posted | "2025-10-01" |

### Sort Order (`sortOrder`)

| Value | Description |
|-------|-------------|
| `asc` | Ascending order (A-Z, 0-9, oldest-newest) |
| `desc` | Descending order (Z-A, 9-0, newest-oldest) |

**Default:** If no `sortOrder` is specified, it defaults to `asc`.

---

## 🎯 Use Cases & Examples

### 1. Sort Jobs Alphabetically by Name

**Use Case:** Display jobs in alphabetical order (A-Z)

```javascript
// Fetch jobs sorted by name (A-Z)
fetch("http://localhost:3000/api/jobs/search?sortBy=jobRoleName&sortOrder=asc")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data); // Array of jobs sorted A-Z
  });
```

**Example Response:**
```json
{
  "success": true,
  "message": "Filtered jobs retrieved successfully",
  "data": [
    {
      "id": "1",
      "jobRoleName": "Business Analyst",
      "capability": "Business Analysis",
      "band": "Mid"
    },
    {
      "id": "2",
      "jobRoleName": "Data Engineer",
      "capability": "Data & Analytics",
      "band": "Senior"
    },
    {
      "id": "3",
      "jobRoleName": "Senior Software Engineer",
      "capability": "Engineering",
      "band": "Senior"
    }
  ]
}
```

---

### 2. Sort Jobs by Closing Date (Most Urgent First)

**Use Case:** Show jobs closing soonest at the top

```javascript
// Fetch jobs sorted by closing date (soonest first)
fetch(
  "http://localhost:3000/api/jobs/search?sortBy=closingDate&sortOrder=asc"
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs closing soon:", data.data);
  });
```

**cURL Example:**
```bash
curl "http://localhost:3000/api/jobs/search?sortBy=closingDate&sortOrder=asc"
```

---

### 3. Sort Jobs by Closing Date (Latest Deadlines First)

**Use Case:** Show jobs with furthest deadlines at the top

```javascript
// Fetch jobs sorted by closing date (latest first)
fetch(
  "http://localhost:3000/api/jobs/search?sortBy=closingDate&sortOrder=desc"
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs with latest deadlines:", data.data);
  });
```

---

### 4. Sort by Seniority Level (Band)

**Use Case:** Show jobs ordered by seniority (Junior → Principal)

```javascript
// Fetch jobs sorted by band (ascending)
fetch("http://localhost:3000/api/jobs/search?sortBy=band&sortOrder=asc")
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs by seniority (low to high):", data.data);
  });
```

**Reverse order (Principal → Junior):**
```javascript
fetch("http://localhost:3000/api/jobs/search?sortBy=band&sortOrder=desc")
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs by seniority (high to low):", data.data);
  });
```

---

### 5. Sort by Capability/Department

**Use Case:** Group jobs by department alphabetically

```javascript
// Fetch jobs sorted by capability
fetch("http://localhost:3000/api/jobs/search?sortBy=capability&sortOrder=asc")
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs sorted by department:", data.data);
  });
```

---

### 6. Sort by Location

**Use Case:** Display jobs alphabetically by location

```javascript
// Fetch jobs sorted by location
fetch("http://localhost:3000/api/jobs/search?sortBy=location&sortOrder=asc")
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs sorted by location:", data.data);
  });
```

---

### 7. Sort by Newest Jobs First (Recently Posted)

**Use Case:** Show most recently posted jobs at the top

```javascript
// Fetch jobs sorted by creation date (newest first)
fetch(
  "http://localhost:3000/api/jobs/search?sortBy=createdDate&sortOrder=desc"
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Newest jobs:", data.data);
  });
```

---

### 8. Combined Sorting with Filtering

**Use Case:** Filter Engineering jobs and sort by closing date

```javascript
// Fetch Engineering jobs sorted by closing date (soonest first)
const params = new URLSearchParams({
  capability: "ENGINEERING",
  sortBy: "closingDate",
  sortOrder: "asc",
});

fetch(`http://localhost:3000/api/jobs/search?${params}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Engineering jobs closing soon:", data.data);
  });
```

**Another Example: Senior roles in London, sorted by name**
```javascript
const params = new URLSearchParams({
  band: "SENIOR",
  location: "London",
  sortBy: "jobRoleName",
  sortOrder: "asc",
});

fetch(`http://localhost:3000/api/jobs/search?${params}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Senior jobs in London:", data.data);
  });
```

---

### 9. Sorting with Pagination

**Use Case:** Show jobs sorted by closing date, 20 per page

```javascript
// Fetch page 1 of jobs sorted by closing date
const params = new URLSearchParams({
  sortBy: "closingDate",
  sortOrder: "asc",
  page: "1",
  limit: "20",
});

fetch(`http://localhost:3000/api/jobs/search?${params}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Jobs:", data.data);
    console.log("Pagination:", data.pagination);
    /*
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalItems: 45,
      itemsPerPage: 20,
      hasNextPage: true,
      hasPreviousPage: false
    }
    */
  });
```

---

### 10. Search with Sorting

**Use Case:** Search for "engineer" jobs and sort results by band

```javascript
// Search and sort
const params = new URLSearchParams({
  search: "engineer",
  sortBy: "band",
  sortOrder: "asc",
});

fetch(`http://localhost:3000/api/jobs/search?${params}`)
  .then((response) => response.json())
  .then((data) => {
    console.log("Engineer jobs sorted by seniority:", data.data);
  });
```

---

## 🎨 React Component Example

Here's a complete React example with a sortable jobs table:

```jsx
import { useState, useEffect } from "react";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [sortBy, setSortBy] = useState("jobRoleName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [sortBy, sortOrder]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      const response = await fetch(
        `http://localhost:3000/api/jobs/search?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order if clicking same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div>
      <h1>Available Jobs</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("jobRoleName")}>
              Job Title {getSortIcon("jobRoleName")}
            </th>
            <th onClick={() => handleSort("capability")}>
              Capability {getSortIcon("capability")}
            </th>
            <th onClick={() => handleSort("band")}>
              Band {getSortIcon("band")}
            </th>
            <th onClick={() => handleSort("location")}>
              Location {getSortIcon("location")}
            </th>
            <th onClick={() => handleSort("closingDate")}>
              Closing Date {getSortIcon("closingDate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.jobRoleName}</td>
              <td>{job.capability}</td>
              <td>{job.band}</td>
              <td>{job.location}</td>
              <td>{new Date(job.closingDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsList;
```

---

## 🔄 Vue.js Example

```vue
<template>
  <div>
    <h1>Available Jobs</h1>

    <div class="sort-controls">
      <label>
        Sort by:
        <select v-model="sortBy" @change="fetchJobs">
          <option value="jobRoleName">Job Title</option>
          <option value="closingDate">Closing Date</option>
          <option value="band">Band</option>
          <option value="capability">Capability</option>
          <option value="location">Location</option>
          <option value="createdDate">Date Posted</option>
        </select>
      </label>

      <label>
        Order:
        <select v-model="sortOrder" @change="fetchJobs">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>

    <div v-if="loading">Loading jobs...</div>

    <table v-else>
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Capability</th>
          <th>Band</th>
          <th>Location</th>
          <th>Closing Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobs" :key="job.id">
          <td>{{ job.jobRoleName }}</td>
          <td>{{ job.capability }}</td>
          <td>{{ job.band }}</td>
          <td>{{ job.location }}</td>
          <td>{{ formatDate(job.closingDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobs: [],
      sortBy: "jobRoleName",
      sortOrder: "asc",
      loading: false,
    };
  },
  mounted() {
    this.fetchJobs();
  },
  methods: {
    async fetchJobs() {
      this.loading = true;
      try {
        const params = new URLSearchParams({
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
        });

        const response = await fetch(
          `http://localhost:3000/api/jobs/search?${params}`
        );
        const data = await response.json();

        if (data.success) {
          this.jobs = data.data;
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>
```

---

## 📋 Quick Reference: All Sort Options

| Sort By | Sort Order | Use Case |
|---------|------------|----------|
| `jobRoleName` | `asc` | A-Z job titles |
| `jobRoleName` | `desc` | Z-A job titles |
| `closingDate` | `asc` | Soonest deadlines first |
| `closingDate` | `desc` | Latest deadlines first |
| `band` | `asc` | Junior → Principal |
| `band` | `desc` | Principal → Junior |
| `capability` | `asc` | Departments A-Z |
| `capability` | `desc` | Departments Z-A |
| `location` | `asc` | Locations A-Z |
| `location` | `desc` | Locations Z-A |
| `createdDate` | `asc` | Oldest jobs first |
| `createdDate` | `desc` | Newest jobs first |

---

## ❌ Error Handling

```javascript
const fetchJobsWithErrorHandling = async (sortBy, sortOrder) => {
  try {
    const params = new URLSearchParams({
      sortBy: sortBy,
      sortOrder: sortOrder,
    });

    const response = await fetch(
      `http://localhost:3000/api/jobs/search?${params}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch jobs");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Show user-friendly error message
    return [];
  }
};
```

---

## 🧪 Testing Sorting with cURL

```bash
# Test 1: Sort by job name A-Z
curl "http://localhost:3000/api/jobs/search?sortBy=jobRoleName&sortOrder=asc"

# Test 2: Sort by closing date (soonest first)
curl "http://localhost:3000/api/jobs/search?sortBy=closingDate&sortOrder=asc"

# Test 3: Sort by band (descending)
curl "http://localhost:3000/api/jobs/search?sortBy=band&sortOrder=desc"

# Test 4: Combined filter + sort
curl "http://localhost:3000/api/jobs/search?capability=ENGINEERING&sortBy=closingDate&sortOrder=asc"

# Test 5: Sort with pagination
curl "http://localhost:3000/api/jobs/search?sortBy=jobRoleName&sortOrder=asc&page=1&limit=5"
```

---

## 💡 Best Practices

1. **Always validate sort parameters** before sending requests
2. **Use URLSearchParams** to properly encode query parameters
3. **Handle loading states** to improve user experience
4. **Implement error handling** for failed requests
5. **Cache results** when appropriate to reduce API calls
6. **Show visual indicators** (arrows/icons) for current sort state
7. **Allow users to toggle** sort order by clicking column headers
8. **Combine sorting with filtering** for powerful search capabilities

---

## 📞 Support

For questions or issues, contact the backend team or refer to the main [README.md](./readme.md) for additional API documentation.
