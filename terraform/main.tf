# Configure the Azure Provider
terraform {
  required_version = ">= 1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  # Remote state backend configuration
  # This allows team collaboration and CI/CD pipeline usage
  # Backend config must be provided at init time (cannot use variables)
  # Use: terraform init -backend-config="key=team1-frontend-dev.tfstate"
  backend "azurerm" {
    resource_group_name  = "container-registry"
    storage_account_name = "tfstateteam2jobappdev"
    container_name       = "tfstate"
    # key will be provided via -backend-config at init time
  }
}

provider "azurerm" {
  features {}

  # Service principal authentication for CI/CD
  # These values come from environment variables:
  # ARM_CLIENT_ID, ARM_CLIENT_SECRET, ARM_SUBSCRIPTION_ID, ARM_TENANT_ID
  # Fallback to defaults if not in pipeline
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}

# Data source for existing resource group
data "azurerm_resource_group" "container_registry" {
  name = var.resource_group_name
}

# Azure Container Registry with environment-specific naming
resource "azurerm_container_registry" "acr" {
  # Name format: aiacademy25dev or aiacademy25prod
  name                = "${var.acr_name_prefix}${var.environment}"
  resource_group_name = data.azurerm_resource_group.container_registry.name
  location            = var.location
  sku                 = var.acr_sku
  admin_enabled       = var.admin_enabled

  tags = {
    environment = var.environment
    project     = var.project_name
    managed_by  = "terraform"
    team        = "team1"
  }
}
