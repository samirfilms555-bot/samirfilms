/**
 * SAMIR EL-HOSARY — Data Access Layer (api.js)
 * Pure Vanilla JavaScript ES Module using Fetch API for:
 * 1. Supabase PostgREST endpoints (/rest/v1/...)
 * 2. Supabase Auth REST endpoints (/auth/v1/...)
 * 3. Supabase Storage REST endpoints (/storage/v1/...)
 * 
 * Includes high-fidelity local fallback so the portfolio and CMS are 100% functional
 * both before and after live Supabase credentials are configured.
 */

import { CONFIG } from "./config.js";
import { Storage } from "./storage.js";

// Check if runtime override exists from browser settings
function getActiveConfig() {
  const override = Storage.getConfigOverride();
  if (override && override.SUPABASE_URL && override.SUPABASE_ANON_KEY) {
    return {
      ...CONFIG,
      SUPABASE_URL: override.SUPABASE_URL,
      SUPABASE_ANON_KEY: override.SUPABASE_ANON_KEY
    };
  }
  return CONFIG;
}

/**
 * Standard fetch wrapper for Supabase PostgREST and Auth APIs
 */
async function supabaseFetch(endpoint, options = {}) {
  const cfg = getActiveConfig();
  if (!cfg.IS_CONFIGURED()) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const url = `${cfg.SUPABASE_URL.replace(/\/$/, "")}${endpoint}`;
  const session = Storage.getSession();
  const token = session?.access_token || cfg.SUPABASE_ANON_KEY;

  const headers = {
    "apikey": cfg.SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorText);
    } catch (e) {
      errorJson = { message: errorText };
    }
    const err = new Error(errorJson.message || errorJson.error_description || `HTTP ${response.status}`);
    err.status = response.status;
    err.data = errorJson;
    throw err;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/* ============================================================
 * INITIAL DEMO DATA (Pre-populates local DB if offline / demo)
 * ============================================================ */
