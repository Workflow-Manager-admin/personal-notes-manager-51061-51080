# Supabase Integration for Notes App

## Environment Variables

Configure the Supabase client in React using:
- `REACT_APP_SUPABASE_URL` - Your Supabase project API URL
- `REACT_APP_SUPABASE_KEY` - Supabase anon/public API key

## Usage

The frontend expects a table called `notes` in Supabase with the following schema:

| Field      | Type     | Notes                     |
|------------|----------|---------------------------|
| id         | bigint   | Primary Key, auto-incr    |
| title      | text     | Title of note (nullable)  |
| content    | text     | Body/content of note      |
| created_at | timestamptz | Defaults to now()      |
| updated_at | timestamptz | Defaults to now(), auto-updates on update |

The app provides CRUD (create, read, update, delete) operations on the `notes` table.

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

