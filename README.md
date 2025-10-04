# MemoWord

MemoWord is a vocabulary learning application that helps users master new words through scientifically-backed techniques.

## Features

- Vocabulary building with curated words
- Daily challenges to reinforce learning
- Progress tracking and statistics
- Spaced repetition for long-term retention

## Supabase Integration

This project uses Supabase for authentication and storage. To set up Supabase:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Create the required database tables in your Supabase project by running these SQL commands in the SQL editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  email text
);

-- Create user_data table
create table user_data (
  user_id uuid references auth.users on delete cascade not null,
  data_key text not null,
  data_value text,
  updated_at timestamp with time zone default now(),
  primary key (user_id, data_key)
);

-- Enable Row Level Security (RLS) for both tables
alter table profiles enable row level security;
alter table user_data enable row level security;

-- Create policies
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can view their own data" on user_data
  for select using (auth.uid() = user_id);

create policy "Users can update their own data" on user_data
  for update using (auth.uid() = user_id);

create policy "Users can insert their own data" on user_data
  for insert with check (auth.uid() = user_id);
```

6. Enable email authentication in your Supabase project:
   - Go to "Authentication" → "Providers"
   - Enable "Email" as an authentication provider

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Preview the production build locally.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).