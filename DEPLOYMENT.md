# Deployment contract

The same repository deploys to AWS ECS or Azure AKS. Select the provider with the repository variable `DEPLOY_TARGET=aws` or `DEPLOY_TARGET=azure`. Put environment-specific values in the GitHub Environments named `staging` and `production`.

## Common

- Secret `MACHINA_API_KEY`: project-scoped key used by the app and the backend deployment workflow.
- Variable `MACHINA_ORG_ID`: organization whose Machina pod is deployed.
- Runtime variables/secrets in the ECS task definition or AKS Deployment: `MACHINA_API_URL`, `MACHINA_API_KEY`, `MACHINA_AGENT`.

## AWS ECS variables

- `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `AWS_ECR_REPOSITORY`
- `AWS_ECS_CONTAINER_NAME`
- `AWS_ECS_TASK_DEFINITION_STAGING`, `AWS_ECS_CLUSTER_STAGING`, `AWS_ECS_SERVICE_STAGING`
- `AWS_ECS_TASK_DEFINITION_PRODUCTION`, `AWS_ECS_CLUSTER_PRODUCTION`, `AWS_ECS_SERVICE_PRODUCTION`

The role uses GitHub OIDC; do not store long-lived AWS keys.

## Azure AKS variables

- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
- `AZURE_ACR_NAME`, `AZURE_ACR_LOGIN_SERVER`
- `AZURE_AKS_CLUSTER_STAGING`, `AZURE_AKS_RESOURCE_GROUP_STAGING`, `AZURE_AKS_NAMESPACE_STAGING`
- `AZURE_AKS_CLUSTER_PRODUCTION`, `AZURE_AKS_RESOURCE_GROUP_PRODUCTION`, `AZURE_AKS_NAMESPACE_PRODUCTION`

The Azure identity uses federated OIDC credentials. The cluster must already contain a Deployment and container named `{{APP_SLUG}}`.

## Release behavior

- Push to `main`: verify and deploy frontend to staging.
- Push a `v*` tag or manually run the workflow: verify and deploy frontend to production.
- Manually run `Machina pod production`: deploy/update the backend pod through `machina-cli`.
