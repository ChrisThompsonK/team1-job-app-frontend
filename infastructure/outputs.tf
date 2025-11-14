output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "resource_group_id" {
  description = "The ID of the resource group"
  value       = azurerm_resource_group.rg.id
}

output "resource_group_location" {
  description = "The location of the resource group"
  value       = azurerm_resource_group.rg.location
}

# Container Registry Outputs
output "container_registry_name" {
  description = "The name of the container registry"
  value       = azurerm_container_registry.acr.name
}

output "container_registry_id" {
  description = "The ID of the container registry"
  value       = azurerm_container_registry.acr.id
}

output "container_registry_login_server" {
  description = "The login server of the container registry"
  value       = azurerm_container_registry.acr.login_server
}

output "container_registry_admin_username" {
  description = "The admin username of the container registry"
  value       = azurerm_container_registry.acr.admin_username
  sensitive   = true
}

# Container App Environment Outputs
output "container_app_environment_id" {
  description = "The ID of the container app environment"
  value       = azurerm_container_app_environment.cae.id
}

output "container_app_environment_name" {
  description = "The name of the container app environment"
  value       = azurerm_container_app_environment.cae.name
}

# Container App Outputs
output "container_app_id" {
  description = "The ID of the container app"
  value       = azurerm_container_app.app.id
}

output "container_app_name" {
  description = "The name of the container app"
  value       = azurerm_container_app.app.name
}

output "container_app_fqdn" {
  description = "The fully qualified domain name of the container app"
  value       = azurerm_container_app.app.ingress[0].fqdn
}

output "container_app_url" {
  description = "The URL of the container app"
  value       = "https://${azurerm_container_app.app.ingress[0].fqdn}"
}

# Log Analytics Outputs
output "log_analytics_workspace_id" {
  description = "The ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.law.id
}

output "log_analytics_workspace_name" {
  description = "The name of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.law.name
}