const DEMO_PROJECTS = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    slug: "urban-architecture-campaign",
    title_ar: "نبض العمارة والمدينة",
    title_en: "Urban Architecture Campaign",
    client_name: "Metropolis Development (Demo)",
    year: "2026",
    category: "commercial",
    role_ar: "المخرج ومدير التصوير",
    role_en: "Director / Cinematographer",
    description_ar: "حملة إعلانية سينمائية تبرز جماليات الهندسة المعمارية الحديثة وعلاقة الإنسان بالمكان، من خلال إيقاع بصري متصاعد وتناغم بين الضوء الطبيعي والهياكل الخرسانية.",
    description_en: "A cinematic commercial highlighting contemporary architectural forms and human resonance with urban spaces, told through escalating rhythmic pacing and sculptural natural light.",
    concept_ar: "تحويل المساحات المعمارية الصامتة إلى كائنات حية تتنفس وتتفاعل مع حركة الساكنين، باستخدام عدسات عريضة وحركات كاميرا انسيابية.",
    concept_en: "Transforming static geometric structures into breathing living spaces interacting with residents, driven by disciplined wide anamorphic framing and continuous motion.",
    challenge_ar: "إبراز ضخامة المشروع المعماري دون أن يفقد الدفء الإنساني، مع التعامل مع التباين العالي لأشعة شمس الظهيرة وانعكاسات الزجاج الواسع.",
    challenge_en: "Conveying monumental scale without sacrificing human intimacy, while managing extreme contrast in harsh midday sunlight and expansive glass facades.",
    approach_ar: "استخدام درجات إضاءة الساعة الذهبية والزرقاء، وتصميم لقطات تتنقل بين الهندسة الجريئة والتفاصيل الحميمية للمواد والخامات.",
    approach_en: "Anchoring the visual palette in golden-hour and twilight transitions, contrasting bold architectural geometry with tactile macro textures.",
    execution_ar: "تم التصوير على مدار 4 أيام في مواقع متعددة باستخدام كاميرات سينمائية متطورة مع نظام مثبت للحركة، متبوعًا بعمليات مونتاج إيقاعي وتلوين دقيق.",
    execution_en: "Filmed over 4 production days using RED V-Raptor and stabilized cinema rigs, followed by rhythm-driven pacing and fine-tuned ACES color grading.",
    production_notes_ar: "كاميرا RED V-Raptor 8K VV مع عدسات Atlas Orion Anamorphic ونظام Steadicam.",
    production_notes_en: "Shot on RED V-Raptor 8K VV with Atlas Orion Anamorphic lenses and Steadicam.",
    cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    hero_media: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    hero_media_type: "image",
    final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    final_film_poster: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    featured: true,
    status: "published",
    sort_order: 1,
    credits: {
      director: "Samir El-Hosary",
      cinematographer: "Samir El-Hosary & Crew",
      editor: "Samir El-Hosary",
      colorist: "Ahmed Zaki",
      producer: "Kareem Tarek",
      agency: "Apex Creative"
    },
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-03-05T12:00:00Z"
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    slug: "legacy-of-speed-commercial",
    title_ar: "إرث السرعة والروح الرياضية",
    title_en: "Legacy of Speed Commercial",
    client_name: "Veloce Performance (Demo)",
    year: "2026",
    category: "commercial",
    role_ar: "المخرج الإبداعي ومخرج الفيلم",
    role_en: "Creative Director & Filmmaker",
    description_ar: "فيلم إعلاني ديناميكي لسيارات الأداء العالي يستعرض الإثارة والتحكم الدقيق، حيث تلتقي السرعة الخام بالجماليات البصرية السينمائية.",
    description_en: "A high-octane automotive performance film celebrating precision and adrenaline, marrying raw mechanical speed with stylized cinematic aesthetics.",
    concept_ar: "التعبير عن السرعة ليس فقط بعداد السرعة بل بنبض السائق وتوتر العضلات وصوت الاحتكاك مع الأسفلت.",
    concept_en: "Expressing velocity through visceral sensory metaphors: the driver’s heartbeat, muscle tension, and tactile tire friction against asphalt.",
    challenge_ar: "التصوير بسرعات تفوق 140 كم/ساعة في مسارات جبلية مغلقة مع الحفاظ على سلامة الطاقم واستقرار الإطار البصري.",
    challenge_en: "Tracking action at 140+ km/h on narrow mountain hairpin curves while ensuring absolute crew safety and flawless camera stability.",
    approach_ar: "اعتماد نظام كاميرا متحرك (Russian Arm) وزوايا منخفضة جدًا قريبة من الأرض مع استخدام شاتر أنجل ضيق لتجسيد الحدة والحركة.",
    approach_en: "Deploying high-speed chase vehicles with gyro-stabilized tracking cranes, low-to-ground pursuit angles, and tight shutter angles for razor sharpness.",
    execution_ar: "يومان تصوير متواصلان في مسار حلبة صحراوية مغلقة، واستخدام مؤثرات صوتية مسجلة مباشرة من محركات التوربو.",
    execution_en: "Two continuous production days at a desert circuit with multi-mic onboard engine telemetry recordings for bespoke foley and sound design.",
    production_notes_ar: "كاميرا ARRI Alexa Mini LF مع عدسات Cooke S7/i Full Frame Plus.",
    production_notes_en: "ARRI Alexa Mini LF with Cooke S7/i Full Frame Plus Cine Primes.",
    cover_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    hero_media: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80",
    hero_media_type: "image",
    final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    final_film_poster: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80",
    featured: true,
    status: "published",
    sort_order: 2,
    credits: {
      director: "Samir El-Hosary",
      cinematographer: "Tamer Mostafa",
      editor: "Samir El-Hosary",
      colorist: "Leo Dupont",
      producer: "Sherif Fawzy",
      agency: "Speed & Vision"
    },
    created_at: "2026-02-15T09:00:00Z",
    updated_at: "2026-02-20T16:00:00Z"
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    slug: "medical-humanity-campaign",
    title_ar: "صدى الأمل والرعاية الإنسانية",
    title_en: "Echoes of Hope — Medical Campaign",
    client_name: "Cura Health Systems (Demo)",
    year: "2025",
    category: "branded",
    role_ar: "المخرج",
    role_en: "Director",
    description_ar: "حملة محتوى وثائقي ذو طابع إنساني عميق يسلط الضوء على تفاني الأطباء وأثر الرعاية الطبية الحقيقية على حياة الأسر والمرضى.",
    description_en: "A deeply poignant humanized documentary campaign reflecting physician dedication and the quiet emotional impact of healthcare on families.",
    concept_ar: "الابتعاد عن الشكل الدعائي النمطي للمستشفيات، والتركيز على العيون، ولمسات الأيدي، واللحظات الصامتة المليئة بالأمل.",
    concept_en: "Shunning cold institutional aesthetics to focus on authentic eye contact, reassuring touch, and powerful quiet pauses of empathy.",
    challenge_ar: "التصوير داخل بيئات طبية حقيقية تتطلب الهدوء التام وعدم إرباك الطاقم الطبي أو المرضى الحقيقيين.",
    challenge_en: "Operating within active clinical wards requiring minimal equipment footprint, complete silence, and high ethical sensitivity.",
    approach_ar: "استخدام الإضاءة الطبيعية الناعمة وعدسات سينمائية تعزل الخلفية بنعومة، مع توجيه حواري غير متكلف يتيح للأشخاص التعبير بعفوية.",
    approach_en: "Relying on soft available lighting and large-format shallow depth of field, paired with organic conversational direction rather than rigid scripting.",
    execution_ar: "تصوير على مدار 3 أيام في عدة أقسام جراحية واستشفائية، واختيار موسيقى تصويرية وترية خاصة.",
    execution_en: "Filmed across 3 days in neonatal, cardio, and rehab wings, scored with an original acoustic cello and piano composition.",
    production_notes_ar: "Sony FX9 و Sony FX6 مع عدسات Sony G-Master Cine Primes.",
    production_notes_en: "Sony FX9 & FX6 rigs with Sony G-Master Cine Primes and Tilta Nucleus-M focus.",
    cover_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
    hero_media: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
    hero_media_type: "image",
    final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    final_film_poster: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
    featured: false,
    status: "published",
    sort_order: 3,
    credits: {
      director: "Samir El-Hosary",
      cinematographer: "Samir El-Hosary",
      editor: "Nader Adel",
      colorist: "Ahmed Zaki",
      producer: "Mona Salem",
      agency: "Heartbeat Brand Group"
    },
    created_at: "2025-11-10T11:00:00Z",
    updated_at: "2025-11-15T14:00:00Z"
  },
  {
    id: "d4444444-4444-4444-4444-444444444444",
    slug: "kinetic-fashion-reels",
    title_ar: "إيقاع وإطار — سلسلة أزياء حركية",
    title_en: "Rhythm & Frame — Kinetic Fashion Reels",
    client_name: "AURA Contemporary (Demo)",
    year: "2026",
    category: "reels",
    role_ar: "المخرج والمشرف الإبداعي",
    role_en: "Director & Creative Supervisor",
    description_ar: "سلسلة مقاطع ريلز عمودية فائقة الحركية تم تصميمها خصيصًا لتلفت الأنظار في أول 1.5 ثانية، تجمع بين الأزياء الحديثة والرقص المعاصر والمؤثرات البصرية المتقنة.",
    description_en: "A high-velocity vertical reels campaign engineered to hook viewers within 1.5 seconds, fusing avant-garde fashion with kinetic movement and match cuts.",
    concept_ar: "تقديم الأزياء كحركة مستمرة لا تنقطع، باستخدام تقنيات Match Cuts وتعديل السرعة (Speed Ramping) المتناغمة مع الإيقاع الموسيقي.",
    concept_en: "Treating apparel as fluid kinetic sculptures through seamless in-camera match cuts, dynamic whip pans, and precision tempo-locked speed ramping.",
    challenge_ar: "إنتاج محتوى عمودي بنسبة 9:16 بجودة سينمائية فائقة تضاهي الأفلام الروائية بدلاً من تصوير الهاتف المحمول المعتاد.",
    challenge_en: "Achieving true anamorphic cine-grade fidelity natively formatted in 9:16 vertical ratio without standard handheld mobile artifacts.",
    approach_ar: "تثبيت كاميرا سينمائية بزاوية 90 درجة على رأس ثلاثي، وتنسيق إضاءة RGB متحركة متزامنة مع نبضات الموسيقى.",
    approach_en: "Rigging the cinema camera vertically at 90 degrees with motorized DMX-controlled RGB light tubes synchronized to the audio waveform.",
    execution_ar: "تصوير استوديو خلال 12 ساعة متواصلة مع 6 عارضين وعارضة، ومونتاج سريع واختبار عدة خيارات للمؤثرات البصرية.",
    execution_en: "Studio shoot over a single 12-hour session with 6 performers, followed by frame-accurate beat editing and sound design.",
    production_notes_ar: "Blackmagic URSA Mini Pro 12K مسجلة بوضع عمودي مع عدسات DZOFilm Vespid Primes.",
    production_notes_en: "Blackmagic URSA Mini Pro 12K mounted vertically with DZOFilm Vespid Primes.",
    cover_image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    hero_media: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80",
    hero_media_type: "image",
    final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    final_film_poster: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80",
    featured: false,
    status: "published",
    sort_order: 4,
    credits: {
      director: "Samir El-Hosary",
      cinematographer: "Fady Morris",
      editor: "Samir El-Hosary",
      colorist: "Ahmed Zaki",
      producer: "Nouran Ezzat",
      agency: "Neon Pulse Studios"
    },
    created_at: "2026-01-20T14:00:00Z",
    updated_at: "2026-01-25T18:00:00Z"
  }
];

