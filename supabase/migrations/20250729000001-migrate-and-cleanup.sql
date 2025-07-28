-- Step 1: Migrate data from website_content to separate tables
-- This ensures no data is lost during the transition

-- Migrate hero content
INSERT INTO public.website_hero (section_name, title, subtitle, cta_primary, cta_secondary)
SELECT 
  'hero' as section_name,
  (content::json->>'title') as title,
  (content::json->>'subtitle') as subtitle,
  (content::json->>'cta_primary') as cta_primary,
  (content::json->>'cta_secondary') as cta_secondary
FROM public.website_content 
WHERE section_name = 'hero'
ON CONFLICT (section_name) DO NOTHING;

-- Migrate mission content
INSERT INTO public.website_mission (section_name, mission_text, vision, philosophy)
SELECT 
  'mission' as section_name,
  (content::json->>'mission') as mission_text,
  (content::json->>'vision') as vision,
  (content::json->>'philosophy') as philosophy
FROM public.website_content 
WHERE section_name = 'mission'
ON CONFLICT (section_name) DO NOTHING;

-- Migrate stats content
INSERT INTO public.website_stats (section_name, villages, women_skilled, temples_revived, programs_active)
SELECT 
  'stats' as section_name,
  (content::json->>'villages')::integer as villages,
  (content::json->>'women_skilled')::integer as women_skilled,
  (content::json->>'temples_revived')::integer as temples_revived,
  (content::json->>'programs_active')::integer as programs_active
FROM public.website_content 
WHERE section_name = 'stats'
ON CONFLICT (section_name) DO NOTHING;

-- Insert default contact data if not exists
INSERT INTO public.website_contact (section_name, email, phone, address, office_hours)
VALUES (
  'contact',
  'contact@garudadhruvam.org',
  '+91 98765 43210',
  'Garuda Dhruvam Foundation, Main Office, India',
  'Monday - Friday: 9:00 AM - 6:00 PM'
)
ON CONFLICT (section_name) DO NOTHING;

-- Step 2: Verify data migration was successful
-- Check if we have data in the new tables
DO $$
DECLARE
  hero_count INTEGER;
  stats_count INTEGER;
  mission_count INTEGER;
  contact_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO hero_count FROM public.website_hero;
  SELECT COUNT(*) INTO stats_count FROM public.website_stats;
  SELECT COUNT(*) INTO mission_count FROM public.website_mission;
  SELECT COUNT(*) INTO contact_count FROM public.website_contact;
  
  -- Only drop the old table if migration was successful
  IF hero_count > 0 AND stats_count > 0 AND mission_count > 0 AND contact_count > 0 THEN
    -- Step 3: Drop the old website_content table
    DROP TABLE IF EXISTS public.website_content CASCADE;
    
    -- Also drop any related policies
    DROP POLICY IF EXISTS "Authenticated users have full access" ON public.website_content;
    DROP POLICY IF EXISTS "Public can read website content" ON public.website_content;
    DROP POLICY IF EXISTS "Admin can update website content" ON public.website_content;
    DROP POLICY IF EXISTS "Admin can insert website content" ON public.website_content;
    DROP POLICY IF EXISTS "Only admins can update website content" ON public.website_content;
    DROP POLICY IF EXISTS "Admins can update content" ON public.website_content;
    
    RAISE NOTICE 'Data migration successful. Old website_content table dropped.';
  ELSE
    RAISE EXCEPTION 'Data migration failed. Not all tables have data.';
  END IF;
END $$; 