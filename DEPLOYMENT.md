# Deployment contract

The same repository deploys to AWS ECS or Azure AKS. Select the provider with the repository variable `DEPLOY_TARGET=aws` or `DEPLOY_TARGET=azure`. Put environment-specific values in the GitHub Environments named `staging` and `production`.

## Common

- Secret `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN`: server-side credential used by the app. API keys use `X-Api-Token`; project tokens use `X-Project-Token`. Neither is ever sent on the `Authorization` header.
- Variable `MACHINA_ORG_ID`: organization whose Machina pod is deployed.
- Runtime variables/secrets in the ECS task definition or AKS Deployment: `MACHINA_API_URL`, `MACHINA_AGENT`, and either `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN`.

## Credentials are injected at runtime, never at build time

The image is built from a context that includes the whole repository (`COPY . .`), so anything a build step writes to disk ends up in a published image layer. A pod credential in that layer is readable by anyone who can pull the image.

- No build step writes `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN` to a `.env` file, and neither is a Docker build arg. `.dockerignore` excludes `.env` and every variant so a stray local file cannot enter the context either.
- `MACHINA_API_URL`, `MACHINA_AGENT`, and either `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN` reach the process when the container starts: on AKS through `secretKeyRef` entries against the `machina-app-secrets` Secret (see `k8s/deployment.yaml`), on ECS through the task definition's `secrets` block backed by Secrets Manager or SSM Parameter Store.
- Only `NEXT_PUBLIC_*` values are build args, because Next.js inlines them into the client bundle. Never give a pod credential a `NEXT_PUBLIC_` prefix — that publishes it to every browser.
- Rotate the credential in the secret store and restart the workload; no rebuild is needed.

`npm run verify:pod-contract` fails the build if a tracked file writes a pod credential into a dotenv file or passes one as a build arg, or if `.dockerignore` stops excluding dotenv files.

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