const DEMO_MEDIA = [
  {
    id: "m1",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "stills",
    file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    title_ar: "تكوين الزوايا الهندسية",
    title_en: "Geometric Lines Framing",
    caption_ar: "لقطة عريضة تركز على انعكاس الضوء عند الشروق",
    caption_en: "Wide composition capturing dawn light reflection",
    metadata_json: { camera: "RED V-Raptor 8K", lens: "Atlas Orion 40mm", notes: "Golden Hour" },
    sort_order: 1,
    is_public: true
  },
  {
    id: "m2",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "stills",
    file_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    title_ar: "ارتفاع الأبراج الزجاجية",
    title_en: "Skyward Reflection",
    caption_ar: "زاوية سفلية تعكس الفخامة والقوة المعمارية",
    caption_en: "Low-angle perspective accentuating glass monumentality",
    metadata_json: { camera: "RED V-Raptor 8K", lens: "Atlas Orion 65mm" },
    sort_order: 2,
    is_public: true
  },
  {
    id: "m3",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "stills",
    file_url: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?auto=format&fit=crop&w=1600&q=80",
    title_ar: "التناغم بين الضوء والظلال",
    title_en: "Chiaroscuro & Geometry",
    caption_ar: "تدرجات الظل فوق الخرسانة المصقولة",
    caption_en: "Shadow interplay over textured architectural concrete",
    metadata_json: { camera: "RED V-Raptor 8K", lens: "Atlas Orion 80mm" },
    sort_order: 3,
    is_public: true
  },
  {
    id: "m4",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "bts",
    file_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
    title_ar: "المخرج على موقع التصوير",
    title_en: "Director on Set",
    caption_ar: "سمير الحصري أثناء توجيه حركة الكاميرا والستيديكام",
    caption_en: "Samir directing Steadicam movement on location",
    metadata_json: { notes: "BTS Rig Setup" },
    sort_order: 1,
    is_public: true
  },
  {
    id: "m5",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "bts",
    file_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
    title_ar: "إعداد الإضاءة والمشتتات الكبرى",
    title_en: "Lighting Setup",
    caption_ar: "توزيع إضاءة HMI لمحاكاة ضوء الشمس الطبيعي",
    caption_en: "Large HMI diffusion balancing architectural ambient light",
    metadata_json: { notes: "Lighting Tech" },
    sort_order: 2,
    is_public: true
  },
  {
    id: "m6",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "before",
    file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=60&sat=-100",
    title_ar: "اللقطة الخام (Log)",
    title_en: "Raw Sensor Log Feed",
    caption_ar: "تسجيل RED IPP2 Log بدون معالجة لونية",
    caption_en: "Unprocessed flat RED Log RAW sensor profile",
    metadata_json: { camera: "RED V-Raptor", format: "REDCODE RAW 8K" },
    sort_order: 1,
    is_public: true
  },
  {
    id: "m7",
    project_id: "a1111111-1111-1111-1111-111111111111",
    type: "image",
    category: "after",
    file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    title_ar: "النتيجة الملونة النهائية",
    title_en: "Final Color Grade",
    caption_ar: "التلوين السينمائي بتدرجات الدفء والتباين الذهبي",
    caption_en: "ACES Color Graded with rich warm shadow separation",
    metadata_json: { grading: "DaVinci Resolve Studio", colorist: "Ahmed Zaki" },
    sort_order: 2,
    is_public: true
  },
  // Stills for Project 2
  {
    id: "m8",
    project_id: "b2222222-2222-2222-2222-222222222222",
    type: "image",
    category: "stills",
    file_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    title_ar: "انعكاسات السرعة على الهيكل الخارجي",
    title_en: "High-Speed Silhouette",
    caption_ar: "زاوية ملاحقة ديناميكية في المنعطفات الحادة",
    caption_en: "Tracking angle through sweeping high-speed corners",
    metadata_json: { camera: "ARRI Alexa Mini LF", lens: "Cooke S7/i 50mm" },
    sort_order: 1,
    is_public: true
  },
  {
    id: "m9",
    project_id: "b2222222-2222-2222-2222-222222222222",
    type: "image",
    category: "stills",
    file_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
    title_ar: "قوة الأداء والتصميم",
    title_en: "Aerodynamic Power",
    caption_ar: "لقطة تفصيلية لأضواء القيادة الليلية",
    caption_en: "Macro framing of aerodynamic carbon fiber body lines",
    metadata_json: { camera: "ARRI Alexa Mini LF", lens: "Cooke S7/i 75mm" },
    sort_order: 2,
    is_public: true
  }
];

