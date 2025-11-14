# Configure the Azure Provider
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  
  # Backend will be configured after storage account is created
  # For now, using local backend (state stored in terraform/ directory)
}

provider "azurerm" {
  features {}
  subscription_id = "ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
  tenant_id       = "f2ec3ef9-cca6-46ec-be61-845d74fcae94"
}

# Data source for existing resource group
data "azurerm_resource_group" "container_registry" {
  name = "container-registry"
}

# Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "aiacademy25"
  resource_group_name = data.azurerm_resource_group.container_registry.name
  location            = data.azurerm_resource_group.container_registry.location
  sku                 = "Basic"
  admin_enabled       = true
  
  tags = {
    environment = "learning"
    project     = "job-app-frontend"
    managed_by  = "terraform"
  }
}
