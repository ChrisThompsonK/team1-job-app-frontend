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

# Get the latest image tag from ACR
data "external" "latest_image_tag" {
  program = ["bash", "-c", "az acr repository show-tags --name ${var.acr_name} --repository ${var.image_name} --orderby time_desc --top 1 --output json | jq -r '.[0] // \"latest\"' | jq -R '{tag: .}'"]

  depends_on = [azurerm_container_registry.acr]
}

# Reference existing Container App Environment Resource Group
data "azurerm_resource_group" "team1-job-app-rg" {
  name = var.existing_container_app_env_rg
}

# Reference existing Container App Environment
data "azurerm_container_app_environment" "team1-job-app-env" {
  name                = var.existing_container_app_env_name
  resource_group_name = data.azurerm_resource_group.team1-job-app-rg.name
}

resource "azurerm_container_app" "team1-job-app--frontend-container-app" {
  name                         = "team1-job-app-frontend-container-app"
  container_app_environment_id = data.azurerm_container_app_environment.team1-job-app-env.id
  resource_group_name          = data.azurerm_resource_group.team1-job-app-env-rg.name
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.container_app_identity.id]
  }

  registry {
    server   = azurerm_container_registry.acr.login_server
    identity = azurerm_user_assigned_identity.container_app_identity.id
  }

  template {
    container {
      name   = "team1-job-app-frontend-container-app"
      image  = "${azurerm_container_registry.acr.login_server}/${var.image_name}:${data.external.latest_image_tag.result.tag}"
      cpu    = 0.5
      memory = "1.0Gi"
    }
  }

  depends_on = [azurerm_role_assignment.acr_pull]
}