const DEMO_FEEDBACK = [
  {
    id: "f1",
    project_id: "a1111111-1111-1111-1111-111111111111",
    quote_ar: "العمل مع سمير الحصري كان تجربة استثنائية من الفكرة الأولى وحتى التسليم النهائي. فهم رؤيتنا بدقة ونقلها إلى قطعة سينمائية رفيعة المستوى لاقت صدى هائلاً في السوق.",
    quote_en: "Working with Samir was seamless from the first concept to the final delivery. He understood our vision intuitively and translated it into a commanding cinematic piece that made a massive market impression.",
    client_name: "طارق المنشاوي",
    client_role_ar: "الرئيس التنفيذي للتسويق",
    client_role_en: "Chief Marketing Officer",
    company: "Metropolis Development",
    is_visible: true,
    created_at: "2026-03-06T10:00:00Z"
  },
  {
    id: "f2",
    project_id: "b2222222-2222-2222-2222-222222222222",
    quote_ar: "سمير يمتلك حسًا إيقاعيًا لا يُضاهى في أفلام الحركة والسيارات. النتيجة فاقت توقعاتنا وحققت أعلى نسب مشاهدة وتفاعل في تاريخ حملاتنا.",
    quote_en: "Samir possesses an unmatched rhythmic sensibility for automotive and high-velocity storytelling. The result surpassed our highest benchmarks and became our top-performing film.",
    client_name: "كارلوس مينديز",
    client_role_ar: "مدير العلامة التجارية العالمية",
    client_role_en: "Global Brand Director",
    company: "Veloce Performance",
    is_visible: true,
    created_at: "2026-02-22T14:00:00Z"
  }
];

