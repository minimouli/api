Minimouli API
===

Environment Variables
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

| **Variable name**    | **Description**                           | **Type** | **Default value in dev env** | **Default value in all env** |
|----------------------|-------------------------------------------|----------|------------------------------|------------------------------|
| APP_PORT             | Port of the application                   | number   | ✅                            | ✅                            |
| POSTGRES_HOST        | Host of the Postgres service              | string   | ✅                            | ❌                            |
| POSTGRES_PORT        | Port of the Postgres service              | number   | ✅                            | ❌                            |
| POSTGRES_USERNAME    | Username of the Postgres database user    | string   | ✅                            | ❌                            |
| POSTGRES_PASSWORD    | Password of the Postgres database user    | string   | ✅                            | ❌                            |
| POSTGRES_DATABASE    | Database name of the Postgres database    | string   | ✅                            | ❌                            |
| POSTGRES_SYNCHRONIZE | Synchronize entities with database models | boolean  | ✅                            | ✅                            |
| ADMINER_PORT         | Port of the Adminer service               | number   | ✅                            | ❌                            |
| NODE_ENV             | Current environment                       | string   | ✅                            | ❌                            |
