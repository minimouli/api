<p align="center" >
    <img width="128" src="https://github.com/minimouli/api/blob/main/assets/icon.svg?raw=true" alt="Minimouli logo" />
    <h1 align="center" >Minimouli API</h1>
    <h3 align="center" >
        Get feedback on your projects without waiting for nao
    </h3>
</p>

Tables of Contents
---

- [Getting Started](#getting-started)
- [Testing and Linting](#testing-and-linting)
- [Migrations and Seeders](#migrations-and-seeders)
- [Environment variables](#environment-variables)
- [License](#license)

<span id="getting-started" >Getting Started</span>
---

You'll need the following dependencies to build:
- Node.js
- Yarn
- Docker

Run the following commands:
```shell
# Install dependencies
yarn

# Set up hooks
yarn run prepare

# Run the migrations
yarn run typeorm:migration:run

# Run the seeders
yarn run typeorm:seeder:up
```

Before start the server, set up the environment variables. Take a look at `.env.dev.local.example` to see what environment variables you'll need to add.

```shell
# Start the server in development mode
yarn run start:dev
```

<span id="testing-and-linting" >Testing and Linting</span>
---

```shell
# Run all unit tests
yarn run test

# Run all unit tests in watching mode
yarn run test:watch

# Run all unit tests with coverage
yarn run test:cov

# Run all end-to-end tests
yarn run test:e2e
```

```shell
# Run the linter
yarn run lint

# Run the linter and apply the possible fixes
yarn run lint:fix
```

<span id="migrations-and-seeders" >Migrations and Seeders</span>
---

```shell
# Create a new migration file
yarn run typeorm:migration:generate ./database/migrations/new-migration-file

# Run the migrations
yarn run typeorm:migration:run

# Revert the migrations
yarn run typeorm:migration:revert
```

```shell
# Run the seeders
yarn run typeorm:seeder:up

# Revert the seeders
yarn run typeorm:seeder:down
```

<span id="environment-variables" >Environment Variables</span>
---

### Config variables sources precedence

1. Environment variable (like `export APP=VALUE`)
2. `.env.{NODE_ENV}.local`
3. `.env.local`
4. `.env.{NODE_ENV}`
5. `.env`

### Env files explanation

#### `.env.{NODE_ENV}.local`
- Used in the {NODE_ENV} environment only
- Used only in the local machine
- Must contain sensitive data related to the {NODE_ENV} environment

#### `.env.{NODE_ENV}`
- Used in the {NODE_ENV} environment only
- Must not contain sensitive data

#### `.env.local`
- Used in all environment
- Used only in the local machine
- Must contain sensitive data not specific to any environments

#### `.env`
- Used in all environment
- Must not contain sensitive data

### Variables table

| **Variable name**                   | **Description**                           | **Type** | **Default value in dev env** | **Default value in all env** |
|-------------------------------------|-------------------------------------------|----------|------------------------------|------------------------------|
| APP_PORT                            | Port of the application                   | number   | ✅                            | ✅                            |
| POSTGRES_HOST                       | Host of the Postgres service              | string   | ✅                            | ❌                            |
| POSTGRES_PORT                       | Port of the Postgres service              | number   | ✅                            | ❌                            |
| POSTGRES_USERNAME                   | Username of the Postgres database user    | string   | ✅                            | ❌                            |
| POSTGRES_PASSWORD                   | Password of the Postgres database user    | string   | ✅                            | ❌                            |
| POSTGRES_DATABASE                   | Database name of the Postgres database    | string   | ✅                            | ❌                            |
| POSTGRES_SYNCHRONIZE                | Synchronize entities with database models | boolean  | ✅                            | ✅                            |
| ADMINER_PORT                        | Port of the Adminer service               | number   | ✅                            | ❌                            |
| JWT_SECRET                          | Secret of JWT                             | string   | ✅                            | ❌                            |
| JWT_OPTION_EXPIRES_IN               | JWT expiration date                       | string   | ✅                            | ❌                            |
| GITHUB_OAUTH2_CLIENT_ID             | Client ID of the GitHub app               | string   | ❌                            | ❌                            |
| GITHUB_OAUTH2_CLIENT_SECRET         | Client secret of the GitHub app           | string   | ❌                            | ❌                            |
| GITHUB_OAUTH2_ACCESS_TOKEN_ENDPOINT | GitHub endpoint for access token          | string   | ✅                            | ✅                            |
| GITHUB_OAUTH2_REQUIRED_SCOPES       | GitHub required scopes for oauth2         | string   | ✅                            | ✅                            |
| GITHUB_API_USER_PROFILE_ENDPOINT    | GitHub endpoint for user profile          | string   | ✅                            | ✅                            |
| GITHUB_API_USER_EMAILS_ENDPOINT     | GitHub endpoint for user emails           | string   | ✅                            | ✅                            |
| IS_SWAGGER_DOC_VISIBLE              | Visibility of the Swagger document        | boolean  | ✅                            | ✅                            |
| NODE_ENV                            | Current environment                       | string   | ✅                            | ❌                            |

<span id="license" >License</span>
---

The project is released under the MIT License.
