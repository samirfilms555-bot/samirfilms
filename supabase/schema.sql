-- ============================================================
-- SAMIR EL-HOSARY — Director & Filmmaker
-- Supabase PostgreSQL Schema & Security Policies (RLS)
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name_ar TEXT NOT NULL DEFAULT 'سمير الحصري',
    full_name_en TEXT NOT NULL DEFAULT 'Samir El-Hosary',
    title_ar TEXT NOT NULL DEFAULT 'مخرج وصانع أفلام',
    title_en TEXT NOT NULL DEFAULT 'Director & Filmmaker',
    secondary_title_ar TEXT DEFAULT 'مخرج إعلانات وفيديوجرافي',
    secondary_title_en TEXT DEFAULT 'Commercial Director / Videographer',
    bio_ar TEXT,
    bio_en TEXT,
    image_url TEXT,
    email TEXT DEFAULT 'contact@samirelhosary.com',
    phone TEXT DEFAULT '+20 100 000 0000',
    instagram TEXT DEFAULT 'https://instagram.com/samirelhosary',
    behance TEXT DEFAULT 'https://behance.net/samirelhosary',
    linkedin TEXT DEFAULT 'https://linkedin.com/in/samirelhosary',
    youtube TEXT DEFAULT 'https://youtube.com/@samirelhosary',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    client_name TEXT NOT NULL,
    year TEXT NOT NULL DEFAULT '2026',
    category TEXT NOT NULL DEFAULT 'commercial', -- 'commercial', 'branded', 'reels', 'social', 'other'
    role_ar TEXT NOT NULL DEFAULT 'مخرج',
    role_en TEXT NOT NULL DEFAULT 'Director',
    description_ar TEXT,
    description_en TEXT,
    concept_ar TEXT,
    concept_en TEXT,
    challenge_ar TEXT,
    challenge_en TEXT,
    approach_ar TEXT,
    approach_en TEXT,
    execution_ar TEXT,
    execution_en TEXT,
    production_notes_ar TEXT,
    production_notes_en TEXT,
    cover_image TEXT NOT NULL,
    hero_media TEXT,
    hero_media_type TEXT DEFAULT 'image', -- 'image' or 'video'
    final_film_url TEXT,
    final_film_poster TEXT,
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    sort_order INTEGER DEFAULT 0,
    credits JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster listing & filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON public.projects(sort_order ASC, created_at DESC);

-- ------------------------------------------------------------
-- 3. PROJECT MEDIA TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'image', -- 'image', 'video'
    category TEXT NOT NULL DEFAULT 'stills', -- 'cover', 'hero', 'final', 'stills', 'bts', 'raw', 'before', 'after', 'gallery'
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    title_ar TEXT,
    title_en TEXT,
    caption_ar TEXT,
    caption_en TEXT,
    metadata_json JSONB DEFAULT '{}'::jsonb, -- camera, lens, notes, format, etc.
    sort_order INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_project ON public.project_media(project_id, category);

-- ------------------------------------------------------------
-- 4. PROJECT FEEDBACK TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    quote_ar TEXT NOT NULL,
    quote_en TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_role_ar TEXT,
    client_role_en TEXT,
    company TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------
-- 5. SITE SETTINGS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Admins can update profiles" 
ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Projects Policies
CREATE POLICY "Published projects are viewable by everyone" 
ON public.projects FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins have full access to projects" 
ON public.projects FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- 3. Project Media Policies
CREATE POLICY "Public media is viewable by everyone" 
ON public.project_media FOR SELECT 
USING (
    is_public = true AND EXISTS (
        SELECT 1 FROM public.projects 
        WHERE public.projects.id = public.project_media.project_id 
        AND public.projects.status = 'published'
    )
);

CREATE POLICY "Admins have full access to media" 
ON public.project_media FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- 4. Feedback Policies
CREATE POLICY "Visible feedback is viewable by everyone" 
ON public.project_feedback FOR SELECT 
USING (
    is_visible = true AND EXISTS (
        SELECT 1 FROM public.projects 
        WHERE public.projects.id = public.project_feedback.project_id 
        AND public.projects.status = 'published'
    )
);

CREATE POLICY "Admins have full access to feedback" 
ON public.project_feedback FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- 5. Site Settings Policies
CREATE POLICY "Settings are viewable by everyone" 
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update settings" 
ON public.site_settings FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE SETUP (Run in Supabase SQL editor)
-- ============================================================
-- Create bucket 'portfolio-media'
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view files in portfolio-media
CREATE POLICY "Public Media Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

