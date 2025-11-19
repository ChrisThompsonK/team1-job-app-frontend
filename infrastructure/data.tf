
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

# Reference Container Registry
data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group
}

# Reference Key Vault
data "azurerm_key_vault" "key-vault" {
  name                = var.key_vault_name
  resource_group_name = var.existing_container_app_env_rg
}
