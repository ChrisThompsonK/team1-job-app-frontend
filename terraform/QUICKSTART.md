# Terraform Quick Reference

## 🎯 Quick Commands

### Development Environment
```bash
# Using helper script (recommended)
./tf-helper.sh dev init
./tf-helper.sh dev plan
./tf-helper.sh dev apply

# Manual commands
terraform init -backend-config=backend-dev.tfvars
terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars
```

### Production Environment
```bash
# Using helper script
./tf-helper.sh prod init
./tf-helper.sh prod plan
./tf-helper.sh prod apply

# Manual commands
terraform init -backend-config=backend-prod.tfvars
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars -auto-approve
```

## 📋 Environment Comparison

| Feature | Dev | Prod |
|---------|-----|------|
| ACR Name | `aiacademy25dev` | `aiacademy25prod` |
| ACR SKU | Basic | Standard |
| Admin Enabled | ✅ Yes | ❌ No (use SP) |
| State File | `team1-frontend-dev.tfstate` | `team1-frontend-prod.tfstate` |

## 🔐 Authentication

### Local (Interactive)
```bash
az login
az account set --subscription "ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
```

### CI/CD (Non-interactive)
```bash
export ARM_CLIENT_ID="<from-azure-credentials>"
export ARM_CLIENT_SECRET="<from-azure-credentials>"
export ARM_SUBSCRIPTION_ID="ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
export ARM_TENANT_ID="f2ec3ef9-cca6-46ec-be61-845d74fcae94"
```

## 📊 Useful Commands

```bash
# Show outputs
terraform output
terraform output acr_login_server

# Format code
terraform fmt -recursive

# Validate
terraform validate

# Show state
terraform state list
terraform show

# Switch environments
terraform init -reconfigure -backend-config=backend-prod.tfvars
```

## 🚀 CI/CD Integration

The GitHub Actions workflow automatically:
- ✅ Runs on terraform file changes
- ✅ Plans on PRs
- ✅ Applies on main branch (dev)
- ✅ Supports manual triggers for any environment
- ✅ Posts plan results to PR comments

## 🎨 ACR Image Naming

After deployment, use ACR in your workflows:

```yaml
# Dev environment
image: aiacademy25dev.azurecr.io/job-app-frontend:latest

# Prod environment
image: aiacademy25prod.azurecr.io/job-app-frontend:latest
```

## 🔄 Common Workflows

### First Time Setup
```bash
cd terraform
./tf-helper.sh dev init
./tf-helper.sh dev plan
./tf-helper.sh dev apply
```

### Update Infrastructure
```bash
# Edit variables in dev.tfvars or main.tf
./tf-helper.sh dev plan
./tf-helper.sh dev apply
```

### Deploy to Production
```bash
./tf-helper.sh prod init
./tf-helper.sh prod plan
# Review carefully!
./tf-helper.sh prod apply
```

### View Current State
```bash
./tf-helper.sh dev output
```