-- Authenticated admins can upload files
CREATE POLICY "Admin Media Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

-- Authenticated admins can update files
CREATE POLICY "Admin Media Update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-media');

-- Authenticated admins can delete files
CREATE POLICY "Admin Media Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media');

-- ============================================================
-- SEED DATA: SAMIR EL-HOSARY DEMO CONTENT
-- ============================================================

-- Profile Seed
INSERT INTO public.profiles (
    full_name_ar, full_name_en, title_ar, title_en,
    secondary_title_ar, secondary_title_en,
    bio_ar, bio_en, image_url, email, phone
) VALUES (
    'سمير الحصري',
    'Samir El-Hosary',
    'مخرج وصانع أفلام',
    'Director & Filmmaker',
    'مخرج إعلانات وفيديوجرافي',
    'Commercial Director / Videographer',
    'أنا سمير الحصري، مخرج وصانع أفلام، أركز على الإعلانات والمحتوى المرئي والسرد البصري. أجمع بين الإخراج والتصوير والمونتاج والتطوير البصري لصناعة أفلام توصل الفكرة بوضوح وتكون لها هوية بصرية مقصودة.',
    'I’m Samir El-Hosary, a director and filmmaker focused on commercials, branded content and visual storytelling. My work combines directing, cinematography, editing and visual development to build films that communicate clearly and feel visually intentional.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    'contact@samirelhosary.com',
    '+20 100 000 0000'
) ON CONFLICT DO NOTHING;