const DEMO_PROFILE = {
  id: "p1",
  full_name_ar: "سمير الحصري",
  full_name_en: "Samir El-Hosary",
  title_ar: "مخرج وصانع أفلام",
  title_en: "Director & Filmmaker",
  secondary_title_ar: "مخرج إعلانات وفيديوجرافي",
  secondary_title_en: "Commercial Director / Videographer",
  bio_ar: "أنا سمير الحصري، مخرج وصانع أفلام، أركز على الإعلانات والمحتوى المرئي والسرد البصري. أجمع بين الإخراج والتصوير والمونتاج والتطوير البصري لصناعة أفلام توصل الفكرة بوضوح وتكون لها هوية بصرية مقصودة.",
  bio_en: "I’m Samir El-Hosary, a director and filmmaker focused on commercials, branded content and visual storytelling. My work combines directing, cinematography, editing and visual development to build films that communicate clearly and feel visually intentional.",
  image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  email: "contact@samirelhosary.com",
  phone: "+20 100 000 0000",
  instagram: "https://instagram.com/samirelhosary",
  behance: "https://behance.net/samirelhosary",
  linkedin: "https://linkedin.com/in/samirelhosary",
  youtube: "https://youtube.com/@samirelhosary"
};

const DEMO_SETTINGS = {
  hero_title_ar: "سمير الحصري",
  hero_title_en: "SAMIR EL-HOSARY",
  hero_desc_ar: "أصنع قصصًا بصرية وإعلانات وأفلامًا للعلامات التجارية، أحوّل فيها الأفكار إلى صور تُرى وتُتذكر.",
  hero_desc_en: "I create visual stories, commercials and branded films that turn ideas into images people remember.",
  showreel_enabled: true,
  showreel_video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  showreel_poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80",
  stat_years: "8+",
  stat_projects: "65+",
  stat_clients: "40+",
  stat_campaigns: "90+"
};

/* ============================================================
 * 1. AUTHENTICATION (Supabase Auth REST API)
 * ============================================================ */

