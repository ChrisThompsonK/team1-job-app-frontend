# Main configuration file - infrastructure modules are split across separate files
#
# File structure:
#   - provider.tf: Provider and backend configuration
#   - data.tf: Data sources and resource group references
#   - identity.tf: Managed identity and role assignments
#   - container-app.tf: Container App configuration
#   - variables.tf: Variable definitions
#   - outputs.tf: Output values