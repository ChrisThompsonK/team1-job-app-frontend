#!/bin/bash
# Terraform Environment Helper Script
# Usage: ./tf-helper.sh [dev|prod] [init|plan|apply|destroy|output]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Usage: $0 [dev|prod] [init|plan|apply|destroy|output]${NC}"
    echo ""
    echo "Examples:"
    echo "  $0 dev init    - Initialize dev environment"
    echo "  $0 dev plan    - Plan dev changes"
    echo "  $0 dev apply   - Apply dev changes"
    echo "  $0 prod plan   - Plan prod changes"
    echo "  $0 dev output  - Show dev outputs"
    exit 1
fi

ENVIRONMENT=$1
ACTION=$2

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|prod)$ ]]; then
    echo -e "${RED}Error: Environment must be 'dev' or 'prod'${NC}"
    exit 1
fi

# Set file paths
BACKEND_CONFIG="backend-${ENVIRONMENT}.tfvars"
VAR_FILE="${ENVIRONMENT}.tfvars"

echo -e "${GREEN}🚀 Running Terraform for ${ENVIRONMENT} environment${NC}"
echo ""

# Execute action
case $ACTION in
    init)
        echo -e "${YELLOW}Initializing Terraform with ${ENVIRONMENT} backend...${NC}"
        terraform init -backend-config="$BACKEND_CONFIG"
        ;;
    plan)
        echo -e "${YELLOW}Planning changes for ${ENVIRONMENT}...${NC}"
        terraform plan -var-file="$VAR_FILE"
        ;;
    apply)
        echo -e "${YELLOW}Applying changes for ${ENVIRONMENT}...${NC}"
        terraform apply -var-file="$VAR_FILE"
        ;;
    apply-auto)
        echo -e "${YELLOW}Applying changes for ${ENVIRONMENT} (auto-approve)...${NC}"
        terraform apply -var-file="$VAR_FILE" -auto-approve
        ;;
    destroy)
        echo -e "${RED}⚠️  WARNING: This will destroy ${ENVIRONMENT} infrastructure!${NC}"
        terraform destroy -var-file="$VAR_FILE"
        ;;
    output)
        echo -e "${YELLOW}Outputs for ${ENVIRONMENT}:${NC}"
        terraform output
        ;;
    *)
        echo -e "${RED}Error: Unknown action '$ACTION'${NC}"
        echo "Valid actions: init, plan, apply, apply-auto, destroy, output"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Done!${NC}"
