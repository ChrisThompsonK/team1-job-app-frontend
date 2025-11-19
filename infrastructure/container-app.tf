resource "azurerm_container_app" "team1-job-app-frontend-container-app" {
  name                         = "team1-job-app-frontend-container-app"
  container_app_environment_id = data.azurerm_container_app_environment.team1-job-app-env.id
  resource_group_name          = var.existing_container_app_env_rg
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.container_app_identity.id]
  }

  registry {
    server   = data.azurerm_container_registry.acr.login_server
    identity = azurerm_user_assigned_identity.container_app_identity.id
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    transport                  = "http"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    container {
      name   = "team1-job-app-frontend-container-app"
      image  = "${data.azurerm_container_registry.acr.login_server}/${var.image_name}:${var.image_tag}"
      cpu    = 0.5
      memory = "1.0Gi"

      # Reference secrets from Key Vault
      env {
        name        = "NODE_ENV"
        secret_name = "node-env"
      }
      env {
        name        = "PORT"
        secret_name = "backend-port"
      }
      env {
        name        = "BACKEND_URL"
        secret_name = "backend-url"
      }
      env {
        name        = "GA4_PROPERTY_ID"
        secret_name = "ga4-property-id"
      }
      env {
        name        = "GOOGLE_APPLICATION_CREDENTIALS"
        secret_name = "google-application-credentials"
      }
      env {
        name        = "GA4_MEASUREMENT_ID"
        secret_name = "ga4-measurement-id"
      }
    }
  }
  secret {
    name                = "node-env"
    key_vault_secret_id = "${data.azurerm_key_vault.key-vault.vault_uri}secrets/node-env"
    identity            = azurerm_user_assigned_identity.container_app_identity.id
  }
  secret {
    name                = "backend-port"
    key_vault_secret_id = "${data.azurerm_key_vault.key-vault.vault_uri}secrets/backend-port"
    identity            = azurerm_user_assigned_identity.container_app_identity.id
  }
  secret {
    name                = "backend-url"
    key_vault_secret_id = "${data.azurerm_key_vault.key-vault.vault_uri}secrets/backend_url"
    identity            = azurerm_user_assigned_identity.container_app_identity.id
  }
  secret {
    name                = "ga4-property-id"
    key_vault_secret_id = "${data.azurerm_key_vault.key-vault.vault_uri}secrets/ga4-property-id"
    identity            = azurerm_user_assigned_identity.container_app_identity.id
  }
  secret {
    name                = "google-application-credentials"
    key_vault_secret_id = "${data.azurerm_key_vault.key-vault.vault_uri}secrets/google-application-credentials"
    identity            = azurerm_user_assigned_identity.container_app_identity.id
  }
  secret {
    name                = "ga4-measurement-id"
    key_vault_secret_id = "${data.azurerm_key_vault.key-vault.vault_uri}secrets/ga4-measurement-id"
    identity            = azurerm_user_assigned_identity.container_app_identity.id
  }
  depends_on = [
    azurerm_role_assignment.acr_pull,
  ]
}
