# Backend configuration for DEVELOPMENT environment
# Use with: terraform init -backend-config=backend-dev.tfvars

resource_group_name  = "container-registry"
storage_account_name = "tfstateteam2jobappdev"
container_name       = "tfstate"
key                  = "team1-frontend-dev.tfstate"
