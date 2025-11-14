# Production Environment Configuration
environment     = "prod"
acr_name_prefix = "aiacademy25"
acr_sku         = "Standard"
admin_enabled   = false # Use service principal in production
project_name    = "job-app-frontend"
location        = "uksouth"

# Resource naming will result in: aiacademy25prod
# Note: Higher SKU for production reliability
