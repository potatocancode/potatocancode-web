-- Add project detail columns for the portfolio detail page feature
-- Run this in your Supabase SQL editor or via supabase db push

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS detailed_description text,
  ADD COLUMN IF NOT EXISTS media_gallery jsonb DEFAULT '[]'::jsonb;

-- Ensure slug is unique (allows NULL for projects without a slug)
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key ON projects (slug) WHERE slug IS NOT NULL;
