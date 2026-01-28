
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Types
DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('video', 'image');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_subtype AS ENUM ('highlight', 'teaser', 'bts', 'breakdown', 'still');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- commercial, tv, digital, documentary
  description TEXT
);

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- producer, director, editor, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  year INTEGER,
  description TEXT,
  cover_url TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL, -- The name of the person in this role
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  subtype media_subtype NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Public READ
CREATE POLICY "Public read access for clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for project_roles" ON project_roles FOR SELECT USING (true);
CREATE POLICY "Public read access for media_items" ON media_items FOR SELECT USING (true);

-- Admin WRITE (Authenticated)
CREATE POLICY "Admin write access for clients" ON clients ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for categories" ON categories ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for roles" ON roles ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for projects" ON projects ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for project_roles" ON project_roles ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write access for media_items" ON media_items ALL USING (auth.role() = 'authenticated');

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_project_roles_project ON project_roles(project_id);
CREATE INDEX IF NOT EXISTS idx_media_project ON media_items(project_id);
CREATE INDEX IF NOT EXISTS idx_media_sort ON media_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_media_is_cover ON media_items(is_cover) WHERE is_cover = true;

-- 5. Seed Initial Categories
INSERT INTO categories (name) VALUES 
('commercial'), ('tv'), ('digital'), ('documentary')
ON CONFLICT (name) DO NOTHING;
