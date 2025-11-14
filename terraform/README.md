# Terraform Configuration for Azure Container Registry

This directory contains Terraform configuration for managing the Azure Container Registry infrastructure.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated
- Azure subscription with appropriate permissions

## Quick Start

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Import Existing Resources (First Time Only)

If you have existing Azure resources, import them:

```bash
# Import the Azure Container Registry
terraform import azurerm_container_registry.acr /subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab/resourceGroups/container-registry/providers/Microsoft.ContainerRegistry/registries/aiacademy25
```

### 3. Plan Changes

Review what Terraform will do:

```bash
terraform plan
```

### 4. Apply Changes

Apply the configuration:

```bash
terraform apply
```

## Configuration Files

- `main.tf` - Main infrastructure configuration
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `.gitignore` - Files to exclude from Git

## Outputs

After applying, Terraform provides useful outputs:

```bash
# View all outputs
terraform output

# View specific output
terraform output acr_login_server
```

## Common Commands

```bash
# Format code
terraform fmt

# Validate configuration
terraform validate

# Show current state
terraform show

# List resources in state
terraform state list

# Destroy infrastructure (careful!)
terraform destroy
```

## State Management

Terraform state is stored in Azure Storage (configured in `main.tf` backend).
This allows team collaboration and prevents conflicts.

## Troubleshooting

### Authentication Issues

```bash
# Login to Azure
az login

# Set subscription (if you have multiple)
az account set --subscription "your-subscription-id"
```

### State Lock Issues

If state is locked, wait for other operations to complete or force unlock:

```bash
terraform force-unlock <lock-id>
```

## Notes

- State files contain sensitive data - never commit them to Git
- Always run `terraform plan` before `terraform apply`
- Use workspaces for multiple environments (dev, staging, prod)