export async function login(email, password) {
  const cfg = getActiveConfig();

  // If live Supabase is configured, authenticate through Supabase Auth REST
  if (cfg.IS_CONFIGURED()) {
    const url = `${cfg.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token?grant_type=password`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": cfg.SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error_description || errData.message || "Login failed");
    }

    const session = await response.json();
    Storage.setSession(session);
    return session;
  }

  // Fallback demo authentication for offline / initial preview
  if (email && password) {
    const mockSession = {
      access_token: "demo_admin_token_" + Date.now(),
      token_type: "bearer",
      expires_in: 86400,
      refresh_token: "demo_refresh_token",
      user: {
        id: "demo-admin-id",
        email: email,
        user_metadata: { name: "Samir El-Hosary" }
      },
      is_demo_mode: true
    };
    Storage.setSession(mockSession);
    return mockSession;
  }

  throw new Error("Invalid credentials");
}

export async function logout() {
  const cfg = getActiveConfig();
  const session = Storage.getSession();

  if (cfg.IS_CONFIGURED() && session?.access_token && !session.is_demo_mode) {
    try {
      await fetch(`${cfg.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/logout`, {
        method: "POST",
        headers: {
          "apikey": cfg.SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${session.access_token}`
        }
      });
    } catch (e) {
      console.warn("Remote logout warning", e);
    }
  }

  Storage.removeSession();
  return true;
}

export async function getCurrentSession() {
  const session = Storage.getSession();
  if (!session) return null;

  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED() && !session.is_demo_mode) {
    try {
      const user = await supabaseFetch("/auth/v1/user");
      return { ...session, user };
    } catch (e) {
      Storage.removeSession();
      return null;
    }
  }

  return session;
}

/* ============================================================
 * 2. PROJECTS (Supabase PostgREST API)
 * ============================================================ */

export async function getProjects() {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      return await supabaseFetch("/rest/v1/projects?select=*&order=sort_order.asc,created_at.desc");
    } catch (e) {
      console.warn("Falling back to local projects", e);
    }
  }
  return Storage.getLocalCollection("projects", DEMO_PROJECTS);
}

export async function getPublishedProjects() {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      return await supabaseFetch("/rest/v1/projects?status=eq.published&select=*&order=sort_order.asc,created_at.desc");
    } catch (e) {
      console.warn("Falling back to local published projects", e);
    }
  }
  const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
  return all.filter((p) => p.status === "published");
}

export async function getProjectById(idOrSlug) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      // Allow finding by ID or Slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const query = isUUID ? `id=eq.${idOrSlug}` : `slug=eq.${encodeURIComponent(idOrSlug)}`;
      const result = await supabaseFetch(`/rest/v1/projects?${query}&select=*&limit=1`);
      return result[0] || null;
    } catch (e) {
      console.warn("Falling back to local project query", e);
    }
  }
  const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
  return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

export async function createProject(projectData) {
  const cfg = getActiveConfig();
  const slug = projectData.slug || generateSlug(projectData.title_en || projectData.title_ar || "project");
  const payload = {
    ...projectData,
    slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (cfg.IS_CONFIGURED()) {
    const res = await supabaseFetch("/rest/v1/projects", {
      method: "POST",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) ? res[0] : res;
  }

  // Local fallback
  const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
  const newProject = {
    ...payload,
    id: "proj_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  };
  all.unshift(newProject);
  Storage.setLocalCollection("projects", all);
  return newProject;
}

export async function updateProject(id, updates) {
  const cfg = getActiveConfig();
  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (cfg.IS_CONFIGURED()) {
    const res = await supabaseFetch(`/rest/v1/projects?id=eq.${id}`, {
      method: "PATCH",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) ? res[0] : res;
  }

  const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...payload };
    Storage.setLocalCollection("projects", all);
    return all[idx];
  }
  throw new Error("Project not found");
}

export async function deleteProject(id) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    await supabaseFetch(`/rest/v1/projects?id=eq.${id}`, { method: "DELETE" });
    return true;
  }

  let all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
  all = all.filter((p) => p.id !== id);
  Storage.setLocalCollection("projects", all);
  return true;
}

export async function duplicateProject(id) {
  const original = await getProjectById(id);
  if (!original) throw new Error("Original project not found");

  const copy = {
    ...original,
    title_ar: `${original.title_ar} (نسخة)`,
    title_en: `${original.title_en} (Copy)`,
    slug: `${original.slug}-copy-${Date.now().toString(36)}`,
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  delete copy.id;

  const duplicated = await createProject(copy);

  // Reference existing media for the duplicated project
  const mediaList = await getProjectMedia(id);
  for (const m of mediaList) {
    const mediaCopy = { ...m, project_id: duplicated.id };
    delete mediaCopy.id;
    await addProjectMedia(mediaCopy);
  }

  return duplicated;
}

/* ============================================================
 * 3. PROJECT MEDIA (Supabase PostgREST & Storage)
 * ============================================================ */

export async function getProjectMedia(projectId) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      return await supabaseFetch(`/rest/v1/project_media?project_id=eq.${projectId}&select=*&order=sort_order.asc,created_at.asc`);
    } catch (e) {
      console.warn("Falling back to local media", e);
    }
  }
  const all = Storage.getLocalCollection("project_media", DEMO_MEDIA);
  return all.filter((m) => m.project_id === projectId);
}

export async function getAllMedia() {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      return await supabaseFetch(`/rest/v1/project_media?select=*&order=created_at.desc`);
    } catch (e) {
      console.warn("Falling back to all local media", e);
    }
  }
  return Storage.getLocalCollection("project_media", DEMO_MEDIA);
}

export async function addProjectMedia(mediaData) {
  const cfg = getActiveConfig();
  const payload = {
    ...mediaData,
    created_at: new Date().toISOString()
  };

  if (cfg.IS_CONFIGURED()) {
    const res = await supabaseFetch("/rest/v1/project_media", {
      method: "POST",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) ? res[0] : res;
  }

  const all = Storage.getLocalCollection("project_media", DEMO_MEDIA);
  const newMedia = {
    ...payload,
    id: "media_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 4)
  };
  all.push(newMedia);
  Storage.setLocalCollection("project_media", all);
  return newMedia;
}

export async function deleteProjectMedia(mediaId) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    await supabaseFetch(`/rest/v1/project_media?id=eq.${mediaId}`, { method: "DELETE" });
    return true;
  }

  let all = Storage.getLocalCollection("project_media", DEMO_MEDIA);
  all = all.filter((m) => m.id !== mediaId);
  Storage.setLocalCollection("project_media", all);
  return true;
}

export async function updateMediaOrder(mediaOrderList) {
  // mediaOrderList: Array of { id, sort_order }
  for (const item of mediaOrderList) {
    const cfg = getActiveConfig();
    if (cfg.IS_CONFIGURED()) {
      await supabaseFetch(`/rest/v1/project_media?id=eq.${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ sort_order: item.sort_order })
      });
    } else {
      const all = Storage.getLocalCollection("project_media", DEMO_MEDIA);
      const m = all.find((x) => x.id === item.id);
      if (m) m.sort_order = item.sort_order;
      Storage.setLocalCollection("project_media", all);
    }
  }
  return true;
}

