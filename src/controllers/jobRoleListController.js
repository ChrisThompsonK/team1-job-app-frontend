/**
 * Job Role List Controller
 * Handles search and filtering functionality for the job roles list page
 */

class JobRoleListController {
    constructor() {
        this.allJobCards = [];
        this.filteredJobCards = [];
        this.initializeElements();
        this.bindEvents();
    }

    // Initialize DOM elements
    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.capabilityFilter = document.getElementById('capabilityFilter');
        this.bandFilter = document.getElementById('bandFilter');
        this.locationFilter = document.getElementById('locationFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.resultsCount = document.getElementById('resultsCount');
        this.jobRolesGrid = document.getElementById('jobRolesGrid');
    }

    // Initialize the filtering system
    initializeFiltering() {
        this.allJobCards = Array.from(document.querySelectorAll('.job-card'));
        this.filteredJobCards = [...this.allJobCards];
        this.updateResultsCount();
        this.populateLocationFilter();
    }

    // Populate location filter with unique locations from job data
    populateLocationFilter() {
        const locations = new Set();
        this.allJobCards.forEach(card => {
            const location = card.getAttribute('data-job-location');
            if (location) locations.add(location);
        });

        // Clear existing options except "All Locations"
        this.locationFilter.innerHTML = '<option value="">All Locations</option>';
        
        // Add unique locations
        Array.from(locations).sort().forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            this.locationFilter.appendChild(option);
        });
    }

    // Filter job cards based on current filter values
    filterJobs() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const selectedCapability = this.capabilityFilter.value;
        const selectedBand = this.bandFilter.value;
        const selectedLocation = this.locationFilter.value;
        const selectedStatus = this.statusFilter.value;

        this.filteredJobCards = this.allJobCards.filter(card => {
            // Search filter (job name)
            const jobName = card.getAttribute('data-job-name') || '';
            const matchesSearch = !searchTerm || jobName.includes(searchTerm);

            // Capability filter
            const jobCapability = card.getAttribute('data-job-capability') || '';
            const matchesCapability = !selectedCapability || jobCapability === selectedCapability;

            // Band filter
            const jobBand = card.getAttribute('data-job-band') || '';
            const matchesBand = !selectedBand || jobBand === selectedBand;

            // Location filter
            const jobLocation = card.getAttribute('data-job-location') || '';
            const matchesLocation = !selectedLocation || jobLocation === selectedLocation;

            // Status filter
            const jobStatus = card.getAttribute('data-job-status') || '';
            const matchesStatus = !selectedStatus || jobStatus === selectedStatus;

            return matchesSearch && matchesCapability && matchesBand && matchesLocation && matchesStatus;
        });

        // Show/hide job cards
        this.allJobCards.forEach(card => {
            if (this.filteredJobCards.includes(card)) {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });

        this.updateResultsCount();
        this.showEmptyState();
    }

    // Update results counter
    updateResultsCount() {
        const count = this.filteredJobCards.length;
        const total = this.allJobCards.length;
        
        if (count === total) {
            this.resultsCount.textContent = `Showing all ${total} job role${total !== 1 ? 's' : ''}`;
        } else {
            this.resultsCount.textContent = `Showing ${count} of ${total} job role${total !== 1 ? 's' : ''}`;
        }
    }

    // Show empty state when no jobs match filters
    showEmptyState() {
        const existingEmptyState = document.getElementById('emptyFilterState');
        
        if (this.filteredJobCards.length === 0) {
            if (!existingEmptyState) {
                const emptyState = document.createElement('div');
                emptyState.id = 'emptyFilterState';
                emptyState.className = 'col-span-full text-center py-16';
                emptyState.innerHTML = `
                    <div class="max-w-md mx-auto">
                        <svg class="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <h3 class="text-xl font-semibold text-base-content mb-2">No Jobs Found</h3>
                        <p class="text-base-content/60 mb-4">No job roles match your current search and filter criteria.</p>
                        <button class="btn btn-primary btn-sm" onclick="jobRoleListController.clearAllFilters()">Clear All Filters</button>
                    </div>
                `;
                this.jobRolesGrid.appendChild(emptyState);
            }
        } else {
            if (existingEmptyState) {
                existingEmptyState.remove();
            }
        }
    }

    // Clear all filters
    clearAllFilters() {
        this.searchInput.value = '';
        this.capabilityFilter.value = '';
        this.bandFilter.value = '';
        this.locationFilter.value = '';
        this.statusFilter.value = '';
        this.filterJobs();
    }

    // Debounce function for search input
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Bind event listeners
    bindEvents() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Initialize filtering system
        this.initializeFiltering();

        // Clear filters button
        this.clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());

        // Real-time search with debouncing
        const debouncedFilter = this.debounce(() => this.filterJobs(), 300);
        this.searchInput.addEventListener('input', debouncedFilter);

        // Real-time filter changes
        this.capabilityFilter.addEventListener('change', () => this.filterJobs());
        this.bandFilter.addEventListener('change', () => this.filterJobs());
        this.locationFilter.addEventListener('change', () => this.filterJobs());
        this.statusFilter.addEventListener('change', () => this.filterJobs());
    }
}

// Initialize the controller when the script loads
let jobRoleListController;

// Ensure the controller is initialized
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        jobRoleListController = new JobRoleListController();
    });
} else {
    jobRoleListController = new JobRoleListController();
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobRoleListController;
}