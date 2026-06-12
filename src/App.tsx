import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Heart, 
  MessageSquare, 
  Laptop, 
  Users, 
  TrendingUp, 
  Settings, 
  Star, 
  X, 
  Check, 
  Trash2, 
  Edit3, 
  Smile, 
  Clock, 
  Share2, 
  Plus, 
  RotateCcw,
  BookOpen,
  Filter,
  Flame,
  User,
  ExternalLink,
  Info,
  LogOut,
  Lock
} from 'lucide-react';

// Interfaces
interface Game {
  id: string;
  title: string;
  developer: string;
  genre: string;
  playtimeValue: string;
  vibe: string;
  whyThisFits: string;
  imageUrl: string;
  vibeColor: string; // Tailwind gradient class
  platforms: string[];
  multiplayer: boolean;
  storyDriven: boolean;
}

interface LikedGame {
  id: string;
  likedAt: string;
  rating: number; // 0 to 5 stars
  reviewText: string;
  noteSaved?: boolean;
}

interface Profile {
  username: string;
  genres: string;
  playtime: string;
  mood: string;
}

interface MatchFilters {
  pcOnly: boolean;
  multiplayer: boolean;
  storyDriven: boolean;
}

// Default High-Quality Games Dataset
const DEFAULT_GAMES: Game[] = [
  {
    id: "elden-ring",
    title: "ELDEN RING",
    developer: "FromSoftware",
    genre: "Action RPG",
    playtimeValue: "60-120 hrs",
    vibe: "Dark Fantasy",
    whyThisFits: "You enjoy challenging games, rich dark fantasy worlds, and highly engaging lore-rich narrative arcs.",
    imageUrl: "https://images.unsplash.com/photo-1651079856893-619f1cb257c2?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-amber-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: true,
    storyDriven: true,
  },
  {
    id: "hades-2",
    title: "HADES II",
    developer: "Supergiant Games",
    genre: "Action Roguelike",
    playtimeValue: "40-80 hrs",
    vibe: "Mythic Retro",
    whyThisFits: "You rated roguelikes highly and love fast-paced combat paired with stellar Greek mythological narrative hooks.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-emerald-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "cyberpunk-2077",
    title: "CYBERPUNK 2077",
    developer: "CD Projekt Red",
    genre: "Sci-Fi RPG",
    playtimeValue: "50-100 hrs",
    vibe: "Neon Cyberpunk",
    whyThisFits: "Matches your search for immersive first-person stories, heavy synth scores, and dystopian corporate rebellions.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-orange-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "tunic",
    title: "TUNIC",
    developer: "Andrew Shouldice",
    genre: "Action Adventure",
    playtimeValue: "15-25 hrs",
    vibe: "Cryptic & Isometric",
    whyThisFits: "Fulfills your sense of pure discovery with an in-game manual to decode, cozy visual aesthetics, and precise combat.",
    imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699952e?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-blue-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "baldurs-gate-3",
    title: "BALDUR'S GATE 3",
    developer: "Larian Studios",
    genre: "Tactical RPG",
    playtimeValue: "80-150 hrs",
    vibe: "High Fantasy Choice",
    whyThisFits: "Unmatched depth in turn-based strategy, companion storytelling, and incredible agency that reacts to your whims.",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-fuchsia-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: true,
    storyDriven: true,
  },
  {
    id: "hollow-knight",
    title: "HOLLOW KNIGHT",
    developer: "Team Cherry",
    genre: "Metroidvania",
    playtimeValue: "30-50 hrs",
    vibe: "Melancholic Insect",
    whyThisFits: "Appeals directly to fans of atmospheric mastery, strict responsive combat challenge, and deep optional lore exploration.",
    imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-sky-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "outer-wilds",
    title: "OUTER WILDS",
    developer: "Mobius Digital",
    genre: "Mystery Adventure",
    playtimeValue: "15-25 hrs",
    vibe: "Cosmic Melancholy",
    whyThisFits: "Perfect for seekers of pure organic learning. You gain no stat upgrades, only knowledge to decode a solar loop mystery.",
    imageUrl: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-rose-950 to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "disco-elysium",
    title: "DISCO ELYSIUM",
    developer: "ZA/UM Studios",
    genre: "Psychological RPG",
    playtimeValue: "30-50 hrs",
    vibe: "Gritty Literary",
    whyThisFits: "If you prioritize storytelling, character choice depth, and psychological inner dialogues above repetitive active combat.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-teal-950 to-slate-900",
    platforms: ["PC", "Mac"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "minecraft",
    title: "MINECRAFT",
    developer: "Mojang Studios",
    genre: "Sandbox Survival",
    playtimeValue: "100+ hrs",
    vibe: "Endless Creative",
    whyThisFits: "Offers supreme creative freedom. Best suited for building intricate architectural plans or hosting chill group multiplayer realms.",
    imageUrl: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-lime-950 to-emerald-950",
    platforms: ["PC", "Console", "Mobile"],
    multiplayer: true,
    storyDriven: false,
  },
  {
    id: "celeste",
    title: "CELESTE",
    developer: "Extremely OK Games",
    genre: "Precision Platformer",
    playtimeValue: "10-20 hrs",
    vibe: "Heartfelt Challenging",
    whyThisFits: "Saves high priority for platforming muscle memory, combined with an incredibly touching story about self-acceptance.",
    imageUrl: "https://images.unsplash.com/photo-1548685913-fe6574340a49?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-[#1b3d4f] to-slate-900",
    platforms: ["PC", "Console"],
    multiplayer: false,
    storyDriven: true,
  },
  {
    id: "slay-the-spire",
    title: "SLAY THE SPIRE",
    developer: "Mega Crit Games",
    genre: "Deckbuilder Roguelike",
    playtimeValue: "40-150 hrs",
    vibe: "Pure Strategy Loop",
    whyThisFits: "Combines strict card synergy calculations with excellent replay value. Ideal for testing mental builds in quick runs.",
    imageUrl: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-indigo-950 to-cyan-950",
    platforms: ["PC", "Console", "Mobile"],
    multiplayer: false,
    storyDriven: false,
  },
  {
    id: "stardew-valley",
    title: "STARDEW VALLEY",
    developer: "ConcernedApe",
    genre: "Life Sim RPG",
    playtimeValue: "50-120 hrs",
    vibe: "Warm Cozy Community",
    whyThisFits: "Allows you to build an organic homestead, make connections with quirky villagers, and unwind after demanding real-world shifts.",
    imageUrl: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=800&q=80",
    vibeColor: "from-yellow-950 to-neutral-900",
    platforms: ["PC", "Console", "Mobile"],
    multiplayer: true,
    storyDriven: false,
  }
];

const GAME_TRANSLATIONS: Record<string, Record<'AZ' | 'RU', {
  title?: string;
  genre?: string;
  vibe?: string;
  whyThisFits?: string;
  playtimeValue?: string;
}>> = {
  "elden-ring": {
    AZ: {
      title: "ELDEN RING",
      genre: "Ekşn RPG",
      vibe: "Qaranlıq Fantaziya",
      whyThisFits: "Çətin oyunları, zəngin qaranlıq fantaziya dünyalarını və dərin süjet xəttini xoşlayırsınız.",
      playtimeValue: "60-120 saat"
    },
    RU: {
      title: "ELDEN RING",
      genre: "Экшен-RPG",
      vibe: "Мрачное Фэнтези",
      whyThisFits: "Вам нравятся сложные испытания, проработанные миры темного фэнтези и глубокие повествовательные линии.",
      playtimeValue: "60-120 ч."
    }
  },
  "hades-2": {
    AZ: {
      title: "HADES II",
      genre: "Ekşn Roqlayk",
      vibe: "Mifik Retro",
      whyThisFits: "Roqlayk janrına yüksək qiymət vermisiniz və mifik Yunan ssenarisini çox sevirsiniz.",
      playtimeValue: "40-80 saat"
    },
    RU: {
      title: "HADES II",
      genre: "Экшен-роглайк",
      vibe: "Мифическое Ретро",
      whyThisFits: "Вы высоко оценили рогатки и обожаете динамичные бои в сеттинге греческой мифологии.",
      playtimeValue: "40-80 ч."
    }
  },
  "cyberpunk-2077": {
    AZ: {
      title: "CYBERPUNK 2077",
      genre: "Elmi-Fantastik RPG",
      vibe: "Neon Kiberpank",
      whyThisFits: "Sizin birinci şəxsdən immersiv hekayələr, ağır sintezator musiqisi və anti-utopik korporativ üsyan axtarışlarınıza tam uyğundur.",
      playtimeValue: "50-100 saat"
    },
    RU: {
      title: "CYBERPUNK 2077",
      genre: "Научно-фантастическая RPG",
      vibe: "Неоновый Киберпанк",
      whyThisFits: "Идеально подходит под ваш запрос на захватывающие первоклассные истории с видом от первого лица, неоновыми пейзажами и бунтом против корпораций.",
      playtimeValue: "50-100 ч."
    }
  },
  "tunic": {
    AZ: {
      title: "TUNIC",
      genre: "Ekşn Macəra",
      vibe: "Kriptik & İzometrik",
      whyThisFits: "Oyundaxili təlimatı deşifrə etmək, şirin vizual estetika və dəqiq döyüş mexanikası ilə əsl kəşf hissi bəxş edir.",
      playtimeValue: "15-25 saat"
    },
    RU: {
      title: "TUNIC",
      genre: "Экшен-приключение",
      vibe: "Загадочный и Изометрический",
      whyThisFits: "Удовлетворяет жажду открытий: разгадывайте секреты по внутриигровому руководству, наслаждаясь уютным стилем и выверенной боевой системой.",
      playtimeValue: "15-25 ч."
    }
  },
  "baldurs-gate-3": {
    AZ: {
      title: "BALDUR'S GATE 3",
      genre: "Taktiki RPG",
      vibe: "Seçimə Əsaslanan Fantaziya",
      whyThisFits: "Addım-addım strategiya, güclü yoldaşlıq hekayələri və qərarlarınıza reaksiya verən inanılmaz ssenari azadlığı.",
      playtimeValue: "80-150 saat"
    },
    RU: {
      title: "BALDUR'S GATE 3",
      genre: "Тактическая RPG",
      vibe: "Высокое Фэнтези с Выбором",
      whyThisFits: "Невероятная глубина пошаговой стратегии, живые спутники и абсолютная свобода воли, реагирующая на каждое ваше решение.",
      playtimeValue: "80-150 ч."
    }
  },
  "hollow-knight": {
    AZ: {
      title: "HOLLOW KNIGHT",
      genre: "Metroidvaniya",
      vibe: "Melanxolik Cücü Dünyası",
      whyThisFits: "Atmosferik dizayn, çox dəqiq döyüş idarəetməsi və dərin qeyri-məcburi dünya tarixini sevənlər üçün mükəmməldir.",
      playtimeValue: "30-50 saat"
    },
    RU: {
      title: "HOLLOW KNIGHT",
      genre: "Метроидвания",
      vibe: "Меланхоличный мир насекомых",
      whyThisFits: "Придется по душе любителям густой атмосферы, отзывчивого управления, сложных боссов и загадочного скрытого лора.",
      playtimeValue: "30-50 ч."
    }
  },
  "outer-wilds": {
    AZ: {
      title: "OUTER WILDS",
      genre: "Sirli Macəra",
      vibe: "Kosmik Melanxoliya",
      whyThisFits: "Saf orqanik öyrənmə axtaranlar üçün idealdır. Heç bir xarakter inkişafı yoxdur, yalnız günəş dövrü sirrini açmaq üçün bilik qazanırsınız.",
      playtimeValue: "15-25 saat"
    },
    RU: {
      title: "OUTER WILDS",
      genre: "Исследование и Загадки",
      vibe: "Космическая Меланхолия",
      whyThisFits: "Шедевр органического исследования. Никакой прокачки — только ваши собственные знания и дедукция помогут раскрыть тайну угасающей звездной системы.",
      playtimeValue: "15-25 ч."
    }
  },
  "disco-elysium": {
    AZ: {
      title: "DISCO ELYSIUM",
      genre: "Psixoloji RPG",
      vibe: "Sərt Ədəbi Atmosfer",
      whyThisFits: "Ssenari, xarakter seçimi dərinliyi və psixoloji daxili dialoqları aktiv döyüşdən üstün tutursunuzsa, bu sizin üçündür.",
      playtimeValue: "30-50 saat"
    },
    RU: {
      title: "DISCO ELYSIUM",
      genre: "Психологическая RPG",
      vibe: "Литературный Нуар",
      whyThisFits: "Выдающееся повествование, безумная вариативность выбора и глубокие психологические диалоги вместо банальных сражений.",
      playtimeValue: "30-50 ч."
    }
  },
  "minecraft": {
    AZ: {
      title: "MINECRAFT",
      genre: "Qum qutusu / Sağ qalma",
      vibe: "Sonsuz Yaradıcılıq",
      whyThisFits: "Sonsuz yaradıcılıq azadlığı təklif edir. Mürəkkəb tikililər qurmaq və ya dostlarla birgə oynamaq üçün idealdır.",
      playtimeValue: "100+ saat"
    },
    RU: {
      title: "MINECRAFT",
      genre: "Песочница на выживание",
      vibe: "Бесконечное Творчество",
      whyThisFits: "Предоставляет абсолютную творческую свободу. Подходит как для возведения сложнейших механизмов, так и для ведения тихой жизни на сервере с друзьями.",
      playtimeValue: "100+ ч."
    }
  },
  "celeste": {
    AZ: {
      title: "CELESTE",
      genre: "Dəqiq Platformer",
      vibe: "Səmimi və Çətin",
      whyThisFits: "Dəqiq platformer refleksləri, özünü qəbul etmə haqqında inanılmaz dərəcədə təsirli hekayə ile birləşir.",
      playtimeValue: "10-20 saat"
    },
    RU: {
      title: "CELESTE",
      genre: "Прецизионный Платформер",
      vibe: "Трогательное Испытание",
      whyThisFits: "Оттачивайте мышечную память в сложнейших прыжках в сочетании с удивительно трогательной историей о принятии себя.",
      playtimeValue: "10-20 ч."
    }
  },
  "slay-the-spire": {
    AZ: {
      title: "SLAY THE SPIRE",
      genre: "Kart Roqlaykı",
      vibe: "Saf Strateji Dövrü",
      whyThisFits: "Ciddi kart sinergiyası hesablamalarını əla təkrar oynanıla bilənliklə birləşdirir. Sürətli seanslarda taktiki bacarıqlarınızı yoxlamaq üçün idealdır.",
      playtimeValue: "40-150 saat"
    },
    RU: {
      title: "SLAY THE SPIRE",
      genre: "Карточный роглайк",
      vibe: "Чистый Стратегический Цикл",
      whyThisFits: "Объединяет строгий расчет синергии карт с высочайшей реиграбельностью. Отличная разминка для ума в коротких забегах.",
      playtimeValue: "40-150 ч."
    }
  },
  "stardew-valley": {
    AZ: {
      title: "STARDEW VALLEY",
      genre: "Həyat Simulyatoru RPG",
      vibe: "İsti Rahat İcma",
      whyThisFits: "Öz təsərrüfatınızı qurmağa, maraqlı kənd sakinləri ilə dostlaşmağa və gərgin iş günündən sonra istirahət etməyə imkan verir.",
      playtimeValue: "50-120 saat"
    },
    RU: {
      title: "STARDEW VALLEY",
      genre: "Симулятор Жизни / RPG",
      vibe: "Теплое и Уютное Сообщество",
      whyThisFits: "Постройте собственную уютную ферму, подружитесь с харизматичными местными жителями и расслабьтесь после тяжелого дня.",
      playtimeValue: "50-120 ч."
    }
  }
};

const TRANSLATIONS = {
  EN: {
    // Navigation & Headers
    discover: "DISCOVER",
    library: "LIBRARY",
    feedback: "FEEDBACK",
    tuneProfile: "Tune Profile",
    gamingCore: "Gaming Core",
    yourProfile: "Your Profile",
    edit: "EDIT",
    preferredGenres: "Preferred Genres",
    availabilityTime: "Availability Time",
    aestheticMood: "Aesthetic Mood",
    matchFilters: "Match Filters",
    pcOnlySupport: "PC ONLY SUPPORT",
    multiplayer: "MULTIPLAYER",
    storyDriven: "STORY DRIVEN",
    engineAnalysis: "Engine Analysis",
    engineAnalysisText: "We've analyzed {count} gaming models, cross-referenced with your '{mood}' core parameters, to establish {deckLength} real discovery vectors.",
    match: "MATCH",
    proposedPitch: "PROPOSED PITCH",
    estPlaytime: "EST. PLAYTIME",
    coreVibe: "CORE VIBE",
    whyThisFits: "WHY THIS SUGGESTION",
    pass: "Pass",
    connect: "Connect",
    customPitchButton: "+ Propose Custom Match Pitch",
    vectorExhausted: "Match Vector Exhausted",
    exhaustedSub: "You've swiped through all original candidate options! You can clear exclusions to reload, or pitch your very own custom game match idea to the catalog.",
    reloadList: "Reload Swiped List",
    proposeCozy: "Propose Cozy Concept",
    matchLibraryTitle: "Match Library",
    librarySub: "Review your collected connections and add star ratings & playthrough reviews.",
    totalSaves: "Total Saves",
    resetLibrary: "Reset Library",
    likedOn: "Liked on",
    yourRating: "YOUR RATING",
    playthroughCritique: "PLAYTHROUGH CRITIQUE",
    critiquePlaceholder: "e.g. Cleared main story, sublime music but punishing endings!",
    save: "SAVE",
    saved: "SAVED",
    libraryEmpty: "Matches Library Empty",
    libraryEmptyDesc: "Shift back to index Discovery mode and tap \"Connect (��)\" on outstanding custom recommendations!",
    goToDiscover: "GO TO DISCOVER",
    feedbackTitle: "AI Engine Tuning Feedback",
    feedbackSub: "Help us adjust weight metrics for the neural game recommendation engine! Any specific title or mechanic desires?",
    rateDiscoveryQuality: "Rate Discovery Fit Quality",
    detailedComments: "Desire Log / Comments",
    detailedCommentsPlaceholder: "Describe what types of mechanics, playloops, or graphical themes you'd like the AI to discover for you...",
    submitFeedback: "SUBMIT TO NEURAL MODEL RE-TRAINING",
    feedbackInstruction: "Note: Feedback data directly weighs and updates semantic model profiles instantly across your next discovery deck turns!",
    engineOnline: "ENGINE ONLINE",
    editProfileTitle: "Neural Game Preference Engine",
    editProfileSub: "Adjust your active profile weights to recalculate discovery match scores.",
    usernameLabel: "Username",
    preferredGenresLabel: "Preferred Genres (Comma Separated)",
    preferredGenresPlaceholder: "e.g. Action RPG, Roguelike, Cozy",
    availabilityLabel: "Playtime Availability Profile",
    aestheticMoodLabel: "Aesthetic Gameplay Mood",
    challenging: "Challenging",
    relaxing: "Relaxing",
    storyRich: "Story Rich",
    casual: "Casual",
    saveProfileSettings: "SYNC ENGINE",
    proposeCustomTitle: "Pitch New Game Concept",
    gameTitleLabel: "Game Title *",
    devLabel: "Developer Studio name",
    genreLabel: "Category / Genre",
    uniqueVibeLabel: "Core Aesthetic Vibe",
    whyFitsLabel: "Special Custom Match Reason",
    whyFitsPlaceholder: "How does this appeal to your specific profile interests?",
    targetAttributes: "Target Filters Match Attributes",
    pcSupported: "PC Supported",
    multiplayerReady: "Multiplayer ready",
    storyDrivenArc: "Story Driven Arc",
    cancel: "Cancel",
    injectProposal: "INJECT PROPOSAL",
    customDesignsIndexed: "CUSTOM DESIGNS INDEXED",
    onTheRadar: "On The Radar",
    hotBadge: "HOT",
    radarFooterText: "Selecting a game card focuses discovery calculations on that category vibe.",
    proposeNewPitch: "PROPOSE NEW PITCH",
    usernamePlaceholder: "e.g. Alex Rivera",
    estPlaytimeLengthLabel: "Est. Playtime Length",
    optionCasual: "1-2 hrs/day (Casual Sessions)",
    optionModerate: "2-4 hrs/day (Moderate Sessions)",
    optionDedicated: "4+ hrs/day (Dedicated Sessions)",
    toastConnected: "🧬 Connected! \"{title}\" added to your Match Library.",
    toastRefined: "🚫 Refined. \"{title}\" pushed to bottom priority.",
    toastCleared: "⚡ Preference engines cleared! Loading all original options.",
    toastFocusShifted: "🎯 Active match focus shifted to: {title}",
    toastNotesSaved: "📁 Personal gameplay review notes saved securely.",
    toastRemoved: "🗑️ Game removed from your matches library.",
    toastSynced: "⚙️ Synced. Deep learning model updated matching criteria!",
    toastSuccessCreation: "🌌 Success! \"{title}\" created & injected into active recommendations.",
    toastFeedbackLogged: "💌 Recommendation engine feedback logged. Our AI coordinators thank you!",
    toastLangSwitched: "🌐 Language switched to English",
    authTitle: "Smart Match Gate",
    authSub: "Connect to the Neural Recommendation Core Engine",
    signInTab: "SIGN IN",
    signUpTab: "CREATE COGNITIVE PROFILE",
    loginButton: "ACCESS CORES",
    signUpButton: "INITIALIZE PROTOCOL",
    guestButton: "ENTER COGNITIVE INTERVIEW (GUEST)",
    passwordLabel: "Security Code / Password",
    passwordPlaceholder: "Enter security code...",
    genresLabel: "Preferred Genres (Comma Separated)",
    genresPlaceholder: "e.g. RPG, Roguelike, Cozy",
    playtimeLabel: "Playtime Profile",
    moodLabel: "Gameplay Cognitive Theme/Mood",
    toastAuthSuccess: "⚡ Session authorized! Welcome back, {username}.",
    toastRegistSuccess: "🌌 Cognitive Profile registered! Welcome to Smart Match, {username}!",
    logoutButton: "Disconnect Profile",
  },
  AZ: {
    // Navigation & Headers
    discover: "KƏŞF ET",
    library: "KİTABXANA",
    feedback: "RƏY",
    tuneProfile: "Profili tənzimlə",
    gamingCore: "Oyun nüvəsi",
    yourProfile: "Sizin Profiliniz",
    edit: "DƏYİŞ",
    preferredGenres: "Üstünlük verilən janrlar",
    availabilityTime: "Oynama müddəti",
    aestheticMood: "Estetik Əhval",
    matchFilters: "Uyğunluq Filtrləri",
    pcOnlySupport: "YALNIZ PC DƏSTƏYİ",
    multiplayer: "MULTİPLEYER",
    storyDriven: "HEKAYƏLİ",
    engineAnalysis: "Nüvə Analizi",
    engineAnalysisText: "Biz {count} oyun modelini analiz etdik və '{mood}' parametrlərinizə əsasən {deckLength} kəşf vektoru təyin etdik.",
    match: "UYĞUNLUQ",
    proposedPitch: "TƏKLİF OLUNAN KONSEPT",
    estPlaytime: "TƏXMİNİ MÜDDƏT",
    coreVibe: "ƏSAS VAYB (ATMOSFER)",
    whyThisFits: "NİYƏ BU UYĞUNDUR",
    pass: "Keç",
    connect: "Qoşul",
    customPitchButton: "+ Özəl Oyun Konsepti Təklif Et",
    vectorExhausted: "Uyğunluq Vektorları bitdi",
    exhaustedSub: "Bütün ilkin təklifləri vərəqlədiniz! Siyahını yeniləmək üçün filtrləri təmizləyə bilərsiniz, yaxud öz oyun təklifinizi əlavə edə bilərsiniz.",
    reloadList: "Siyahını Yenidən Yüklə",
    proposeCozy: "Rahat Konsept Təklif Et",
    matchLibraryTitle: "Uyğunluq Kitabxanası",
    librarySub: "Kolleksiyalarınızı nəzərdən keçirin, qiymətləndirin və rəylərinizi yazın.",
    totalSaves: "Ümumi Yadda Saxlanılanlar",
    resetLibrary: "Kitabxananı Təmizlə",
    likedOn: "Bəyənildi",
    yourRating: "SİZİN QİYMƏTİNİZ",
    playthroughCritique: "OYUN HAQQINDA RƏY",
    critiquePlaceholder: "məsələn: Əsas hekayəni bitirdim, musiqisi əladır lakin sonluğu çətindir!",
    save: "YADDA SAXLA",
    saved: "SAXLANILDI",
    libraryEmpty: "Kitabxana Boşdur",
    libraryEmptyDesc: "Kəşf bölməsinə keçin və tövsiyə olunan mükəmməl oyunları bəyənərək (👍) bura əlavə edin!",
    goToDiscover: "KƏŞF REJİMİNƏ KEÇID",
    feedbackTitle: "Süni İntellekt Nüvə tənzimləmə rəyi",
    feedbackSub: "Süni intellekt tövsiyə modelimizin çəki meyarlarını tənzimləməyə kömək edin! Hansı xüsusi oyun mexanikalarını bəyənirsiniz?",
    rateDiscoveryQuality: "Kəşf Keyfiyyətini Qiymətləndirin",
    detailedComments: "Arzu olunan qeydlər / rəylər",
    detailedCommentsPlaceholder: "Süni intellektin sizin üçün tapmasını istədiyiniz mexanikalar, oyun dövrləri və ya qrafik mövzuları təsvir edin...",
    submitFeedback: "METRİKA HESABATINI GÖNDƏR (NEURON MODELİNƏ)",
    feedbackInstruction: "Qeyd: Rəy məlumatları gələcək tövsiyələri dərhal optimallaşdırmaq üçün birbaşa model profillərində nəzərə alınır!",
    engineOnline: "SİSTEM AKTİVDİR",
    editProfileTitle: "Süni İntellekt Oyun Uyğunluğu Modeli",
    editProfileSub: "Kəşf uyğunluğu xallarını yenidən hesablamaq üçün aktiv profil tərzi çəkilərini dəyişin.",
    usernameLabel: "İstifadəçi adı",
    preferredGenresLabel: "Üstünlük verilən janrlar (Vergüllə ayırın)",
    preferredGenresPlaceholder: "məs. Action RPG, Roguelike, Cozy",
    availabilityLabel: "Gündəlik oynama müddəti",
    aestheticMoodLabel: "Estetik Əhval Seçimi",
    challenging: "Çətin / Mübarizəli",
    relaxing: "Rahatladıcı / Sakit",
    storyRich: "Zəngin Hekayəli",
    casual: "Sadə / Kassual",
    saveProfileSettings: "SİSTEMİ YENİLƏ",
    proposeCustomTitle: "Yeni Oyun Konsepti Təklif Et",
    gameTitleLabel: "Oyun adı *",
    devLabel: "Proqramçı / Studiya adı",
    genreLabel: "Janr / Kateqoriya",
    uniqueVibeLabel: "Əsas Estetik Atmosfer/Stil",
    whyFitsLabel: "Xüsusi Uyğunluq Səbəbi",
    whyFitsPlaceholder: "Bu oyun profilinizdəki meyarlara necə cavab verir?",
    targetAttributes: "Hədəf Filtri Uyğunluq Atributları",
    pcSupported: "PC Dəstəklənir",
    multiplayerReady: "Multipleyer mövcuddur",
    storyDrivenArc: "Hekayəyə Əsaslanan Süjet",
    cancel: "Ləğv et",
    injectProposal: "TƏKLİFİ DAXİL ET",
    customDesignsIndexed: "ÖZƏL DIZAYNLAR ƏLAVƏ EDİLDİ",
    onTheRadar: "Radarda",
    hotBadge: "İSTİ",
    radarFooterText: "Hər hansı oyun kartını seçməklə bu kateqoriyaya fokuslanmış kəşflər əldə edə bilərsiniz.",
    proposeNewPitch: "YENİ TƏKLİF YARAT",
    usernamePlaceholder: "məs. Alex Rivera",
    estPlaytimeLengthLabel: "Təxmini Oyun Müddəti",
    optionCasual: "1-2 saat/gün (Sadə Seanslar)",
    optionModerate: "2-4 saat/gün (Mülayim Seanslar)",
    optionDedicated: "4+ saat/gün (Fəal Seanslar)",
    toastConnected: "🧬 Qoşuldu! \"{title}\" Uyğunluq Kitabxananıza əlavə edildi.",
    toastRefined: "🚫 Yeniləndi. \"{title}\" ən aşağı prioritetli siyahıya salındı.",
    toastCleared: "⚡ Üstünlüklər sıfırlandı! Bütün ilkin seçimlər yüklənir.",
    toastFocusShifted: "🎯 Aktiv uyğunluq fokusu bura dəyişdirildi: {title}",
    toastNotesSaved: "📁 Şəxsi oyun rəy qeydləriniz təhlükəsiz şəkildə yadda saxlanıldı.",
    toastRemoved: "🗑️ Oyun uyğunluq kitabxananızdan silindi.",
    toastSynced: "⚙️ Sinxronizasiya edildi. Dərindən öyrənmə modeli uyğunluq meyarlarını yenilədi!",
    toastSuccessCreation: "🌌 Uğurlu! \"{title}\" yaradıldı və aktiv tövsiyələrə əlavə edildi.",
    toastFeedbackLogged: "💌 Süni intellekt rəyiniz qeydə alındı. Süni intellekt koordinatorlarımız sizə təşəkkür edir!",
    toastLangSwitched: "🌐 Dil Azərbaycan dilinə dəyişdirildi (AZ)",
    authTitle: "Smart Match Giriş Portalı",
    authSub: "Neyron Tövsiyə Şəbəkəsinə Qoşulun",
    signInTab: "DAXİL OL",
    signUpTab: "PROFİL YARAT",
    loginButton: "SİSTEMƏ KEÇ",
    signUpButton: "PROFİLİ AKTİVLƏŞDİR",
    guestButton: "QONAQ KİMİ DAXİL OL",
    passwordLabel: "Təhlükəsizlik Kodu / Şifrə",
    passwordPlaceholder: "Şifrənizi daxil edin...",
    genresLabel: "Üstünlük verilən janrlar (Vergüllə ayırın)",
    genresPlaceholder: "məs. RPG, Action, Cozy",
    playtimeLabel: "Gündəlik Oynama Müddəti",
    moodLabel: "Estetik Əhval Seçimi",
    toastAuthSuccess: "⚡ Sessiya təsdiqləndi! Xoş gəldiniz, {username}.",
    toastRegistSuccess: "🌌 Profil qeydə alındı! Smart Match-ə xoş gəldiniz, {username}!",
    logoutButton: "Sessiyadan Çıx",
  },
  RU: {
    // Navigation & Headers
    discover: "ОТКРЫТИЯ",
    library: "БИБЛИОТЕКА",
    feedback: "ОТЗЫВЫ",
    tuneProfile: "Настроить Профиль",
    gamingCore: "Игровое Ядро",
    yourProfile: "Ваш Профиль",
    edit: "ИЗМЕНИТЬ",
    preferredGenres: "Любимые жанры",
    availabilityTime: "Время игры",
    aestheticMood: "Игровое настроение",
    matchFilters: "Фильтры Соответствия",
    pcOnlySupport: "ТОЛЬКО НА ПК",
    multiplayer: "МУЛЬТИПЛЕЕР",
    storyDriven: "СЮЖЕТНАЯ ИГРА",
    engineAnalysis: "Анализ Алгоритма",
    engineAnalysisText: "Мы проанализировали {count} игровых моделей, сопоставили их с вашими критериями '{mood}' и нашли {deckLength} векторов открытий.",
    match: "СОВПАДЕНИЕ",
    proposedPitch: "ПРЕДЛОЖЕННЫЙ КОНЦЕПТ",
    estPlaytime: "ВРЕМЯ ПРОХОЖДЕНИЯ",
    coreVibe: "АТМОСФЕРА ИГРЫ",
    whyThisFits: "ПОЧЕМУ ЭТО ПОДХОДИТ",
    pass: "Пропустить",
    connect: "Добавить",
    customPitchButton: "+ Предложить Свой Игровой Концепт",
    vectorExhausted: "Все варианты просмотрены",
    exhaustedSub: "Вы просмотрели всю базу рекомендаций! Можно сбросить исключения, чтобы загрузить игры заново, или предложить свой собственный концепт.",
    reloadList: "Сбросить Пропущенные",
    proposeCozy: "Предложить Идею",
    matchLibraryTitle: "Библиотека Игр",
    librarySub: "Просматривайте свои связи с играми, выставляйте оценки и оставляйте отзывы о прохождении.",
    totalSaves: "Всего Сохранений",
    resetLibrary: "Очистить Библиотеку",
    likedOn: "Добавлено",
    yourRating: "ВАША ОЦЕНКА",
    playthroughCritique: "ОТЗЫВ О ПРОХОЖДЕНИИ",
    critiquePlaceholder: "например: Прошел сюжет, потрясающая музыка, но очень сложный финал!",
    save: "СОХРАНИТЬ",
    saved: "СОХРАНЕНО",
    libraryEmpty: "Библиотека Пуста",
    libraryEmptyDesc: "Вернитесь во вкладку «Открытия» и нажмите «Добавить (👍)» на наиболее подходящие вам рекомендации!",
    goToDiscover: "ПЕРЕЙТИ К ОТКРЫТИЯМ",
    feedbackTitle: "Настройка Рекомендательного Движка",
    feedbackSub: "Помогите нам настроить весовые коэффициенты алгоритма рекомендаций! Напишите о ваших пожеланиях.",
    rateDiscoveryQuality: "Оцените Точность Подбора",
    detailedComments: "Пожелания к подбору / Комментарии",
    detailedCommentsPlaceholder: "Опишите, какие механики, геймплей или графические стили вы хотите, чтобы искусственный интеллект искал для вас...",
    submitFeedback: "ОТПРАВИТЬ ОТЧЕТ В НЕЙРОСЕТЬ",
    feedbackInstruction: "Примечание: данные отзывов напрямую взвешивают и обновляют профиль для мгновенной оптимизации рекомендаций на следующих шагах!",
    engineOnline: "СИСТЕМА АКТИВНА",
    editProfileTitle: "Настройка Игровой Совместимости",
    editProfileSub: "Измените параметры текущего профиля, чтобы пересчитать проценты совпадений для всех игр.",
    usernameLabel: "Имя (Никнейм)",
    preferredGenresLabel: "Любимые жанры (через запятую)",
    preferredGenresPlaceholder: "например: Action RPG, Roguelike, Cozy",
    availabilityLabel: "Сколько часов в день играете",
    aestheticMoodLabel: "Игровая атмосфера / Настроение",
    challenging: "Сложное / Вызов",
    relaxing: "Расслабляющее / Уютное",
    storyRich: "Глубокий Сюжет",
    casual: "Казуальное / Простое",
    saveProfileSettings: "ОБНОВИТЬ КРИТЕРИИ",
    proposeCustomTitle: "Предложить Новый Концепт Игры",
    gameTitleLabel: "Название игры *",
    devLabel: "Разработчик / Команда",
    genreLabel: "Жанр",
    uniqueVibeLabel: "Атмосфера / СТИЛЬ",
    whyFitsLabel: "Почему это подходит вашему профилю?",
    whyFitsPlaceholder: "Как эта игра соответствует вашим индивидуальным критериям?",
    targetAttributes: "Атрибуты Соответствия Фильтрам",
    pcSupported: "Поддерживается на ПК",
    multiplayerReady: "Мультиплеер доступен",
    storyDrivenArc: "Сюжетная Линия",
    cancel: "Отмена",
    injectProposal: "ВНЕДРИТЬ КОНЦЕПТ",
    customDesignsIndexed: "КАСТОМНЫХ КОНЦЕПТОВ",
    onTheRadar: "На Радаре",
    hotBadge: "ГОРЯЧЕЕ",
    radarFooterText: "Выбор игры фокусирует рекомендательные расчеты на атмосфере этой категории.",
    proposeNewPitch: "ПРЕДЛОЖИТЬ КОНЦЕПТ",
    usernamePlaceholder: "например: Alex Rivera",
    estPlaytimeLengthLabel: "Примерное Время игры",
    optionCasual: "1-2 часа/день (Казуальные сессии)",
    optionModerate: "2-4 часа/день (Умеренные сессии)",
    optionDedicated: "4+ часов/день (Выделенные сессии)",
    toastConnected: "🧬 Добавлено! «{title}» добавлена в вашу библиотеку совпадений.",
    toastRefined: "🚫 Обновлено. «{title}» перемещена в самый низ приоритетов.",
    toastCleared: "⚡ Критерии сброшены! Все исходные варианты загружены.",
    toastFocusShifted: "🎯 Фокус активного подбора перенесен на: {title}",
    toastNotesSaved: "📁 Личные заметки о прохождении надежно сохранены.",
    toastRemoved: "🗑️ Игра удалена из вашей библиотеки.",
    toastSynced: "⚙️ Синхронизировано. Алгоритм глубокого обучения пересчитал критерии!",
    toastSuccessCreation: "🌌 Успешно! «{title}» добавлена в список активных рекомендаций.",
    toastFeedbackLogged: "💌 Отзыв зарегистрирован в системе подбора. Координаторы ИИ благодарят вас!",
    toastLangSwitched: "🌐 Язык переключен на Русский (RU)",
    authTitle: "Шлюз Авторизации",
    authSub: "Подключение к нейросетевому рекомендательному ядру",
    signInTab: "ВХОД",
    signUpTab: "РЕГИСТРАЦИЯ ПРОФИЛЯ",
    loginButton: "ПОДКЛЮЧИТЬСЯ",
    signUpButton: "ИНИЦИАЛИЗИРОВАТЬ ПРОТОКОЛ",
    guestButton: "ВОЙТИ КАК ГОСТЬ",
    passwordLabel: "Код безопасности / Пароль",
    passwordPlaceholder: "Введите пароль...",
    genresLabel: "Любимые жанры (через запятую)",
    genresPlaceholder: "например: RPG, Action, Cozy",
    playtimeLabel: "Сколько часов в день играете",
    moodLabel: "Игровая атмосфера / Настроение",
    toastAuthSuccess: "⚡ Сессия авторизована! С возвращением, {username}.",
    toastRegistSuccess: "🌌 Профиль успешно создан! Добро пожаловать, {username}!",
    logoutButton: "Отключить профиль",
  }
};

export default function App() {
  // Navigation Tabs State: 'discover' | 'library' | 'feedback'
  const [activeTab, setActiveTab] = useState<'discover' | 'library' | 'feedback'>('discover');

  // Active selected language state: 'EN' | 'AZ' | 'RU'
  const [currentLang, setCurrentLang] = useState<'EN' | 'AZ' | 'RU'>(() => {
    const saved = localStorage.getItem('sm_lang');
    return (saved === 'AZ' || saved === 'RU' || saved === 'EN') ? saved : 'EN';
  });

  // Save language to local storage
  useEffect(() => {
    localStorage.setItem('sm_lang', currentLang);
  }, [currentLang]);

  // Translate helper
  const t = (key: keyof typeof TRANSLATIONS['EN']) => {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS['EN'][key];
  };

  // Helper to translate moods dynamically
  const getTranslatedMood = (moodName: string) => {
    const formatted = moodName.toLowerCase();
    if (formatted === 'challenging') return t('challenging');
    if (formatted === 'relaxing') return t('relaxing');
    if (formatted === 'story rich') return t('storyRich');
    if (formatted === 'casual') return t('casual');
    return moodName;
  };

  // Helper to get translated game properties
  const getGameField = (game: Game, field: 'title' | 'genre' | 'vibe' | 'whyThisFits' | 'playtimeValue'): string => {
    if (currentLang === 'EN' || game.id.startsWith("custom-")) {
      return game[field];
    }
    const trans = GAME_TRANSLATIONS[game.id];
    if (trans && trans[currentLang] && trans[currentLang][field]) {
      return trans[currentLang][field]!;
    }
    return game[field];
  };

  // Helper to translate playtime availability dynamically
  const getTranslatedPlaytime = (playtime: string) => {
    if (!playtime) return '';
    if (playtime.startsWith("1-2")) return t('optionCasual');
    if (playtime.startsWith("2-4") || playtime.startsWith("2-2.4") || playtime.includes("2-2.4") || playtime.includes("2-4")) return t('optionModerate');
    if (playtime.startsWith("4+")) return t('optionDedicated');
    return playtime;
  };

  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sm_auth') === 'true';
  });
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [signUpGenres, setSignUpGenres] = useState('RPG, Action, Cozy');
  const [signUpPlaytime, setSignUpPlaytime] = useState('2-4 hrs/day');
  const [signUpMood, setSignUpMood] = useState('Challenging');
  const [authError, setAuthError] = useState<string | null>(null);

  // Load profile from localStorage or defaults
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('sm_profile');
    return saved ? JSON.parse(saved) : {
      username: "Alex Rivera",
      genres: "RPG, Roguelike",
      playtime: "2-4 hrs/day",
      mood: "Challenging"
    };
  });

  // Load Filters from localStorage or defaults
  const [filters, setFilters] = useState<MatchFilters>(() => {
    const saved = localStorage.getItem('sm_filters');
    return saved ? JSON.parse(saved) : {
      pcOnly: true,
      multiplayer: false,
      storyDriven: true
    };
  });

  // Load liked games from localStorage or defaults
  const [likedGames, setLikedGames] = useState<LikedGame[]>(() => {
    const saved = localStorage.getItem('sm_liked_games_v2');
    return saved ? JSON.parse(saved) : [
      { id: "hades-2", likedAt: new Date(Date.now() - 3600000).toISOString(), rating: 5, reviewText: "Absolutely beautiful game. Combat is spectacular and Melinoë is great!" },
      { id: "elden-ring", likedAt: new Date(Date.now() - 7200000).toISOString(), rating: 4, reviewText: "Huge, challenging, and breathtaking. Shadow of the Erdtree adds even more mystery!" }
    ];
  });

  // Load disliked ids to weed out from active discovery
  const [dislikedIds, setDislikedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sm_disliked_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Custom added games (users can propose custom-matched games manually!)
  const [customGames, setCustomGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('sm_custom_games');
    return saved ? JSON.parse(saved) : [];
  });

  // Merged entire available items selection
  const allGames = [...DEFAULT_GAMES, ...customGames];

  // Active loaded swiper game state
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  // Modal control states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCustomGameOpen, setIsCustomGameOpen] = useState(false);
  const [currentFeedbackMessage, setCurrentFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Edit Profile Form fields
  const [tempUsername, setTempUsername] = useState(profile.username);
  const [tempGenres, setTempGenres] = useState(profile.genres);
  const [tempPlaytime, setTempPlaytime] = useState(profile.playtime);
  const [tempMood, setTempMood] = useState(profile.mood);

  // Custom Game Proposal Form fields
  const [newTitle, setNewTitle] = useState("");
  const [newDev, setNewDev] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newVibe, setNewVibe] = useState("");
  const [newWhy, setNewWhy] = useState("");
  const [newPlaytimeVal, setNewPlaytimeVal] = useState("20-40 hrs");
  const [newPlatformPC, setNewPlatformPC] = useState(true);
  const [newMultiplayer, setNewMultiplayer] = useState(false);
  const [newStoryDriven, setNewStoryDriven] = useState(true);

  // Active Swipe Effect visual animations helper
  const [swipeEffect, setSwipeEffect] = useState<'like' | 'dislike' | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Save changes to local persistence
  useEffect(() => {
    localStorage.setItem('sm_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sm_filters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('sm_liked_games_v2', JSON.stringify(likedGames));
  }, [likedGames]);

  useEffect(() => {
    localStorage.setItem('sm_disliked_ids', JSON.stringify(dislikedIds));
  }, [dislikedIds]);

  useEffect(() => {
    localStorage.setItem('sm_custom_games', JSON.stringify(customGames));
  }, [customGames]);

  // Dynamically compute Match Percentage based on Preferences, Genres, and Active toggles
  const calculateMatchPercent = (game: Game) => {
    let score = 75; // Baseline match
    
    // 1. Tag checks against current Match Filters
    if (filters.multiplayer && game.multiplayer) score += 8;
    if (filters.storyDriven && game.storyDriven) score += 8;
    if (filters.pcOnly && game.platforms.includes("PC")) score += 4;

    // 2. User Profile Genre alignment
    const profileGenresArray = profile.genres.toLowerCase().split(',').map(s => s.trim());
    profileGenresArray.forEach(genreKeyword => {
      if (genreKeyword && (game.genre.toLowerCase().includes(genreKeyword) || game.vibe.toLowerCase().includes(genreKeyword))) {
        score += 6;
      }
    });

    // 3. User Profile Mood aligning with Game vibe/style
    const moodMap: Record<string, string[]> = {
      "challenging": ["dark", "soulslike", "hardcore", "strategy", "mythic", "action"],
      "relaxing": ["cozy", "sandbox", "community", "lite", "warm", "solitary"],
      "story rich": ["literary", "story", "epic", "choice", "fantasy", "cyberpunk", "mystery"],
      "casual": ["creative", "endless", "creative", "farming"]
    };

    const targetMoodTags = moodMap[profile.mood.toLowerCase()] || [];
    targetMoodTags.forEach(tag => {
      if (game.vibe.toLowerCase().includes(tag) || game.genre.toLowerCase().includes(tag)) {
        score += 7;
      }
    });

    // Normalize bounds between 55% and 99%
    score = Math.min(score, 99);
    score = Math.max(score, 58);
    return score;
  };

  // Get list of games eligible for Discovery (Excluding liked, disliked, and sorted by match %)
  const getDiscoveryDeck = () => {
    const likedIds = likedGames.map(g => g.id);
    return allGames
      .filter(g => !likedIds.includes(g.id) && !dislikedIds.includes(g.id))
      .map(g => ({
        ...g,
        matchPercent: calculateMatchPercent(g)
      }))
      .sort((a, b) => b.matchPercent - a.matchPercent);
  };

  // Keep track of the current deck
  const discoveryDeck = getDiscoveryDeck();

  // If activeGame is empty, load the top card from current deck
  useEffect(() => {
    if (!activeGame && discoveryDeck.length > 0) {
      setActiveGame(discoveryDeck[0]);
    } else if (activeGame && !discoveryDeck.some(g => g.id === activeGame.id)) {
      // If the current game was liked/disliked/filtered out, load next highest
      setActiveGame(discoveryDeck.length > 0 ? discoveryDeck[0] : null);
    }
  }, [likedGames, dislikedIds, filters, profile, customGames]);

  // Show status banner temporarily
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3800);
  };

  // Swipe handlers
  const handleLike = (gameId: string) => {
    setSwipeEffect('like');
    setTimeout(() => {
      if (!likedGames.some(l => l.id === gameId)) {
        const newLike: LikedGame = {
          id: gameId,
          likedAt: new Date().toISOString(),
          rating: 0,
          reviewText: ""
        };
        setLikedGames(prev => [newLike, ...prev]);
        const matchedGame = allGames.find(g => g.id === gameId);
        triggerToast(t('toastConnected').replace('{title}', matchedGame?.title || 'Game'));
      }
      setSwipeEffect(null);
      // Next game is loaded via the secondary useEffect
    }, 280);
  };

  const handleDislike = (gameId: string) => {
    setSwipeEffect('dislike');
    setTimeout(() => {
      if (!dislikedIds.includes(gameId)) {
        setDislikedIds(prev => [...prev, gameId]);
        const matchedGame = allGames.find(g => g.id === gameId);
        triggerToast(t('toastRefined').replace('{title}', matchedGame?.title || 'Game'));
      }
      setSwipeEffect(null);
    }, 280);
  };

  const handleResetDeck = () => {
    setDislikedIds([]);
    // Remove custom games as well? No, just reset swipes
    triggerToast(t('toastCleared'));
  };

  // Select a specific game from "On the Radar" directly
  const handleSelectGameDirect = (game: Game) => {
    setActiveGame(game);
    triggerToast(t('toastFocusShifted').replace('{title}', getGameField(game, 'title')));
  };

  // Saved reviews and ratings update inside Library
  const handleUpdateRating = (gameId: string, rating: number) => {
    setLikedGames(prev => prev.map(item => {
      if (item.id === gameId) {
        return { ...item, rating };
      }
      return item;
    }));
  };

  const handleUpdateReviewText = (gameId: string, text: string) => {
    setLikedGames(prev => prev.map(item => {
      if (item.id === gameId) {
        return { ...item, reviewText: text, noteSaved: false };
      }
      return item;
    }));
  };

  const handleSaveReviewNote = (gameId: string) => {
    setLikedGames(prev => prev.map(item => {
      if (item.id === gameId) {
        return { ...item, noteSaved: true };
      }
      return item;
    }));
    triggerToast(t('toastNotesSaved'));
  };

  const handleRemoveLiked = (gameId: string) => {
    setLikedGames(prev => prev.filter(item => item.id !== gameId));
    triggerToast(t('toastRemoved'));
  };

  const handleOpenEditProfile = () => {
    setTempUsername(profile.username);
    setTempGenres(profile.genres);
    setTempPlaytime(profile.playtime);
    setTempMood(profile.mood);
    setIsEditProfileOpen(true);
  };

  // Profile save helper
  const saveProfileDirect = (updated: Profile) => {
    setProfile(updated);
    localStorage.setItem('sm_profile', JSON.stringify(updated));
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authUsername.trim()) return;

    const savedUsersStr = localStorage.getItem('sm_auth_users');
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    const isDefaultUser = authUsername.trim().toLowerCase() === "alex rivera";
    const defaultPass = "password";

    if (isDefaultUser) {
      if (authPassword && authPassword !== defaultPass) {
        setAuthError(currentLang === 'EN' ? "❌ Invalid security key for Alex Rivera ('password')." : currentLang === 'AZ' ? "❌ Alex Rivera üçün yanlış şifrə ('password' daxil edin)." : "❌ Неверный пароль для Alex Rivera (используйте 'password').");
        return;
      }
      const restoredDefault: Profile = {
        username: "Alex Rivera",
        genres: "RPG, Roguelike",
        playtime: "2-4 hrs/day",
        mood: "Challenging"
      };
      saveProfileDirect(restoredDefault);
      setIsAuthenticated(true);
      localStorage.setItem('sm_auth', 'true');
      localStorage.setItem('sm_auth_username', "Alex Rivera");
      triggerToast(t('toastAuthSuccess').replace('{username}', "Alex Rivera"));
      return;
    }

    const matchedUser = savedUsers.find((u: any) => u.username.toLowerCase() === authUsername.trim().toLowerCase());
    if (matchedUser) {
      if (matchedUser.password !== authPassword) {
        setAuthError(currentLang === 'EN' ? "❌ Security code key incorrect." : currentLang === 'AZ' ? "❌ Yanlış təhlükəsizlik şifrəsi daxil edilib." : "❌ Неверный пароль безопасности.");
        return;
      }
      const restoredProfile: Profile = {
        username: matchedUser.username,
        genres: matchedUser.genres,
        playtime: matchedUser.playtime,
        mood: matchedUser.mood
      };
      saveProfileDirect(restoredProfile);
      setIsAuthenticated(true);
      localStorage.setItem('sm_auth', 'true');
      localStorage.setItem('sm_auth_username', matchedUser.username);
      triggerToast(t('toastAuthSuccess').replace('{username}', matchedUser.username));
    } else {
      // Dynamic lazy registration on sign in
      const autoProfile: Profile = {
        username: authUsername.trim(),
        genres: "RPG, Rogue, Indie",
        playtime: "2-4 hrs/day",
        mood: "Challenging"
      };
      const newUser = {
        username: authUsername.trim(),
        password: authPassword || "password",
        genres: autoProfile.genres,
        playtime: autoProfile.playtime,
        mood: autoProfile.mood
      };
      savedUsers.push(newUser);
      localStorage.setItem('sm_auth_users', JSON.stringify(savedUsers));
      
      saveProfileDirect(autoProfile);
      setIsAuthenticated(true);
      localStorage.setItem('sm_auth', 'true');
      localStorage.setItem('sm_auth_username', newUser.username);
      triggerToast(t('toastRegistSuccess').replace('{username}', newUser.username));
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authUsername.trim()) return;

    const savedUsersStr = localStorage.getItem('sm_auth_users');
    const savedUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const exists = savedUsers.some((u: any) => u.username.toLowerCase() === authUsername.trim().toLowerCase());
    if (exists || authUsername.trim().toLowerCase() === "alex rivera") {
      setAuthError(currentLang === 'EN' ? "⚠️ Profile already registered. Try signing in." : currentLang === 'AZ' ? "⚠️ Bu istifadəçi adı artıq qeydiyyatdan keçib." : "⚠️ Профиль уже зарегистрирован. Попробуйте войти.");
      return;
    }

    const newUser = {
      username: authUsername.trim(),
      password: authPassword || "password",
      genres: signUpGenres,
      playtime: signUpPlaytime,
      mood: signUpMood
    };
    savedUsers.push(newUser);
    localStorage.setItem('sm_auth_users', JSON.stringify(savedUsers));

    const newProfile: Profile = {
      username: newUser.username,
      genres: newUser.genres,
      playtime: newUser.playtime,
      mood: newUser.mood
    };
    saveProfileDirect(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('sm_auth', 'true');
    localStorage.setItem('sm_auth_username', newUser.username);
    triggerToast(t('toastRegistSuccess').replace('{username}', newUser.username));
  };

  const handleGuestSignIn = () => {
    const guestUser: Profile = {
      username: "Guest Voyager",
      genres: "Action, Indie, Arcade",
      playtime: "1-2 hrs/day",
      mood: "Relaxing"
    };

    saveProfileDirect(guestUser);
    setIsAuthenticated(true);
    localStorage.setItem('sm_auth', 'true');
    localStorage.setItem('sm_auth_username', "Guest Voyager");
    triggerToast(t('toastAuthSuccess').replace('{username}', "Guest Voyager"));
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sm_auth');
    localStorage.removeItem('sm_auth_username');
    setAuthUsername('');
    setAuthPassword('');
    triggerToast(currentLang === 'EN' ? "🔒 Disconnected. Session logs offline." : currentLang === 'AZ' ? "🔒 Sessiyadan çıxıldı." : "🔒 Профиль отключен.");
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      username: tempUsername,
      genres: tempGenres,
      playtime: tempPlaytime,
      mood: tempMood
    });
    setIsEditProfileOpen(false);
    triggerToast(t('toastSynced'));
  };

  // Custom Game Proposal submit
  const handleCreateCustomProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const randomizedId = `custom-${Date.now()}`;
    const cleanProposed: Game = {
      id: randomizedId,
      title: newTitle.toUpperCase(),
      developer: newDev || "Custom Pitch Team",
      genre: newGenre || "AI Hybrid Concept",
      playtimeValue: newPlaytimeVal,
      vibe: newVibe || "Unexplored Synthesis",
      whyThisFits: newWhy || "Speculatively synthesized directly from your unique gaming desires.",
      imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
      vibeColor: "from-purple-950 to-slate-900",
      platforms: newPlatformPC ? ["PC"] : [],
      multiplayer: newMultiplayer,
      storyDriven: newStoryDriven
    };

    if (!newPlatformPC) {
      cleanProposed.platforms.push("Console");
    }

    setCustomGames(prev => [...prev, cleanProposed]);
    setIsCustomGameOpen(false);
    
    // Clear fields
    setNewTitle("");
    setNewDev("");
    setNewGenre("");
    setNewVibe("");
    setNewWhy("");
    setNewPlaytimeVal("30-50 hrs");

    triggerToast(t('toastSuccessCreation').replace('{title}', cleanProposed.title));
  };

  // Feedback form submit
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFeedbackMessage.trim()) return;

    // Simulate perfect API reporting logging
    setCurrentFeedbackMessage("");
    triggerToast(t('toastFeedbackLogged'));
  };

  // Helper to map index game object to computed match list for right side UI
  const radarList = allGames
    .filter(g => !likedGames.some(l => l.id === g.id) && !dislikedIds.includes(g.id))
    .map(g => ({
      ...g,
      matchPercent: calculateMatchPercent(g)
    }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 4);

  return (
    <div id="smart-match-app" className="min-h-screen bg-[#0A0B10] text-slate-300 flex flex-col font-sans relative overflow-x-hidden antialiased">
      
      {/* Background Neon Spot Glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>

      {/* Success Status Toast Banners */}
      {successToast && (
        <div id="success-toast" className="fixed top-20 right-8 z-[100] bg-indigo-950 border border-indigo-500/30 text-indigo-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold tracking-wide">{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="ml-3 text-indigo-400 hover:text-white">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header Top Nav bar */}
      <nav id="top-navigation" className="h-16 flex items-center justify-between px-8 border-b border-slate-900 bg-[#0F111A] shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Logo container mimicking Sophisticated Dark Style */}
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <div className="w-4.5 h-4.5 bg-white rounded-sm rotate-45"></div>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white block leading-none">SMART MATCH</span>
            <span className="text-[9px] font-bold text-indigo-400/80 tracking-widest uppercase">
              {currentLang === 'EN' ? "Recommendation Engine" : currentLang === 'AZ' ? "Tövsiyə Modulu" : "Алгоритм Подбора"}
            </span>
          </div>
        </div>

        {/* Center Main Tab items */}
        {isAuthenticated && (
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/40">
            <button 
              id="nav-tab-discover"
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'discover' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {t('discover')}
            </button>
            
            <button 
              id="nav-tab-library"
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'library' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {t('library')}
              {likedGames.length > 0 && (
                <span className="bg-indigo-950 text-indigo-300 text-[10px] px-1.5 rounded-full font-black">
                  {likedGames.length}
                </span>
              )}
            </button>

            <button 
              id="nav-tab-feedback"
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'feedback' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {t('feedback')}
            </button>
          </div>
        )}

        {/* Right side Profile info */}
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleOpenEditProfile}
              id="edit-profile-trigger"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#0F111A] hover:bg-slate-800/60 transition-colors cursor-pointer group"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-bold text-slate-300">{t('tuneProfile')}</span>
            </button>

            {/* Profile Logout */}
            <button
              onClick={handleSignOut}
              title={t('logoutButton')}
              id="auth-logout"
              className="flex items-center justify-center p-2 rounded-lg border border-slate-800 bg-[#0F111A] hover:bg-red-950/20 hover:border-red-900/20 text-slate-400 hover:text-red-400 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-slate-800/80 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {profile.username ? profile.username.substring(0, 2).toUpperCase() : "AR"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none block">{profile.username}</span>
                <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">{t('gamingCore')}</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Container Viewport split */}
      {!isAuthenticated ? (
        <main id="auth-panel-container" className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0B0D15]/90 z-10 overflow-y-auto">
          <div className="w-full max-w-md bg-[#11131F] border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative space-y-6">
            
            {/* Title block */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-950/85 border border-indigo-500/25 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl">
                <Lock className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{t('authTitle')}</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{t('authSub')}</p>
            </div>

            {/* Simulated Auth Error */}
            {authError && (
              <div id="auth-error-banner" className="p-3 bg-red-950/30 border border-red-900/50 text-red-200 text-xs rounded-xl text-center font-semibold animate-pulse">
                {authError}
              </div>
            )}

            {/* Authentication Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/60">
              <button
                type="button"
                onClick={() => { setAuthTab('signin'); setAuthError(null); }}
                className={`flex-1 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t('signInTab')}
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('signup'); setAuthError(null); }}
                className={`flex-1 py-2 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t('signUpTab')}
              </button>
            </div>

            {/* Auth core Form bodies */}
            {authTab === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('usernameLabel')}</label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                    placeholder={t('usernamePlaceholder')}
                  />
                  <p className="text-[10px] text-slate-500 font-medium italic">
                    {currentLang === 'EN' ? "Tip: Log in as 'Alex Rivera' with password 'password' for default profile" : currentLang === 'AZ' ? "İpucu: 'Alex Rivera' (şifrə: 'password') yazaraq hazır profilə daxil olun" : "Совет: введите 'Alex Rivera' (пароль 'password') для входа с готовым профилем"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('passwordLabel')}</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                    placeholder={t('passwordPlaceholder')}
                  />
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    {t('loginButton')}
                  </button>

                  <button
                    type="button"
                    onClick={handleGuestSignIn}
                    className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-405 hover:text-indigo-400 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                  >
                    {t('guestButton')}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('usernameLabel')} *</label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                    placeholder="e.g. Neo-Gamer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('passwordLabel')} *</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                    placeholder={t('passwordPlaceholder')}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('genresLabel')}</label>
                  <input
                    type="text"
                    required
                    value={signUpGenres}
                    onChange={(e) => setSignUpGenres(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                    placeholder={t('genresPlaceholder')}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('playtimeLabel')}</label>
                  <select
                    value={signUpPlaytime}
                    onChange={(e) => setSignUpPlaytime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
                  >
                    <option value="1-2 hrs/day">{t('optionCasual')}</option>
                    <option value="2-4 hrs/day">{t('optionModerate')}</option>
                    <option value="4+ hrs/day">{t('optionDedicated')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('moodLabel')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Challenging", "Relaxing", "Story Rich", "Casual"].map(mode => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setSignUpMood(mode)}
                        className={`py-1.5 px-2 rounded-lg font-bold text-[10px] flex items-center justify-center border transition-all cursor-pointer ${
                          signUpMood === mode
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {getTranslatedMood(mode)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all shadow-lg cursor-pointer"
                  >
                    {t('signUpButton')}
                  </button>

                  <button
                    type="button"
                    onClick={handleGuestSignIn}
                    className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                  >
                    {t('guestButton')}
                  </button>
                </div>
              </form>
            )}

          </div>
        </main>
      ) : (
        <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT RAIL: User Profile Details + Match Filter selectors */}
        <aside id="left-sidebar" className="w-64 border-r border-slate-900 bg-[#0F111A]/40 p-6 flex flex-col gap-6 shrink-0 overflow-y-auto">
          
          {/* PROFILE SUMMARY */}
          <div className="bg-slate-900/20 rounded-xl p-4 border border-slate-800/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('yourProfile')}</h3>
              <button 
                onClick={handleOpenEditProfile}
                className="text-[10px] text-indigo-400 hover:underline font-bold"
              >
                {t('edit')}
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('preferredGenres')}</span>
                <span className="text-xs text-indigo-300 font-bold block mt-0.5">{profile.genres}</span>
              </div>
              <div className="h-[1px] bg-slate-900/60"></div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('availabilityTime')}</span>
                <span className="text-xs text-indigo-300 font-bold block mt-0.5">{getTranslatedPlaytime(profile.playtime)}</span>
              </div>
              <div className="h-[1px] bg-slate-900/60"></div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">{t('aestheticMood')}</span>
                <span className="text-xs text-indigo-200 font-bold block mt-0.5 flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-indigo-400" />
                  {getTranslatedMood(profile.mood)}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC MATCH FILTERS */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t('matchFilters')}</h3>
            
            {/* Interactive checkable badges */}
            <div className="flex flex-col gap-2.5">
              <button
                id="filter-pc-only"
                onClick={() => setFilters(p => ({ ...p, pcOnly: !p.pcOnly }))}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  filters.pcOnly 
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' 
                    : 'bg-[#121420]/30 border-slate-800/60 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Laptop className={`w-3.5 h-3.5 ${filters.pcOnly ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{t('pcOnlySupport')}</span>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${filters.pcOnly ? 'bg-indigo-600 text-white' : 'border border-slate-800'}`}>
                  {filters.pcOnly && "✓"}
                </div>
              </button>

              <button
                id="filter-multiplayer"
                onClick={() => setFilters(p => ({ ...p, multiplayer: !p.multiplayer }))}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  filters.multiplayer 
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' 
                    : 'bg-[#121420]/30 border-slate-800/60 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className={`w-3.5 h-3.5 ${filters.multiplayer ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{t('multiplayer')}</span>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${filters.multiplayer ? 'bg-indigo-600 text-white' : 'border border-slate-800'}`}>
                  {filters.multiplayer && "✓"}
                </div>
              </button>

              <button
                id="filter-story-driven"
                onClick={() => setFilters(p => ({ ...p, storyDriven: !p.storyDriven }))}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                  filters.storyDriven 
                    ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' 
                    : 'bg-[#121420]/30 border-slate-800/60 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-3.5 h-3.5 ${filters.storyDriven ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{t('storyDriven')}</span>
                </div>
                <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${filters.storyDriven ? 'bg-indigo-600 text-white' : 'border border-slate-800'}`}>
                  {filters.storyDriven && "✓"}
                </div>
              </button>
            </div>
          </div>

          {/* DYNAMIC METRIC STATEMENT BOX */}
          <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/10 space-y-2">
            <span className="text-[9px] font-black text-indigo-400 tracking-wider uppercase block">{t('engineAnalysis')}</span>
            <p className="text-xs text-indigo-200/80 leading-relaxed italic">
              "{t('engineAnalysisText').replace('{count}', String(allGames.length)).replace('{mood}', getTranslatedMood(profile.mood)).replace('{deckLength}', String(discoveryDeck.length))}"
            </p>
          </div>

        </aside>

        {/* CENTER VIEW: Conditional View Switcher */}
        <section id="center-viewport" className="flex-1 bg-[#0A0B10] p-8 flex flex-col items-center justify-center relative overflow-y-auto">
          
          {/* DISCOVER SWIPER VIEW */}
          {activeTab === 'discover' && (
            <div id="discover-panel" className="w-full h-full flex flex-col items-center justify-center">
              
              {activeGame ? (
                <div className="flex flex-col items-center">
                  
                  {/* Swiper Deck Card */}
                  <div 
                    id={`game-card-${activeGame.id}`}
                    className={`w-[420px] bg-[#161922] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform ${
                      swipeEffect === 'like' 
                        ? 'translate-x-[200px] rotate-[10deg] opacity-0 scale-95' 
                        : swipeEffect === 'dislike' 
                        ? '-translate-x-[200px] rotate-[-10deg] opacity-0 scale-95'
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    {/* Game Visual Image Header */}
                    <div className="h-[280px] bg-slate-950 relative group select-none">
                      
                      {/* Interactive Blur Glow Background with Vibe Color */}
                      <div className={`absolute inset-0 bg-gradient-to-tr ${activeGame.vibeColor} opacity-70`}></div>
                      
                      {/* Real Backdrop Stock Image */}
                      <img 
                        src={activeGame.imageUrl} 
                        alt={activeGame.title} 
                        className="w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none" 
                      />

                      {/* Dark Overlay Gradient to blend bottom text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161922] via-[#161922]/20 to-transparent"></div>
                      
                      {/* Game Header Details Overlay */}
                      <div className="absolute bottom-5 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded tracking-wider uppercase italic shadow-md">
                            {calculateMatchPercent(activeGame)}% {t('match')}
                          </div>
                          
                          {activeGame.id.startsWith("custom-") && (
                            <div className="px-2 py-1 bg-purple-950 text-purple-200 text-[9px] font-bold rounded tracking-wide border border-purple-500/30">
                              {t('proposedPitch')}
                            </div>
                          )}
                        </div>

                        <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md leading-tight uppercase">
                          {getGameField(activeGame, 'title')}
                        </h1>
                        <p className="text-xs text-slate-300 font-semibold mt-1">
                          {activeGame.developer} <span className="text-slate-500 mx-1.5">•</span> {getGameField(activeGame, 'genre')}
                        </p>
                      </div>

                      {/* Small Info Button Overlay */}
                      <div className="absolute top-4 right-4 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm self-start">
                        <span className="text-[10px] font-bold text-slate-400 capitalize px-1">{getGameField(activeGame, 'vibe')}</span>
                      </div>
                    </div>

                    {/* Game Metadata details */}
                    <div className="p-6 space-y-4">
                      
                      {/* Playtime values and vibe indicator */}
                      <div className="flex gap-4">
                        <div className="flex-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
                          <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">{t('estPlaytime')}</span>
                          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {getGameField(activeGame, 'playtimeValue')}
                          </span>
                        </div>
                        <div className="flex-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/40">
                          <span className="block text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">{t('coreVibe')}</span>
                          <span className="text-xs font-black italic text-indigo-300 uppercase mt-1 block">
                            {getGameField(activeGame, 'vibe')}
                          </span>
                        </div>
                      </div>

                      {/* WHY THIS FITS EXPLANATION BLOCK */}
                      <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 hover:bg-indigo-500/8 transition-colors">
                        <p className="text-xs leading-relaxed text-indigo-100/80">
                          <strong className="text-indigo-400 tracking-wider font-extrabold uppercase">{t('whyThisFits')}:</strong> {getGameField(activeGame, 'whyThisFits')}
                        </p>
                      </div>

                      {/* ACTION BUTTON FEEDBACK */}
                      <div className="flex gap-4 pt-1">
                        <button 
                          id="swipe-dislike-button"
                          onClick={() => handleDislike(activeGame.id)}
                          className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-red-400 hover:text-red-300 rounded-xl flex items-center justify-center gap-2 font-bold text-sm cursor-pointer transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
                          title="Skip this model"
                        >
                          <span className="text-lg">👎</span>
                          <span className="text-xs tracking-wider uppercase">{t('pass')}</span>
                        </button>
                        
                        <button 
                          id="swipe-like-button"
                          onClick={() => handleLike(activeGame.id)}
                          className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm cursor-pointer transition-all duration-200 shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
                          title="Lock in match connection!"
                        >
                          <span className="text-lg">👍</span>
                          <span className="text-xs tracking-wider uppercase text-white font-extrabold">{t('connect')}</span>
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Swipe tips helper */}
                  <div className="mt-5 flex items-center gap-5">
                    <button 
                      onClick={() => setIsCustomGameOpen(true)}
                      className="text-[10px] text-slate-500 hover:text-indigo-400 tracking-widest font-bold uppercase transition-colors"
                    >
                      {t('customPitchButton')}
                    </button>
                  </div>
                </div>
              ) : (
                /* EXHAUSTED EMPTY STATE */
                <div className="max-w-md text-center bg-[#161922] p-8 rounded-3xl border border-slate-800/80 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-indigo-950/80 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                    🪐
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">{t('vectorExhausted')}</h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t('exhaustedSub')}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleResetDeck}
                      className="flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold tracking-wider text-slate-200 uppercase rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      {t('reloadList')}
                    </button>
                    <button 
                      onClick={() => setIsCustomGameOpen(true)}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold tracking-wider text-white uppercase rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      {t('proposeCozy')}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* LIBRARY PANEL VIEW */}
          {activeTab === 'library' && (
            <div id="library-panel" className="w-full h-full max-w-4xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t('matchLibraryTitle')}</h2>
                  <p className="text-xs text-slate-400 mt-1">{t('librarySub')}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold">{t('totalSaves')}: {likedGames.length}</span>
                  {likedGames.length > 0 && (
                    <div className="flex items-center gap-2">
                      {confirmReset ? (
                        <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-500/20 px-2 py-1 rounded-xl animate-fade-in text-[10px]">
                          <span className="text-red-400 font-bold uppercase">{currentLang === 'AZ' ? "Əminsiniz?" : currentLang === 'RU' ? "Вы уверены?" : "Confirm Reset?"}</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setLikedGames([]);
                              setConfirmReset(false);
                              triggerToast(currentLang === 'AZ' ? "Kitabxana təmizləndi." : currentLang === 'RU' ? "Библиотека очищена." : "Library reset successfully.");
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded font-black cursor-pointer transition-colors"
                          >
                            {currentLang === 'AZ' ? "Bəli" : currentLang === 'RU' ? "Да" : "Yes"}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setConfirmReset(false)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                          >
                            {currentLang === 'AZ' ? "Xeyr" : currentLang === 'RU' ? "Нет" : "No"}
                          </button>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => setConfirmReset(true)}
                          className="text-xs text-red-400 hover:underline hover:text-red-300 font-bold cursor-pointer transition-all"
                        >
                          {t('resetLibrary')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {likedGames.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] pr-2">
                  {likedGames.map(like => {
                    // Match with game detail from Master Pool
                    const game = allGames.find(g => g.id === like.id);
                    if (!game) return null;

                    return (
                      <div 
                        key={like.id} 
                        id={`library-row-${like.id}`}
                        className="bg-[#121420] border border-slate-800 p-5 rounded-2xl flex md:flex-row flex-col gap-5 items-start justify-between hover:border-indigo-500/30 transition-all duration-300 group"
                      >
                        {/* Game Image and title profile block */}
                        <div className="flex gap-4 items-start flex-[1.5] min-w-[200px]">
                          <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-tr ${game.vibeColor} relative`}>
                            <img src={game.imageUrl} alt={getGameField(game, 'title')} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
                          </div>
                          
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-indigo-300 transition-colors uppercase">
                              {getGameField(game, 'title')}
                            </h3>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">{game.developer} • {getGameField(game, 'genre')}</p>
                            <span className="inline-block px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] text-slate-500 mt-2">
                              {t('likedOn')} {new Date(like.likedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Stars rating selector */}
                        <div className="space-y-2 select-none font-bold">
                          <span className="block text-[9px] text-slate-500 tracking-widest uppercase">{t('yourRating')}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(starIdx => (
                              <button
                                key={starIdx}
                                onClick={() => handleUpdateRating(like.id, starIdx)}
                                className="text-sm p-0.5"
                                title={`Rate ${starIdx}`}
                              >
                                <Star 
                                  className={`w-4 h-4 ${
                                    starIdx <= like.rating 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-slate-600 hover:text-slate-500'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Personal review commentary block */}
                        <div className="flex-1 min-w-[240px] space-y-2 w-full">
                          <span className="block text-[9px] text-slate-500 font-bold tracking-widest uppercase">{t('playthroughCritique')}</span>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={like.reviewText}
                              onChange={(e) => handleUpdateReviewText(like.id, e.target.value)}
                              placeholder={t('critiquePlaceholder')}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600 font-medium" 
                            />
                            <button
                              onClick={() => handleSaveReviewNote(like.id)}
                              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
                                like.noteSaved === false 
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {like.noteSaved === false ? t('save') : t('saved')}
                            </button>
                          </div>
                        </div>

                        {/* Disconnect and delete button */}
                        <button
                          onClick={() => handleRemoveLiked(like.id)}
                          className="p-2 self-center hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                          title="Erase Game from Matches"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* EMPTY STATE matches library */
                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#121420] border border-slate-800 rounded-3xl max-w-md mx-auto my-12">
                  <span className="text-4xl text-slate-600 block mb-3">🧩</span>
                  <h3 className="text-base font-bold text-slate-300">{t('libraryEmpty')}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    {t('libraryEmptyDesc')}
                  </p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="mt-6 px-4 py-2 bg-indigo-600 text-white font-bold text-xs tracking-wider rounded-lg hover:bg-indigo-500 transition-colors uppercase cursor-pointer"
                  >
                    {t('goToDiscover')}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK TAB VIEW */}
          {activeTab === 'feedback' && (
            <div id="feedback-panel" className="w-full h-full max-w-2xl flex flex-col justify-center">
              <div className="bg-[#121420] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">AI Engine Tuning Feedback</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Help us adjust weight metrics for the neural game recommendation engine! Any specific title or mechanic desires?
                  </p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">Rate Discovery Fit Quality</label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setFeedbackRating(val)}
                          className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                            feedbackRating === val 
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' 
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-25">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Desire Log / Comments</label>
                    <textarea 
                      rows={5}
                      value={currentFeedbackMessage}
                      onChange={(e) => setCurrentFeedbackMessage(e.target.value)}
                      placeholder="e.g. Elden Ring matches were perfect! I would love to see more obscure visual novel suggestions or classic retro tactics vectors in the deck."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-650"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-widest uppercase rounded-xl shadow-lg transition-all"
                  >
                    SUBMIT TO NEURAL MODEL RE-TRAINING
                  </button>
                </form>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/60 flex items-start gap-3">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Note: Feedback data directly weighs and updates semantic model profiles instantly across your next discovery deck turns!
                  </p>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* RIGHT RAIL: Quick Recommendations "ON THE RADAR" */}
        <aside id="right-sidebar" className="w-64 border-l border-slate-900/80 p-6 flex flex-col shrink-0 bg-[#0F111A]/40 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('onTheRadar')}</h3>
            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/20">
              {t('hotBadge')}
            </span>
          </div>

          {radarList.length > 0 ? (
            <div className="space-y-4">
              {radarList.map(game => (
                <div 
                  key={game.id} 
                  id={`radar-item-${game.id}`}
                  onClick={() => handleSelectGameDirect(game)}
                  className="flex gap-3.5 p-2 rounded-xl border border-transparent hover:border-slate-800 hover:bg-[#121420]/60 cursor-pointer transition-all duration-200 group"
                  title="Shift to active focus card"
                >
                  {/* Aspect mini icon with gradient backdrop */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr ${game.vibeColor} shrink-0 overflow-hidden relative border border-slate-800 shadow-md`}>
                    <img 
                      src={game.imageUrl} 
                      alt={getGameField(game, 'title')} 
                      className="w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform" 
                    />
                  </div>

                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate uppercase group-hover:text-indigo-400 transition-colors">
                      {getGameField(game, 'title')}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                      {getGameField(game, 'vibe')} <span className="text-slate-400">•</span> {game.matchPercent}% {currentLang === 'AZ' ? "Uyğunluq" : currentLang === 'RU' ? "Совпадение" : "Match"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-xs text-slate-500 font-bold">
                {currentLang === 'EN' ? "No candidate queues left." : currentLang === 'AZ' ? "Növbədə heç bir namizəd qalmadı." : "В очереди не осталось кандидатов."}
              </span>
            </div>
          )}

          <div className="mt-auto space-y-3">
            <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-800/40 text-[10px] text-slate-400 leading-relaxed text-center font-medium">
              {t('radarFooterText')}
            </div>
            
            <button 
              onClick={() => setIsCustomGameOpen(true)}
              className="w-full py-2.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold tracking-widest text-slate-300 uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('proposeNewPitch')}
            </button>
          </div>
        </aside>

      </main>
      )}

      {/* FOOTER: Status bar */}
      <footer id="footer-status" className="h-8 bg-[#0F111A] border-t border-slate-900 flex items-center justify-between px-6 shrink-0 z-10 select-none">
        
        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold">
          <span className="flex items-center gap-1.5 font-black uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
            {t('engineOnline')}
          </span>
          <span className="text-slate-600">|</span>
          <span>v2.4.0-STABLE</span>
          {customGames.length > 0 && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-purple-400/80">{customGames.length} {t('customDesignsIndexed')}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold">
          <span 
            onClick={() => {
              setCurrentLang('EN');
              triggerToast(TRANSLATIONS['EN'].toastLangSwitched);
            }} 
            className={`hover:text-indigo-400 cursor-pointer transition-colors px-1 ${currentLang === 'EN' ? 'text-indigo-400 font-black' : ''}`}
          >
            EN
          </span>
          <span>•</span>
          <span 
            onClick={() => {
              setCurrentLang('AZ');
              triggerToast(TRANSLATIONS['AZ'].toastLangSwitched);
            }} 
            className={`hover:text-indigo-400 cursor-pointer transition-colors px-1 ${currentLang === 'AZ' ? 'text-indigo-400 font-black' : ''}`}
          >
            AZ
          </span>
          <span>•</span>
          <span 
            onClick={() => {
              setCurrentLang('RU');
              triggerToast(TRANSLATIONS['RU'].toastLangSwitched);
            }} 
            className={`hover:text-indigo-400 cursor-pointer transition-colors px-1 ${currentLang === 'RU' ? 'text-indigo-400 font-black' : ''}`}
          >
            RU
          </span>
        </div>

      </footer>

      {/* MODAL 1: EDIT PROFILE PREFERENCES DIALOGUE */}
      {isEditProfileOpen && (
        <div id="modal-edit-profile" className="fixed inset-0 bg-[#07070b]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#161922] border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-wider">{t('editProfileTitle')}</h2>
              </div>
              
              <button 
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('usernameLabel')}</label>
                <input 
                  type="text"
                  required
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                  placeholder={t('usernamePlaceholder')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('preferredGenresLabel')}</label>
                <input 
                  type="text"
                  required
                  value={tempGenres}
                  onChange={(e) => setTempGenres(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                  placeholder={t('genresPlaceholder')}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('availabilityLabel')}</label>
                <select 
                  value={tempPlaytime}
                  onChange={(e) => setTempPlaytime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="1-2 hrs/day">{t('optionCasual')}</option>
                  <option value="2-4 hrs/day">{t('optionModerate')}</option>
                  <option value="4+ hrs/day">{t('optionDedicated')}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('aestheticMoodLabel')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Challenging", "Relaxing", "Story Rich", "Casual"].map(mode => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setTempMood(mode)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center border transition-all cursor-pointer ${
                        tempMood === mode 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {getTranslatedMood(mode)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                >
                  {t('saveProfileSettings')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM PROPOSAL / CONCEPT PITCH DIALOGUE */}
      {isCustomGameOpen && (
        <div id="modal-custom-game" className="fixed inset-0 bg-[#07070b]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#161922] border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-wider text-left">Pitch New Game Concept</h2>
              </div>
              
              <button 
                onClick={() => setIsCustomGameOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomProposal} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Game Title *</label>
                  <input 
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                    placeholder="e.g. NEST DEFENDER"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Developer Studio name</label>
                  <input 
                    type="text"
                    value={newDev}
                    onChange={(e) => setNewDev(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                    placeholder="e.g. Team Pixel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Category / Genre</label>
                  <input 
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                    placeholder="e.g. Tower Defense RPG"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Est. Playtime Length</label>
                  <input 
                    type="text"
                    value={newPlaytimeVal}
                    onChange={(e) => setNewPlaytimeVal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                    placeholder="e.g. 25-35 hrs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Core Aesthetic Vibe</label>
                <input 
                  type="text"
                  value={newVibe}
                  onChange={(e) => setNewVibe(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                  placeholder="e.g. Cozy Melancholy and Retro"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Special Custom Match Reason</label>
                <textarea 
                  rows={2}
                  value={newWhy}
                  onChange={(e) => setNewWhy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-indigo-500 outline-none" 
                  placeholder="How does this appeal to your specific profile interests?"
                ></textarea>
              </div>

              {/* Attributes Checklist toggles */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Target Filters Match Attributes</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newPlatformPC} 
                      onChange={(e) => setNewPlatformPC(e.target.checked)}
                      className="rounded accent-indigo-600 scale-105" 
                    />
                    <span>PC Supported</span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newMultiplayer} 
                      onChange={(e) => setNewMultiplayer(e.target.checked)}
                      className="rounded accent-indigo-600 scale-105" 
                    />
                    <span>Multiplayer ready</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newStoryDriven} 
                      onChange={(e) => setNewStoryDriven(e.target.checked)}
                      className="rounded accent-indigo-600 scale-105" 
                    />
                    <span>Story Driven Arc</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomGameOpen(false)}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black tracking-widest uppercase rounded-xl transition-all"
                >
                  INJECT PROPOSAL
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
