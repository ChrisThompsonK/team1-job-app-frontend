# Output values for use in GitHub Actions and other tools

# Container Registry Outputs
output "acr_login_server" {
  description = "The login server URL for the Azure Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_name" {
  description = "The name of the Azure Container Registry"
  value       = azurerm_container_registry.acr.name
}

output "acr_id" {
  description = "The resource ID of the Azure Container Registry"
  value       = azurerm_container_registry.acr.id
}

# Sensitive Outputs (only if admin enabled)
output "acr_admin_username" {
  description = "The admin username for the Azure Container Registry"
  value       = var.admin_enabled ? azurerm_container_registry.acr.admin_username : null
  sensitive   = true
}

output "acr_admin_password" {
  description = "The admin password for the Azure Container Registry"
  value       = var.admin_enabled ? azurerm_container_registry.acr.admin_password : null
  sensitive   = true
}

# Resource Group Outputs
output "resource_group_name" {
  description = "The name of the resource group"
  value       = data.azurerm_resource_group.container_registry.name
}

output "resource_group_location" {
  description = "The location of the resource group"
  value       = data.azurerm_resource_group.container_registry.location
}

# Environment Information
output "environment" {
  description = "The environment this infrastructure is deployed to"
  value       = var.environment
}

# Full image path for CI/CD
output "docker_image_prefix" {
  description = "Full Docker image prefix for use in CI/CD pipelines"
  value       = "${azurerm_container_registry.acr.login_server}/${var.project_name}"
}