/**
 * Upload a binary file to Supabase Storage Bucket via REST API
 * @param {File} file 
 * @param {string} category 
 * @param {function} onProgress (optional callback for progress state)
 */
export async function uploadMediaFile(file, category = "portfolio", onProgress = null) {
  const cfg = getActiveConfig();
  const fileExt = file.name.split(".").pop();
  const cleanName = file.name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 30);
  const path = `${category}/${Date.now()}_${cleanName}.${fileExt}`;

  if (cfg.IS_CONFIGURED()) {
    const session = Storage.getSession();
    const token = session?.access_token || cfg.SUPABASE_ANON_KEY;
    const url = `${cfg.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/${cfg.STORAGE_BUCKET}/${path}`;

    if (onProgress) onProgress({ status: "uploading", progress: 20 });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": cfg.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": file.type || "application/octet-stream"
      },
      body: file
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Upload failed: ${err}`);
    }

    if (onProgress) onProgress({ status: "complete", progress: 100 });

    const publicUrl = `${cfg.SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/${cfg.STORAGE_BUCKET}/${path}`;
    return {
      file_url: publicUrl,
      path,
      filename: file.name,
      size: file.size,
      type: file.type.startsWith("video") ? "video" : "image"
    };
  }

  // Local fallback: Read as Data URL or Object URL for instant demo preview
  if (onProgress) onProgress({ status: "uploading", progress: 50 });
  const objectUrl = URL.createObjectURL(file);
  if (onProgress) onProgress({ status: "complete", progress: 100 });

  return {
    file_url: objectUrl,
    path,
    filename: file.name,
    size: file.size,
    type: file.type.startsWith("video") ? "video" : "image"
  };
}

/* ============================================================
 * 4. CLIENT FEEDBACK (Supabase PostgREST API)
 * ============================================================ */

export async function getFeedback(projectId = null) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      const query = projectId ? `?project_id=eq.${projectId}&order=created_at.desc` : "?order=created_at.desc";
      return await supabaseFetch(`/rest/v1/project_feedback${query}`);
    } catch (e) {
      console.warn("Falling back to local feedback", e);
    }
  }
  const all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
  return projectId ? all.filter((f) => f.project_id === projectId) : all;
}

export async function createFeedback(feedbackData) {
  const cfg = getActiveConfig();
  const payload = {
    ...feedbackData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (cfg.IS_CONFIGURED()) {
    const res = await supabaseFetch("/rest/v1/project_feedback", {
      method: "POST",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) ? res[0] : res;
  }

  const all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
  const newFb = {
    ...payload,
    id: "fb_" + Date.now().toString(36)
  };
  all.unshift(newFb);
  Storage.setLocalCollection("project_feedback", all);
  return newFb;
}

export async function updateFeedback(id, updates) {
  const cfg = getActiveConfig();
  const payload = { ...updates, updated_at: new Date().toISOString() };

  if (cfg.IS_CONFIGURED()) {
    const res = await supabaseFetch(`/rest/v1/project_feedback?id=eq.${id}`, {
      method: "PATCH",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify(payload)
    });
    return Array.isArray(res) ? res[0] : res;
  }

  const all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
  const idx = all.findIndex((f) => f.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...payload };
    Storage.setLocalCollection("project_feedback", all);
    return all[idx];
  }
  throw new Error("Feedback record not found");
}

export async function deleteFeedback(id) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    await supabaseFetch(`/rest/v1/project_feedback?id=eq.${id}`, { method: "DELETE" });
    return true;
  }

  let all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
  all = all.filter((f) => f.id !== id);
  Storage.setLocalCollection("project_feedback", all);
  return true;
}

/* ============================================================
 * 5. PROFILE & SETTINGS
 * ============================================================ */

export async function getProfile() {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      const res = await supabaseFetch("/rest/v1/profiles?select=*&limit=1");
      if (res && res.length > 0) return res[0];
    } catch (e) {
      console.warn("Falling back to local profile", e);
    }
  }
  return Storage.getLocalCollection("profile", DEMO_PROFILE);
}

export async function updateProfile(updates) {
  const cfg = getActiveConfig();
  const payload = { ...updates, updated_at: new Date().toISOString() };

  if (cfg.IS_CONFIGURED()) {
    const current = await getProfile();
    if (current && current.id) {
      const res = await supabaseFetch(`/rest/v1/profiles?id=eq.${current.id}`, {
        method: "PATCH",
        headers: { "Prefer": "return=representation" },
        body: JSON.stringify(payload)
      });
      return Array.isArray(res) ? res[0] : res;
    }
  }

  const current = Storage.getLocalCollection("profile", DEMO_PROFILE);
  const updated = { ...current, ...payload };
  Storage.setLocalCollection("profile", updated);
  return updated;
}

export async function getSiteSettings() {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    try {
      const res = await supabaseFetch("/rest/v1/site_settings?select=*");
      if (res && res.length > 0) {
        const settingsMap = {};
        res.forEach((item) => {
          settingsMap[item.setting_key] = item.setting_value;
        });
        return settingsMap;
      }
    } catch (e) {
      console.warn("Falling back to local site settings", e);
    }
  }
  return Storage.getLocalCollection("site_settings", DEMO_SETTINGS);
}

export async function updateSiteSetting(key, value) {
  const cfg = getActiveConfig();
  if (cfg.IS_CONFIGURED()) {
    const res = await supabaseFetch(`/rest/v1/site_settings?setting_key=eq.${key}`, {
      method: "PATCH",
      headers: { "Prefer": "return=representation" },
      body: JSON.stringify({
        setting_value: value,
        updated_at: new Date().toISOString()
      })
    });
    return Array.isArray(res) ? res[0] : res;
  }

  const current = Storage.getLocalCollection("site_settings", DEMO_SETTINGS);
  current[key] = value;
  Storage.setLocalCollection("site_settings", current);
  return current;
}

/* Helper functions */
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
