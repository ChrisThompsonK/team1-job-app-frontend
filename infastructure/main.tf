terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "terraform-state-mgmt"
    storage_account_name = "aistatemgmt"
    container_name       = "terraform-tfstate-ai"
    key                  = "team1-job-app-frontend.tfstate"
  }
}

provider "azurerm" {
  features {}
}

# Create Resource Group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }
}

# Create User Assigned Managed Identity
resource "azurerm_user_assigned_identity" "container_app_identity" {
  name                = "team1-job-app-frontend-identity"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }
}
data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group
}

# Assign AcrPull role to managed identity
resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.container_app_identity.principal_id
}

# Get current Azure AD tenant info
data "azurerm_client_config" "current" {}


# Reference existing Container App Environment Resource Group
data "azurerm_resource_group" "team1-job-app-rg" {
  name = var.existing_container_app_env_rg
}

# Reference existing Container App Environment
data "azurerm_container_app_environment" "team1-job-app-env" {
  name                = var.existing_container_app_env_name
  resource_group_name = data.azurerm_resource_group.team1-job-app-rg.name
}

data "azurerm_key_vault" "key-vault" {
  name                = var.key_vault_name
  resource_group_name = var.existing_container_app_env_rg
}

# Grant the container app identity access to the Key Vault
resource "azurerm_key_vault_access_policy" "container_app_policy" {
  key_vault_id       = data.azurerm_key_vault.key-vault.id
  tenant_id          = data.azurerm_client_config.current.tenant_id
  object_id          = azurerm_user_assigned_identity.container_app_identity.principal_id
  secret_permissions = ["Get", "List"]
}

# Example: Reference a secret from the Key Vault


resource "azurerm_container_app" "team1-job-app--frontend-container-app" {
  name                         = "team1-job-app-frontend-container-app"
  container_app_environment_id = data.azurerm_container_app_environment.team1-job-app-env.id
  resource_group_name          = var.existing_container_app_env_rg
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.container_app_identity.id]
  }

  registry {
    server   = data.azurerm_container_registry.acr.login_server
    identity = azurerm_user_assigned_identity.container_app_identity.id
  }

  template {
    container {
      name   = "team1-job-app-frontend-container-app"
      image  = "${data.azurerm_container_registry.acr.login_server}/${var.image_name}:${var.image_tag}"
      cpu    = 0.5
      memory = "1.0Gi"

      # Reference secrets from Key Vault
      env {
        name        = "NODE_ENV"
        secret_name = "node-env"
      }
      env {
        name        = "PORT"
        secret_name = "backend_port"
      }
      env {
        name        = "BACKEND_URL"
        secret_name = "backend_url"
      }
      env {
        name        = "GA4_PROPERTY_ID"
        secret_name = "ga4-property-id"
      }
      env {
        name        = "GOOGLE_APPLICATION_CREDENTIALS"
        secret_name = "google-application-credentials"
      }
      env {
        name        = "GA4_MEASUREMENT_ID"
        secret_name = "ga4_measurement-id"
      }
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_key_vault_access_policy.container_app_policy
  ]
}