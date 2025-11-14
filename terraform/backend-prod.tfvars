# Backend configuration for PRODUCTION environment
# Use with: terraform init -backend-config=backend-prod.tfvars

resource_group_name  = "container-registry"
storage_account_name = "tfstateteam2jobappdev"
container_name       = "tfstate"
key                  = "team1-frontend-prod.tfstate"
