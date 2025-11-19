# Main configuration file - infrastructure modules are split across separate files
#
# File structure:
#   - provider.tf: Provider and backend configuration
#   - data.tf: Data sources
#   - identity.tf: Managed identity and role assignments
#   - container-app.tf: Container App configuration
#   - variables.tf: Variable definitions
#   - outputs.tf: Output values

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "Development"
    Project     = "team1-job-app-frontend"
  }
}