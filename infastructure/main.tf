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

# Create Container Registry
resource "azurerm_container_registry" "acr" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = var.container_registry_sku
  admin_enabled       = true

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }
}

# Create Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "law" {
  name                = var.log_analytics_workspace_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = var.log_analytics_sku
  retention_in_days   = var.log_retention_days

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }
}

# Create Container App Environment
resource "azurerm_container_app_environment" "cae" {
  name                       = var.container_app_environment_name
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }
}

# Create Container App
resource "azurerm_container_app" "app" {
  name                         = var.container_app_name
  container_app_environment_id = azurerm_container_app_environment.cae.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = var.container_app_name
      image  = "${azurerm_container_registry.acr.login_server}/${var.container_image_name}:${var.container_image_tag}"
      cpu    = var.container_cpu
      memory = var.container_memory

      env {
        name  = "PORT"
        value = var.container_port
      }
    }

    min_replicas = var.container_min_replicas
    max_replicas = var.container_max_replicas
  }

  ingress {
    external_enabled = true
    target_port      = tonumber(var.container_port)

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  registry {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
  }

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }

  depends_on = [
    azurerm_container_app_environment.cae
  ]
}