-- Site Settings Seed
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('hero_settings', '{
    "hero_title_ar": "سمير الحصري",
    "hero_title_en": "SAMIR EL-HOSARY",
    "hero_desc_ar": "أصنع قصصًا بصرية وإعلانات وأفلامًا للعلامات التجارية، أحوّل فيها الأفكار إلى صور تُرى وتُتذكر.",
    "hero_desc_en": "I create visual stories, commercials and branded films that turn ideas into images people remember.",
    "showreel_enabled": true,
    "showreel_video": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "showreel_poster": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80"
}'::jsonb),
('statistics', '{
    "years": 8,
    "projects": 65,
    "clients": 40,
    "campaigns": 90
}'::jsonb)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Demo Project 1: Urban Architecture Campaign
INSERT INTO public.projects (
    id, slug, title_ar, title_en, client_name, year, category, role_ar, role_en,
    description_ar, description_en, concept_ar, concept_en, challenge_ar, challenge_en,
    approach_ar, approach_en, execution_ar, execution_en, production_notes_ar, production_notes_en,
    cover_image, hero_media, hero_media_type, final_film_url, final_film_poster,
    featured, status, sort_order, credits
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'urban-architecture-campaign',
    'نبض العمارة والمدينة',
    'Urban Architecture Campaign',
    'Metropolis Development (Demo)',
    '2026',
    'commercial',
    'المخرج ومدير التصوير',
    'Director / Cinematographer',
    'حملة إعلانية سينمائية تبرز جماليات الهندسة المعمارية الحديثة وعلاقة الإنسان بالمكان، من خلال إيقاع بصري متصاعد وتناغم بين الضوء الطبيعي والهياكل الخرسانية.',
    'A cinematic commercial highlighting contemporary architectural forms and human resonance with urban spaces, told through escalating rhythmic pacing and sculptural natural light.',
    'تحويل المساحات المعمارية الصامتة إلى كائنات حية تتنفس وتتفاعل مع حركة الساكنين، باستخدام عدسات عريضة وحركات كاميرا انسيابية.',
    'Transforming static geometric structures into breathing living spaces interacting with residents, driven by disciplined wide anamorphic framing and continuous motion.',
    'إبراز ضخامة المشروع المعماري دون أن يفقد الدفء الإنساني، مع التعامل مع التباين العالي لأشعة شمس الظهيرة وانعكاسات الزجاج الواسع.',
    'Conveying monumental scale without sacrificing human intimacy, while managing extreme contrast in harsh midday sunlight and expansive glass facades.',
    'استخدام درجات إضاءة الساعة الذهبية والزرقاء، وتصميم لقطات تتنقل بين الهندسة الجريئة والتفاصيل الحميمية للمواد والخامات.',
    'Anchoring the visual palette in golden-hour and twilight transitions, contrasting bold architectural geometry with tactile macro textures.',
    'تم التصوير على مدار 4 أيام في مواقع متعددة باستخدام كاميرات سينمائية متطورة مع نظام مثبت للحركة، متبوعًا بعمليات مونتاج إيقاعي وتلوين دقيق.',
    'Filmed over 4 production days using RED V-Raptor and stabilized cinema rigs, followed by rhythm-driven pacing and fine-tuned ACES color grading.',
    'كاميرا RED V-Raptor 8K VV مع عدسات Atlas Orion Anamorphic ونظام Steadicam.',
    'Shot on RED V-Raptor 8K VV with Atlas Orion Anamorphic lenses and Steadicam.',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    'image',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    true, 'published', 1,
    '{"director": "Samir El-Hosary", "cinematographer": "Samir El-Hosary & Crew", "editor": "Samir El-Hosary", "colorist": "Ahmed Zaki", "producer": "Kareem Tarek", "agency": "Apex Creative"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Demo Project 2: Motion / Lifestyle Commercial
INSERT INTO public.projects (
    id, slug, title_ar, title_en, client_name, year, category, role_ar, role_en,
    description_ar, description_en, concept_ar, concept_en, challenge_ar, challenge_en,
    approach_ar, approach_en, execution_ar, execution_en, production_notes_ar, production_notes_en,
    cover_image, hero_media, hero_media_type, final_film_url, final_film_poster,
    featured, status, sort_order, credits
) VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'legacy-of-speed-commercial',
    'إرث السرعة والروح الرياضية',
    'Legacy of Speed Commercial',
    'Veloce Performance (Demo)',
    '2026',
    'commercial',
    'المخرج الإبداعي ومخرج الفيلم',
    'Creative Director & Filmmaker',
    'فيلم إعلاني ديناميكي لسيارات الأداء العالي يستعرض الإثارة والتحكم الدقيق، حيث تلتقي السرعة الخام بالجماليات البصرية السينمائية.',
    'A high-octane automotive performance film celebrating precision and adrenaline, marrying raw mechanical speed with stylized cinematic aesthetics.',
    'التعبير عن السرعة ليس فقط بعداد السرعة بل بنبض السائق وتوتر العضلات وصوت الاحتكاك مع الأسفلت.',
    'Expressing velocity through visceral sensory metaphors: the driver’s heartbeat, muscle tension, and tactile tire friction against asphalt.',
    'التصوير بسرعات تفوق 140 كم/ساعة في مسارات جبلية مغلقة مع الحفاظ على سلامة الطاقم واستقرار الإطار البصري.',
    'Tracking action at 140+ km/h on narrow mountain hairpin curves while ensuring absolute crew safety and flawless camera stability.',
    'اعتماد نظام كاميرا متحرك (Russian Arm) وزوايا منخفضة جدًا قريبة من الأرض مع استخدام شاتر أنجل ضيق لتجسيد الحدة والحركة.',
    'Deploying high-speed chase vehicles with gyro-stabilized tracking cranes, low-to-ground pursuit angles, and tight shutter angles for razor sharpness.',
    'يومان تصوير متواصلان في مسار حلبة صحراوية مغلقة، واستخدام مؤثرات صوتية مسجلة مباشرة من محركات التوربو.',
    'Two continuous production days at a desert circuit with multi-mic onboard engine telemetry recordings for bespoke foley and sound design.',
    'كاميرا ARRI Alexa Mini LF مع عدسات Cooke S7/i Full Frame Plus.',
    'ARRI Alexa Mini LF with Cooke S7/i Full Frame Plus Cine Primes.',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80',
    'image',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80',
    true, 'published', 2,
    '{"director": "Samir El-Hosary", "cinematographer": "Tamer Mostafa", "editor": "Samir El-Hosary", "colorist": "Leo Dupont", "producer": "Sherif Fawzy", "agency": "Speed & Vision"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Demo Project 3: Medical Brand Campaign
INSERT INTO public.projects (
    id, slug, title_ar, title_en, client_name, year, category, role_ar, role_en,
    description_ar, description_en, concept_ar, concept_en, challenge_ar, challenge_en,
    approach_ar, approach_en, execution_ar, execution_en, production_notes_ar, production_notes_en,
    cover_image, hero_media, hero_media_type, final_film_url, final_film_poster,
    featured, status, sort_order, credits
) VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'medical-humanity-campaign',
    'صدى الأمل والرعاية الإنسانية',
    'Echoes of Hope — Medical Campaign',
    'Cura Health Systems (Demo)',
    '2025',
    'branded',
    'المخرج',
    'Director',
    'حملة محتوى وثائقي ذو طابع إنساني عميق يسلط الضوء على تفاني الأطباء وأثر الرعاية الطبية الحقيقية على حياة الأسر والمرضى.',
    'A deeply poignant humanized documentary campaign reflecting physician dedication and the quiet emotional impact of healthcare on families.',
    'الابتعاد عن الشكل الدعائي النمطي للمستشفيات، والتركيز على العيون، ولمسات الأيدي، واللحظات الصامتة المليئة بالأمل.',
    'Shunning cold institutional aesthetics to focus on authentic eye contact, reassuring touch, and powerful quiet pauses of empathy.',
    'التصوير داخل بيئات طبية حقيقية تتطلب الهدوء التام وعدم إرباك الطاقم الطبي أو المرضى الحقيقيين.',
    'Operating within active clinical wards requiring minimal equipment footprint, complete silence, and high ethical sensitivity.',
    'استخدام الإضاءة الطبيعية الناعمة وعدسات سينمائية تعزل الخلفية بنعومة، مع توجيه حواري غير متكلف يتيح للأشخاص التعبير بعفوية.',
    'Relying on soft available lighting and large-format shallow depth of field, paired with organic conversational direction rather than rigid scripting.',
    'تصوير على مدار 3 أيام في عدة أقسام جراحية واستشفائية، واختيار موسيقى تصويرية وترية خاصة.',
    'Filmed across 3 days in neonatal, cardio, and rehab wings, scored with an original acoustic cello and piano composition.',
    'Sony FX9 و Sony FX6 مع عدسات Sony G-Master Cine Primes.',
    'Sony FX9 & FX6 rigs with Sony G-Master Cine Primes and Tilta Nucleus-M focus.',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    'image',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    false, 'published', 3,
    '{"director": "Samir El-Hosary", "cinematographer": "Samir El-Hosary", "editor": "Nader Adel", "colorist": "Ahmed Zaki", "producer": "Mona Salem", "agency": "Heartbeat Brand Group"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Demo Project 4: Social Reels Campaign
INSERT INTO public.projects (
    id, slug, title_ar, title_en, client_name, year, category, role_ar, role_en,
    description_ar, description_en, concept_ar, concept_en, challenge_ar, challenge_en,
    approach_ar, approach_en, execution_ar, execution_en, production_notes_ar, production_notes_en,
    cover_image, hero_media, hero_media_type, final_film_url, final_film_poster,
    featured, status, sort_order, credits
) VALUES (
    'd4444444-4444-4444-4444-444444444444',
    'kinetic-fashion-reels',
    'إيقاع وإطار — سلسلة أزياء حركية',
    'Rhythm & Frame — Kinetic Fashion Reels',
    'AURA Contemporary (Demo)',
    '2026',
    'reels',
    'المخرج والمشرف الإبداعي',
    'Director & Creative Supervisor',
    'سلسلة مقاطع ريلز عمودية فائقة الحركية تم تصميمها خصيصًا لتلفت الأنظار في أول 1.5 ثانية، تجمع بين الأزياء الحديثة والرقص المعاصر والمؤثرات البصرية المتقنة.',
    'A high-velocity vertical reels campaign engineered to hook viewers within 1.5 seconds, fusing avant-garde fashion with kinetic movement and match cuts.',
    'تقديم الأزياء كحركة مستمرة لا تنقطع، باستخدام تقنيات Match Cuts وتعديل السرعة (Speed Ramping) المتناغمة مع الإيقاع الموسيقي.',
    'Treating apparel as fluid kinetic sculptures through seamless in-camera match cuts, dynamic whip pans, and precision tempo-locked speed ramping.',
    'إنتاج محتوى عمودي بنسبة 9:16 بجودة سينمائية فائقة تضاهي الأفلام الروائية بدلاً من تصوير الهاتف المحمول المعتاد.',
    'Achieving true anamorphic cine-grade fidelity natively formatted in 9:16 vertical ratio without standard handheld mobile artifacts.',
    'تثبيت كاميرا سينمائية بزاوية 90 درجة على رأس ثلاثي، وتنسيق إضاءة RGB متحركة متزامنة مع نبضات الموسيقى.',
    'Rigging the cinema camera vertically at 90 degrees with motorized DMX-controlled RGB light tubes synchronized to the audio waveform.',
    'تصوير استوديو خلال 12 ساعة متواصلة مع 6 عارضين وعارضة، ومونتاج سريع واختبار عدة خيارات للمؤثرات البصرية.',
    'Studio shoot over a single 12-hour session with 6 performers, followed by frame-accurate beat editing and sound design.',
    'Blackmagic URSA Mini Pro 12K مسجلة بوضع عمودي مع عدسات DZOFilm Vespid Primes.',
    'Blackmagic URSA Mini Pro 12K mounted vertically with DZOFilm Vespid Primes.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
    'image',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
    false, 'published', 4,
    '{"director": "Samir El-Hosary", "cinematographer": "Fady Morris", "editor": "Samir El-Hosary", "colorist": "Ahmed Zaki", "producer": "Nouran Ezzat", "agency": "Neon Pulse Studios"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Demo Media Seed for Project 1
INSERT INTO public.project_media (project_id, type, category, file_url, title_ar, title_en, caption_ar, caption_en, metadata_json, sort_order) VALUES
('a1111111-1111-1111-1111-111111111111', 'image', 'stills', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80', 'تكوين الزوايا الهندسية', 'Geometric Lines Framing', 'لقطة عريضة تركز على انعكاس الضوء عند الشروق', 'Wide composition capturing dawn light reflection', '{"camera": "RED V-Raptor 8K", "lens": "Atlas Orion 40mm", "notes": "Golden Hour"}', 1),
('a1111111-1111-1111-1111-111111111111', 'image', 'stills', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80', 'ارتفاع الأبراج الزجاجية', 'Skyward Reflection', 'زاوية سفلية تعكس الفخامة والقوة المعمارية', 'Low-angle perspective accentuating glass monumentality', '{"camera": "RED V-Raptor 8K", "lens": "Atlas Orion 65mm"}', 2),
('a1111111-1111-1111-1111-111111111111', 'image', 'stills', 'https://images.unsplash.com/photo-1470723710355-95304d8aece4?auto=format&fit=crop&w=1600&q=80', 'التناغم بين الضوء والظلال', 'Chiaroscuro & Geometry', 'تدرجات الظل فوق الخرسانة المصقولة', 'Shadow interplay over textured architectural concrete', '{"camera": "RED V-Raptor 8K", "lens": "Atlas Orion 80mm"}', 3),
('a1111111-1111-1111-1111-111111111111', 'image', 'bts', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80', 'المخرج على موقع التصوير', 'Director on Set', 'سمير الحصري أثناء توجيه حركة الكاميرا والستيديكام', 'Samir directing Steadicam movement on location', '{"notes": "BTS Rig Setup"}', 1),
('a1111111-1111-1111-1111-111111111111', 'image', 'bts', 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80', 'إعداد الإضاءة والمشتتات الكبرى', 'Lighting Setup', 'توزيع إضاءة HMI لمحاكاة ضوء الشمس الطبيعي', 'Large HMI diffusion balancing architectural ambient light', '{"notes": "Lighting Tech"}', 2),
('a1111111-1111-1111-1111-111111111111', 'image', 'before', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=60&sat=-100', 'اللقطة الخام (Log)', 'Raw Sensor Log Feed', 'تسجيل RED IPP2 Log بدون معالجة لونية', 'Unprocessed flat RED Log RAW sensor profile', '{"camera": "RED V-Raptor", "format": "REDCODE RAW 8K"}', 1),
('a1111111-1111-1111-1111-111111111111', 'image', 'after', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80', 'النتيجة الملونة النهائية', 'Final Color Grade', 'التلوين السينمائي بتدرجات الدفء والتباين الذهبي', 'ACES Color Graded with rich warm shadow separation', '{"grading": "DaVinci Resolve Studio", "colorist": "Ahmed Zaki"}', 2);

-- Demo Feedback Seed
INSERT INTO public.project_feedback (project_id, quote_ar, quote_en, client_name, client_role_ar, client_role_en, company, is_visible) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'العمل مع سمير الحصري كان تجربة استثنائية من الفكرة الأولى وحتى التسليم النهائي. فهم رؤيتنا بدقة ونقلها إلى قطعة سينمائية رفيعة المستوى لاقت صدى هائلاً في السوق.',
    'Working with Samir was seamless from the first concept to the final delivery. He understood our vision intuitively and translated it into a commanding cinematic piece that made a massive market impression.',
    'طارق المنشاوي',
    'الرئيس التنفيذي للتسويق',
    'Chief Marketing Officer',
    'Metropolis Development',
    true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'سمير يمتلك حسًا إيقاعيًا لا يُضاهى في أفلام الحركة والسيارات. النتيجة فاقت توقعاتنا وحققت أعلى نسب مشاهدة وتفاعل في تاريخ حملاتنا.',
    'Samir possesses an unmatched rhythmic sensibility for automotive and high-velocity storytelling. The result surpassed our highest benchmarks and became our top-performing film.',
    'كارلوس مينديز',
    'مدير العلامة التجارية العالمية',
    'Global Brand Director',
    'Veloce Performance',
    true
) ON CONFLICT DO NOTHING;
