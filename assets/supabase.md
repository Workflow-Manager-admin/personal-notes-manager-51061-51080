# Supabase Integration for Notes App

## Environment Variables

Configure the Supabase client in React using:
- `REACT_APP_SUPABASE_URL` - Your Supabase project API URL
- `REACT_APP_SUPABASE_KEY` - Supabase anon/public API key

## Usage

The frontend expects a table called `notes` in Supabase with the following schema.
**IMPORTANT: Verified actual table schema differs slightly from the original doc.**

### Documented/Intended Schema
| Field      | Type             | Notes                                      |
|------------|------------------|--------------------------------------------|
| id         | bigint           | Primary Key, auto-incr                     |
| title      | text             | Title of note (**nullable** in doc)        |
| content    | text             | Body/content of note                       |
| created_at | timestamptz      | Defaults to now()                          |
| updated_at | timestamptz      | Defaults to now(), auto-updates on update  |

### ACTUAL Supabase Table Schema
| Field      | Type                      | Notes                                   |
|------------|---------------------------|-----------------------------------------|
| id         | bigint                    | Primary Key, NOT NULL                   |
| user_id    | bigint                    | NOT NULL                                |
| title      | text                      | NOT NULL (nullable=FALSE in DB)         |
| content    | text                      | NOT NULL                                |
| created_at | timestamp without tz      | Defaults to now(), nullable=TRUE        |
| updated_at | timestamp without tz      | Defaults to now(), nullable=TRUE        |
| tags       | ARRAY                     | nullable=TRUE                           |

**Current backend includes these extra/restricted fields:**
- `user_id` (bigint, **required**): Not present in the original doc.
- `title` is **NOT NULL** in Supabase, but doc described as nullable.
- `tags` (ARRAY): not mentioned in the original doc.

> If you must align schema precisely, coordinate with backend engineering.  
> The current frontend only uses fields: `id`, `title`, `content`, `created_at`, `updated_at`.

The app provides CRUD (create, read, update, delete) operations on the `notes` table.

**Schema checked and verified as of: _[LLM Automation]_**

## React Integration

The app uses `@supabase/supabase-js` and reads connection details from process.env:
```js
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;
```

## Notes

- Do not expose your Supabase `service_role` key to the frontend; use only anon/public keys.
- Set rules to allow CRUD access for authorized users.
- If authentication is later required, update the integration accordingly.

