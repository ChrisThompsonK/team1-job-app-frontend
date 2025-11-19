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

output "key_vault_id" {
  description = "The ID of the referenced Key Vault"
  value       = data.azurerm_key_vault.key-vault.id
}

output "key_vault_uri" {
  description = "The URI of the referenced Key Vault"
  value       = data.azurerm_key_vault.key-vault.vault_uri
}

output "container_app_id" {
  description = "The ID of the Container App"
  value       = azurerm_container_app.team1-job-app-frontend-container-app.id
}