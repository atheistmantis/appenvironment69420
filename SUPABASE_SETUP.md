# Supabase Setup Guide

This app uses [Supabase](https://supabase.com) as its backend – for recipe storage and admin authentication.  
The app works **without** Supabase (falling back to localStorage), but authentication and persistent storage require a Supabase project.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up / log in.
2. Click **New project**, give it a name, and wait for it to provision.

---

## 2. Create the `recipes` table

In your Supabase project, open **SQL Editor** and run:

```sql
-- Recipes table
CREATE TABLE recipes (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  image       TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Anyone can read recipes (public visitors)
CREATE POLICY "Public read access"
  ON recipes FOR SELECT USING (true);

-- Only authenticated users (admins) can insert, update, or delete
CREATE POLICY "Admin insert"
  ON recipes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update"
  ON recipes FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete"
  ON recipes FOR DELETE USING (auth.role() = 'authenticated');
```

### (Optional) seed default recipes

```sql
INSERT INTO recipes (id, name, image, description) VALUES
  ('tpl-1', 'Spaghetti Bolognese', 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&q=80', 'Classic Italian pasta with rich meat sauce.'),
  ('tpl-2', 'Chicken Curry',       'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80', 'Aromatic chicken curry with creamy sauce.'),
  ('tpl-3', 'Caesar Salad',        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', 'Crisp romaine lettuce with Caesar dressing.'),
  ('tpl-4', 'Pancakes',            'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', 'Fluffy American pancakes with maple syrup.'),
  ('tpl-5', 'Grilled Salmon',      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', 'Perfectly grilled salmon fillet with herbs.'),
  ('tpl-6', 'Vegetable Stir Fry',  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', 'Colourful vegetables tossed in savoury sauce.');
```

---

## 3. Add admin users

All Supabase **Auth users** are treated as admins – only give accounts to people you trust.

1. In your Supabase project, go to **Authentication → Users**.
2. Click **Invite user** (or **Add user**) and enter their email address.
3. They will receive an invite email with a link to set their password.

You can also enable **magic links** or **OAuth providers** (Google, GitHub, etc.) in  
**Authentication → Providers** – no code changes are required.

---

## 4. Configure environment variables

### Local development

Copy `.env.example` to `.env.local` (already gitignored):

```bash
cp .env.example .env.local
```

Fill in your values from **Project Settings → API** in Supabase:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then run:

```bash
npm run dev
```

### GitHub Pages deployment (GitHub Actions)

1. In your GitHub repository, go to **Settings → Secrets and variables → Actions**.
2. Add two **Repository secrets**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Push to `main` – the deploy workflow will pick them up automatically.

---

## 5. (Optional) Configure allowed redirect URLs

If you enable magic links or OAuth:

1. Go to **Authentication → URL Configuration** in Supabase.
2. Add your GitHub Pages URL to **Site URL**, e.g. `https://your-username.github.io/appenvironment69420/`.
3. Add the same URL to **Redirect URLs**.

---

## How it works

| State | Behaviour |
|---|---|
| Supabase **not configured** | App uses localStorage (existing behaviour, no login required) |
| Supabase configured, **not logged in** | Public visitors see recipes; ⚙ opens the login modal |
| Supabase configured, **logged in** | Full admin UI: add, edit, delete recipes; "Log Out" button in panel |
