# Terraform Configuration for Azure Container Registry

This directory contains Terraform configuration for managing the Azure Container Registry infrastructure with **environment-based deployment** (dev, prod) and **remote state management** for CI/CD pipelines.

## 🏗️ Architecture Overview

- **Multi-environment setup**: Separate ACR instances for dev and prod
- **Remote state**: Stored in Azure Storage for team collaboration
- **Service principal authentication**: Pipeline-ready with non-interactive auth
- **Dynamic naming**: Resources named with environment suffix (e.g., `aiacademy25dev`)

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.0
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated
- Azure subscription with appropriate permissions

## 🚀 Quick Start

### Option 1: Development Environment (Recommended First)

```bash
cd terraform

# Initialize with dev backend
terraform init -backend-config=backend-dev.tfvars

# Plan with dev variables
terraform plan -var-file=dev.tfvars

# Apply changes
terraform apply -var-file=dev.tfvars
```

### Option 2: Production Environment

```bash
cd terraform

# Initialize with prod backend
terraform init -backend-config=backend-prod.tfvars

# Plan with prod variables
terraform plan -var-file=prod.tfvars

# Apply changes (with auto-approve for pipelines)
terraform apply -var-file=prod.tfvars -auto-approve
```

## 📁 File Structure

```
terraform/
├── main.tf                 # Main infrastructure configuration
├── variables.tf            # Variable definitions
├── outputs.tf              # Output values for CI/CD
├── backend-dev.tfvars      # Backend config for dev environment
├── backend-prod.tfvars     # Backend config for prod environment
├── dev.tfvars              # Dev environment variables
├── prod.tfvars             # Prod environment variables
├── .terraform-version      # Terraform version pin
└── README.md              # This file
```

## 🔧 Environment Configuration

### Development (dev.tfvars)
- **ACR Name**: `aiacademy25dev`
- **SKU**: Basic
- **Admin Enabled**: Yes (for development ease)
- **State File**: `team1-frontend-dev.tfstate`

### Production (prod.tfvars)
- **ACR Name**: `aiacademy25prod`
- **SKU**: Standard (higher reliability)
- **Admin Enabled**: No (use service principal)
- **State File**: `team1-frontend-prod.tfstate`

## 🔐 Authentication

### Local Development
```bash
# Login to Azure
az login

# Set subscription (if you have multiple)
az account set --subscription "ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
```

### CI/CD Pipeline (Service Principal)

Set these environment variables in your pipeline:

```bash
export ARM_CLIENT_ID="<service-principal-client-id>"
export ARM_CLIENT_SECRET="<service-principal-secret>"
export ARM_SUBSCRIPTION_ID="ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
export ARM_TENANT_ID="f2ec3ef9-cca6-46ec-be61-845d74fcae94"
```

Terraform will automatically use these for authentication.

## 🔄 Switching Between Environments

To switch from dev to prod (or vice versa):

```bash
# Re-initialize with different backend
terraform init -reconfigure -backend-config=backend-prod.tfvars

# Apply with prod variables
terraform apply -var-file=prod.tfvars
```

## 📊 Viewing Outputs

```bash
# View all outputs
terraform output

# View specific output
terraform output acr_login_server

# View sensitive outputs
terraform output -raw acr_admin_password
```

## 🤖 CI/CD Pipeline Integration

### GitHub Actions Example

```yaml
- name: Terraform Init
  run: |
    cd terraform
    terraform init -backend-config=backend-dev.tfvars

- name: Terraform Plan
  run: |
    cd terraform
    terraform plan -var-file=dev.tfvars -out=tfplan

- name: Terraform Apply
  run: |
    cd terraform
    terraform apply -auto-approve tfplan

- name: Get ACR Login Server
  id: acr
  run: |
    ACR_SERVER=$(terraform output -raw acr_login_server)
    echo "login_server=$ACR_SERVER" >> $GITHUB_OUTPUT
```

## 🧪 Testing Changes

```bash
# Format code
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan without applying (dry run)
terraform plan -var-file=dev.tfvars

# Show current state
terraform show
```

## 📋 Common Commands

```bash
# Initialize (first time or after backend changes)
terraform init -backend-config=backend-dev.tfvars

# Format all files
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan changes
terraform plan -var-file=dev.tfvars

# Apply changes (interactive)
terraform apply -var-file=dev.tfvars

# Apply changes (non-interactive for pipelines)
terraform apply -var-file=dev.tfvars -auto-approve

# Show current state
terraform show

# List resources in state
terraform state list

# View outputs
terraform output

# Destroy infrastructure (careful!)
terraform destroy -var-file=dev.tfvars
```

## 🎯 Resource Naming Convention

Resources follow this pattern:
- **Dev**: `{prefix}dev` → `aiacademy25dev`
- **Prod**: `{prefix}prod` → `aiacademy25prod`

This makes it easy to identify environment and add new environments (staging, test, etc.)

## 🔍 Troubleshooting

### State Lock Issues

If state is locked, wait for other operations to complete or force unlock:

```bash
terraform force-unlock <lock-id>
```

### Backend Re-initialization

If you change backend config:

```bash
terraform init -reconfigure -backend-config=backend-dev.tfvars
```

### Import Existing Resources

If you have existing ACR that you want to manage:

```bash
# For dev environment
terraform import -var-file=dev.tfvars \
  azurerm_container_registry.acr \
  /subscriptions/ef1b41f6-e4b2-41d0-a52d-d279af4a77ab/resourceGroups/container-registry/providers/Microsoft.ContainerRegistry/registries/aiacademy25dev
```

## 📦 Remote State Details

- **Storage Account**: `tfstateteam2jobappdev`
- **Container**: `tfstate`
- **Dev State Key**: `team1-frontend-dev.tfstate`
- **Prod State Key**: `team1-frontend-prod.tfstate`

Benefits:
- ✅ Team collaboration (shared state)
- ✅ State locking (prevents conflicts)
- ✅ CI/CD ready (no local state files)
- ✅ State versioning and backup

## 🛡️ Security Best Practices

1. **Never commit secrets** to Git
2. **Use service principal** in pipelines (not admin credentials)
3. **Enable admin only in dev** for testing convenience
4. **Store sensitive outputs** securely (marked as `sensitive = true`)
5. **Use remote state** with access controls

## 🚀 Adding New Environments

To add a staging environment:

1. Create `staging.tfvars`:
```hcl
environment = "staging"
acr_sku     = "Standard"
```

2. Create `backend-staging.tfvars`:
```hcl
key = "team1-frontend-staging.tfstate"
```

3. Deploy:
```bash
terraform init -backend-config=backend-staging.tfvars
terraform apply -var-file=staging.tfvars
```

## 📝 Notes

- State files contain sensitive data - never commit them to Git
- Always run `terraform plan` before `terraform apply`
- Use workspaces OR separate state files for environments (we use separate state files)
- The `-auto-approve` flag skips confirmation (use in pipelines only)
