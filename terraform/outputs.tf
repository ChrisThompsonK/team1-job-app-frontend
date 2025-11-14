# Output values for use in GitHub Actions and other tools
output "acr_login_server" {
  description = "The login server URL for the Azure Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_name" {
  description = "The name of the Azure Container Registry"
  value       = azurerm_container_registry.acr.name
}

output "acr_admin_username" {
  description = "The admin username for the Azure Container Registry"
  value       = azurerm_container_registry.acr.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "The admin password for the Azure Container Registry"
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}

output "acr_id" {
  description = "The resource ID of the Azure Container Registry"
  value       = azurerm_container_registry.acr.id
}

output "resource_group_name" {
  description = "The name of the resource group"
  value       = data.azurerm_resource_group.container_registry.name
}

output "resource_group_location" {
  description = "The location of the resource group"
  value       = data.azurerm_resource_group.container_registry.location
}
