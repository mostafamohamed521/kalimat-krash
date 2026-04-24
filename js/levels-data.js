const WORD_SETS_M1 = [
    // --- مستوى 1: شمس ---
    {
        img: 'assets/images/levels/mode1.png',
        label: 'شمس',
        words: ['شمس', 'حرارة', 'ضوء'],
        grid: { rows: 4, cols: 3 }
    },
    // --- مستوى 2: عسل ---
    {
        img: 'assets/images/levels/honey.jpg',
        label: 'عسل',
        words: ['عسل', 'نحل', 'رحيق', 'حلو'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 3: شمسية ---
    {
        img: 'assets/images/levels/umbrella.jpg',
        label: 'شمسية',
        words: ['مظله', 'حر', 'شتاء', 'شمس', 'مطر'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 4: ثلج ---
    {
        img: 'assets/images/levels/ice.jpg',
        label: 'ثلج ذائب',
        words: ['ثلج', 'ماء', 'ذوبان', 'مكعب', 'بارد'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 5: شمس وقمر ---
    {
        img: 'assets/images/levels/sun_moon.jpg',
        label: 'شمس وقمر',
        words: ['شمس', 'يوم', 'ليل', 'قمر', 'نهار'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 6: تاج ---
    {
        img: 'assets/images/levels/crown.jpg',
        label: 'تاج',
        words: ['تاج', 'ذهب', 'ملك', 'مرصع', 'جواهر', 'حكم', 'راس'],
        grid: { rows: 4, cols: 6 }
    },
    // --- مستوى 7: فصول السنة ---
    {
        img: 'assets/images/levels/seasons.jpg',
        label: 'فصول',
        words: ['فصول', 'ربيع', 'خريف', 'صيف', 'شتاء', 'اربعه', 'سنه', 'طقس'],
        grid: { rows: 5, cols: 6 }
    },
    // --- مستوى 8: لمبة ---
    {
        img: 'assets/images/levels/bulb.jpg',
        label: 'مصباح',
        words: ['اديسون', 'فكرة', 'كهرباء', 'ضوء', 'مصباح'],
        grid: { rows: 4, cols: 6 }
    },
    // --- مستوى 9: أشكال هندسية ---
    {
        img: 'assets/images/levels/shapes.jpg',
        label: 'أشكال',
        words: ['مثلث', 'مربع', 'اشكال', 'هندسه', 'دائره', 'مستوية'],
        grid: { rows: 5, cols: 6 }
    },
    // --- مستوى 10: بحر ---
    {
        img: 'assets/images/levels/l2.jpg',
        label: 'بحر',
        words: ['بحر', 'موج', 'رمل', 'شاطئ'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 11: جبل ---
    {
        img: 'assets/images/levels/l3.jpg',
        label: 'جبل',
        words: ['جبل', 'ثلج', 'قمة', 'هواء'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 12: غابة ---
    {
        img: 'assets/images/levels/l4.jpg',
        label: 'غابة',
        words: ['غابة', 'شجرة', 'خضرة', 'حياة'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 13: مدينة ---
    {
        img: 'assets/images/levels/l5.jpg',
        label: 'مدينة',
        words: ['مدينة', 'برج', 'شارع', 'ناس'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 14: قطة ---
    {
        img: 'assets/images/levels/l6.jpg',
        label: 'قطة',
        words: ['قطة', 'فرو', 'مرمر', 'لعب'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 15: وردة ---
    {
        img: 'assets/images/levels/l8.jpg',
        label: 'وردة',
        words: ['وردة', 'عطر', 'بتلة', 'جمال'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 16: قمر ---
    {
        img: 'assets/images/levels/l10.jpg',
        label: 'قمر',
        words: ['قمر', 'ليل', 'نجوم', 'ظلام'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 17: طائرة ---
    {
        img: 'assets/images/levels/l11.jpg',
        label: 'طائرة',
        words: ['طائرة', 'سماء', 'رحلة', 'سفر'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 18: سيارة ---
    {
        img: 'assets/images/levels/l12.jpg',
        label: 'سيارة',
        words: ['سيارة', 'طريق', 'سرعة', 'وقود'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 19: كتاب ---
    {
        img: 'assets/images/levels/l13.jpg',
        label: 'كتاب',
        words: ['كتاب', 'قراءة', 'معرفة', 'علم'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 20: مطر ---
    {
        img: 'assets/images/levels/l14.jpg',
        label: 'مطر',
        words: ['مطر', 'سحاب', 'برق', 'رعد'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 21-50: استكمال ---
    { img: 'assets/images/levels/l15.jpg', label: 'نهر',      words: ['نهر','ماء','سمك','ضفة'],        grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l16.jpg', label: 'صحراء',    words: ['خيمة','صحراء','رمال','نخيل'],   grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l17.jpg', label: 'قارب',     words: ['قارب','بحيرة','مجداف','ماء'],   grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l18.jpg', label: 'عصفور',    words: ['عصفور','ريش','طيران','غناء'],   grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l1.jpg',  label: 'فراولة',   words: ['فراولة','حمراء','حلوة','حقل'],  grid:{rows:4,cols:5} },
    { img: 'assets/images/levels/l2.jpg',  label: 'برتقال',   words: ['برتقال','حامض','قشرة','عصير'],  grid:{rows:4,cols:5} },
    { img: 'assets/images/levels/l3.jpg',  label: 'واحة',     words: ['صحراء','واحة','نخيل','ماء'],    grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l4.jpg',  label: 'بركان',    words: ['بركان','حمم','دخان','نار'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l5.jpg',  label: 'أسد',      words: ['أسد','قوة','غابة','صيد'],       grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l6.jpg',  label: 'فيل',      words: ['فيل','خرطوم','ماء','ضخم'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l7.jpg',  label: 'دولفين',   words: ['دولفين','موج','ذكاء','بحر'],    grid:{rows:4,cols:5} },
    { img: 'assets/images/levels/l8.jpg',  label: 'نمر',      words: ['نمر','مخطط','سرعة','قفز'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l9.jpg',  label: 'ذئب',      words: ['ذئب','عواء','قطيع','برد'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l10.jpg', label: 'أرنب',     words: ['أرنب','قفز','حقل','جزر'],      grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l11.jpg', label: 'بيت',      words: ['بيت','باب','نافذة','سقف'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l12.jpg', label: 'مطبخ',     words: ['مطبخ','طبخ','وصفة','طعام'],    grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l13.jpg', label: 'حديقة',    words: ['حديقة','زهور','نباتات','ماء'],  grid:{rows:4,cols:5} },
    { img: 'assets/images/levels/l14.jpg', label: 'مسجد',     words: ['مسجد','أذان','صلاة','قبة'],    grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l15.jpg', label: 'ميناء',    words: ['ميناء','سفينة','مرساة','بحر'], grid:{rows:4,cols:5} },
    { img: 'assets/images/levels/l16.jpg', label: 'قلم',      words: ['قلم','كتابة','حبر','ورق'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l17.jpg', label: 'كمبيوتر',  words: ['كمبيوتر','شاشة','لوحة','برنامج'], grid:{rows:4,cols:6} },
    { img: 'assets/images/levels/l18.jpg', label: 'هاتف',     words: ['هاتف','صوت','اتصال','رسالة'], grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l19.jpg', label: 'ساعة',     words: ['ساعة','وقت','عقارب','ثانية'],  grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l20.jpg', label: 'نظارة',    words: ['نظارة','رؤية','عدسة','ضوء'],  grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l1.jpg',  label: 'حذاء',     words: ['حذاء','مشي','قدم','جلد'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l2.jpg',  label: 'قبعة',     words: ['قبعة','رأس','لبس','موضة'],    grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l3.jpg',  label: 'حقيبة',    words: ['حقيبة','سفر','أمتعة','جلد'],  grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l4.jpg',  label: 'مفتاح',    words: ['مفتاح','قفل','باب','سر'],     grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l5.jpg',  label: 'مرآة',     words: ['مرآة','وجه','انعكاس','نور'],  grid:{rows:4,cols:4} },
    { img: 'assets/images/levels/l6.jpg',  label: 'قلعة',     words: ['قلعة','أسوار','فارس','حرب'],  grid:{rows:4,cols:4} },
];

// ==================== MODE 2: Emojis → Proverbs ====================

const PROVERBS_M2 = [
    // --- مستوى 1: العقل زينة ---
    {
        emojis: ['🧠', '✨'],
        words: ['العقل', 'زينة'],
        grid: { rows: 3, cols: 3 }
    },
    // --- مستوى 2: القرد في عين أمه غزال ---
    {
        emojis: ['🐒', '👀', '👩', '🦌'],
        words: ['القرد', 'في', 'عين', 'امه', 'غزال'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 3: حبل الكذب قصير ---
    {
        emojis: ['🖊️', '🪢', '📏'],
        words: ['حبل', 'الكذب', 'قصير'],
        grid: { rows: 3, cols: 4 }
    },
    // --- مستوى 4: الحب أعمى ---
    {
        emojis: ['❤️', '🕶️'],
        words: ['الحب', 'اعمي'],
        grid: { rows: 3, cols: 3 }
    },
    // --- مستوى 5: الصديق وقت الضيق ---
    {
        emojis: ['👬', '⏰', '🚪'],
        words: ['الصديق', 'وقت', 'الضيق'],
        grid: { rows: 3, cols: 5 }
    },
    // --- مستوى 6: اطلب العلم ولو في الصين ---
    {
        emojis: ['✋', '📚', '🇨🇳'],
        words: ['اطلب', 'العلم', 'ولو', 'في', 'الصين'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 7: عصفورين بحجر واحد ---
    {
        emojis: ['🐦', '🐦', '🪨'],
        words: ['عصفورين', 'بحجر', 'واحد'],
        grid: { rows: 3, cols: 5 }
    },
    // --- مستوى 8: إيد وحدة ما تصفقش ---
    {
        emojis: ['🤚', '👏'],
        words: ['إيد', 'وحدة', 'ما', 'تصفقش'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 9: بعد المطر شمس ---
    {
        emojis: ['🌧️', '🌈', '☀️'],
        words: ['بعد', 'المطر', 'شمس'],
        grid: { rows: 3, cols: 4 }
    },
    // --- مستوى 10: الطير بكير يأكل الحب ---
    {
        emojis: ['🐦', '🌅', '🌾'],
        words: ['الطير', 'بكير', 'يأكل', 'الحب'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 11: ليل المؤمن نوره ---
    {
        emojis: ['🌙', '⭐', '💡'],
        words: ['ليل', 'المؤمن', 'نوره'],
        grid: { rows: 3, cols: 4 }
    },
    // --- مستوى 12: الشجرة من غرسها صغيرة ---
    {
        emojis: ['🌱', '🌳', '⏳'],
        words: ['الشجرة', 'من', 'غرسها', 'صغيرة'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 13: البحر واسع والغريق ---
    {
        emojis: ['🌊', '🏖️', '🐚'],
        words: ['البحر', 'واسع', 'والغريق'],
        grid: { rows: 3, cols: 5 }
    },
    // --- مستوى 14: إيد لحمها ما تتأكلش ---
    {
        emojis: ['🤚', '🧅', '💧'],
        words: ['إيد', 'لحمها', 'ما', 'تتأكلش'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 15: الهلال ما يكملش بليلة ---
    {
        emojis: ['🌛', '🌙', '⭐'],
        words: ['الهلال', 'ما', 'يكملش', 'بليلة'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 16: بيتك أحسن من قصور ---
    {
        emojis: ['🏠', '🏰', '🌍'],
        words: ['بيتك', 'أحسن', 'من', 'قصور'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 17: الأسد في غابته ملك ---
    {
        emojis: ['🦁', '🌿', '👑'],
        words: ['الأسد', 'في', 'غابته', 'ملك'],
        grid: { rows: 4, cols: 4 }
    },
    // --- مستوى 18: ذباب العسل يدوق ---
    {
        emojis: ['🍯', '🪰', '😋'],
        words: ['ذباب', 'العسل', 'يدوق'],
        grid: { rows: 3, cols: 4 }
    },
    // --- مستوى 19: الزهرة ما بتعطيش لكل نحلة ---
    {
        emojis: ['🌺', '🐝', '🍯'],
        words: ['الزهرة', 'ما', 'بتعطيش', 'لكل', 'نحلة'],
        grid: { rows: 4, cols: 5 }
    },
    // --- مستوى 20: السمكة تعوم في المية ---
    {
        emojis: ['🐟', '💧', '🌊'],
        words: ['السمكة', 'تعوم', 'في', 'المية'],
        grid: { rows: 4, cols: 4 }
    },
];

// ==================== MODE 3: Multi-Image Word-Search ====================
const MULTI_SETS_M3 = [
    // --- مستوى 1: حيوانات الغابة (8 حيوانات) ---
    {
        title: 'حيوانات الغابة',
        images: ['🐿️','🐊','🐘','🦁','🦌','🦔','🐻','🐨'],
        words: ['سنجاب','تمساح','فيل','أسد','غزال','قنفذ','دب','كوالا'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 2: أشكال هندسية (10 أشكال) ---
    {
        title: 'أشكال هندسية',
        images: ['⭕','🔺','🟦','🔷','🔶','⬡','🔻','⬜','🔹','🔸'],
        words: ['دائرة','مثلث','مربع','معين','متوازي','سداسي','هرم','مستطيل','مضلع','شكل'],
        gridSize: { rows: 7, cols: 8 }
    },
    // --- مستوى 3: أعلام دول عربية (9 دول) ---
    {
        title: 'دول عربية',
        images: ['🇪🇬','🇸🇦','🇶🇦','🇲🇦','🇮🇶','🇩🇿','🇱🇧','🇯🇴','🇹🇳'],
        words: ['مصر','السعودية','قطر','المغرب','العراق','الجزائر','لبنان','الأردن','تونس'],
        gridSize: { rows: 7, cols: 8 }
    },
    // --- مستوى 4: حشرات (9 حشرات) ---
    {
        title: 'حشرات',
        images: ['🐝','🦋','🐛','🐜','🦗','🪲','🦟','🪳','🐞'],
        words: ['نحلة','فراشة','دودة','نملة','جرادة','خنفساء','بعوضة','صرصار','دعسوقة'],
        gridSize: { rows: 7, cols: 8 }
    },
    // --- مستوى 5: مشاعر (9 مشاعر) ---
    {
        title: 'مشاعر',
        images: ['😡','😀','😂','😢','😱','😍','🤔','😴','😎'],
        words: ['غضب','سعادة','ضحك','حزن','خوف','حب','تفكير','نوم','برود'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 6: فواكه (7 فواكه) ---
    {
        title: 'فواكه',
        images: ['🍉','🍊','🍌','🍎','🥕','🍇','🍎'],
        words: ['بطيخ','برتقال','موز','تفاح','جزر','عنب','رمان'],
        gridSize: { rows: 6, cols: 6 }
    },
    // --- مستوى 7: رياضة (8 رياضات) ---
    {
        title: 'رياضة',
        images: ['⚽','🏀','🎾','🏊','🚴','🥊','🏋️','🤸'],
        words: ['كرة','سلة','تنس','سباحة','دراجة','ملاكمة','أثقال','جمباز'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 8: مهن (8 مهن) ---
    {
        title: 'مهن',
        images: ['👨‍⚕️','👨‍🏫','👨‍🍳','👨‍🔧','👨‍💻','👮','🧑‍🚒','👨‍✈️'],
        words: ['طبيب','معلم','طباخ','ميكانيكي','مبرمج','شرطي','إطفائي','طيار'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 9: الطقس (8 أحوال) ---
    {
        title: 'الطقس',
        images: ['☀️','🌧️','❄️','⚡','🌈','🌪️','🌫️','🌊'],
        words: ['مشمس','مطر','ثلج','عاصفة','قوس','إعصار','ضباب','موج'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 10: وسائل نقل (8 وسائل) ---
    {
        title: 'وسائل النقل',
        images: ['🚗','🚌','🚂','✈️','🚢','🏍️','🚁','🚀'],
        words: ['سيارة','حافلة','قطار','طائرة','سفينة','دراجة','مروحية','صاروخ'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 11: أدوات المدرسة (8 أدوات) ---
    {
        title: 'أدوات المدرسة',
        images: ['📚','✏️','📐','📏','✂️','🖊️','📓','🖍️'],
        words: ['كتاب','قلم','مثلثة','مسطرة','مقص','قلم حبر','دفتر','تلوين'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 12: الطعام (8 أطعمة) ---
    {
        title: 'الطعام',
        images: ['🍕','🍔','🌮','🍜','🍣','🧆','🥗','🍱'],
        words: ['بيتزا','برجر','تاكو','نودلز','سوشي','فلافل','سلطة','بنتو'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 13: أعضاء الجسم (8 أعضاء) ---
    {
        title: 'أعضاء الجسم',
        images: ['👁️','👂','👃','🦷','💪','🦵','🤚','❤️'],
        words: ['عين','أذن','أنف','سنة','عضلة','ساق','يد','قلب'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 14: ملابس (8 ملابس) ---
    {
        title: 'الملابس',
        images: ['👕','👖','👗','👔','🧥','👟','🧤','🧢'],
        words: ['قميص','بنطلون','فستان','بدلة','معطف','حذاء','قفاز','قبعة'],
        gridSize: { rows: 6, cols: 7 }
    },
    // --- مستوى 15: ألوان (8 ألوان) ---
    {
        title: 'الألوان',
        images: ['🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪'],
        words: ['أحمر','برتقالي','أصفر','أخضر','أزرق','بنفسجي','أسود','أبيض'],
        gridSize: { rows: 6, cols: 7 }
    },
];


const CROSSWORD_DATA_M4 = [
  {
    words: [
        { word: 'ملح', clue: '🧂', row: 0, col: 0, dir: 'h' },
        { word: 'مصيده', clue: '🪤', row: 0, col: 0, dir: 'v' },
        { word: 'حلاق', clue: '💈', row: 0, col: 2, dir: 'v' },
        { word: 'سندريلا', clue: '👠', row: 2, col: 0, dir: 'h' },
        { word: 'بساط', clue: '🪄', row: 1, col: 1, dir: 'v' },
        { word: 'مدرب', clue: '🏋️', row: 1, col: 3, dir: 'v' },
        { word: 'طابعه', clue: '🖨️', row: 5, col: 0, dir: 'h' },
    ],
    rows: 7,
    cols: 8
},
    // --- مستوى 2 ---
    {
        words: [
            { word: 'تفاح',   clue: '🍎', row: 0, col: 0, dir: 'h' },
            { word: 'تمر',    clue: '🌴', row: 0, col: 0, dir: 'v' },
            { word: 'حليب',   clue: '🥛', row: 2, col: 0, dir: 'h' },
            { word: 'لحم',    clue: '🥩', row: 0, col: 2, dir: 'v' },
            { word: 'خبز',    clue: '🍞', row: 3, col: 1, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 3 ---
    {
        words: [
            { word: 'شمس',   clue: '☀️', row: 0, col: 0, dir: 'h' },
            { word: 'سحاب',  clue: '☁️', row: 0, col: 2, dir: 'v' },
            { word: 'مطر',   clue: '🌧️', row: 2, col: 0, dir: 'h' },
            { word: 'ثلج',   clue: '❄️', row: 0, col: 0, dir: 'v' },
            { word: 'ريح',   clue: '💨', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 4 ---
    {
        words: [
            { word: 'قلم',    clue: '✏️', row: 0, col: 0, dir: 'h' },
            { word: 'ورقة',   clue: '📄', row: 0, col: 2, dir: 'v' },
            { word: 'كتاب',   clue: '📚', row: 2, col: 0, dir: 'h' },
            { word: 'قراءة',  clue: '📖', row: 0, col: 0, dir: 'v' },
            { word: 'مدرسة',  clue: '🏫', row: 4, col: 0, dir: 'h' },
        ],
        rows: 6, cols: 6
    },
    // --- مستوى 5 ---
    {
        words: [
            { word: 'أسد',   clue: '🦁', row: 0, col: 0, dir: 'h' },
            { word: 'أرنب',  clue: '🐰', row: 0, col: 0, dir: 'v' },
            { word: 'دب',    clue: '🐻', row: 2, col: 0, dir: 'h' },
            { word: 'نمر',   clue: '🐯', row: 0, col: 2, dir: 'v' },
            { word: 'فيل',   clue: '🐘', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 6 ---
    {
        words: [
            { word: 'طبيب',  clue: '👨‍⚕️', row: 0, col: 0, dir: 'h' },
            { word: 'طيار',  clue: '👨‍✈️', row: 0, col: 0, dir: 'v' },
            { word: 'باب',   clue: '🚪', row: 2, col: 0, dir: 'h' },
            { word: 'معلم',  clue: '👨‍🏫', row: 0, col: 3, dir: 'v' },
            { word: 'بنت',   clue: '👧', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 7 ---
    {
        words: [
            { word: 'قهوة',  clue: '☕', row: 0, col: 0, dir: 'h' },
            { word: 'قمر',   clue: '🌙', row: 0, col: 0, dir: 'v' },
            { word: 'هواء',  clue: '💨', row: 2, col: 0, dir: 'h' },
            { word: 'وردة',  clue: '🌹', row: 0, col: 3, dir: 'v' },
            { word: 'عسل',   clue: '🍯', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 8 ---
    {
        words: [
            { word: 'سيارة', clue: '🚗', row: 0, col: 0, dir: 'h' },
            { word: 'سفينة', clue: '🚢', row: 0, col: 0, dir: 'v' },
            { word: 'طريق',  clue: '🛣️', row: 3, col: 0, dir: 'h' },
            { word: 'فينة',  clue: '🚤', row: 0, col: 3, dir: 'v' },
            { word: 'قطار',  clue: '🚂', row: 5, col: 0, dir: 'h' },
        ],
        rows: 6, cols: 6
    },
    // --- مستوى 9 ---
    {
        words: [
            { word: 'مصر',   clue: '🇪🇬', row: 0, col: 0, dir: 'h' },
            { word: 'نيل',   clue: '🌊', row: 0, col: 1, dir: 'v' },
            { word: 'صحراء', clue: '🏜️', row: 2, col: 0, dir: 'h' },
            { word: 'أهرام', clue: '🏛️', row: 0, col: 0, dir: 'v' },
            { word: 'قاهرة', clue: '🏙️', row: 4, col: 0, dir: 'h' },
        ],
        rows: 6, cols: 6
    },
    // --- مستوى 10 ---
    {
        words: [
            { word: 'فضاء',  clue: '🌌', row: 0, col: 0, dir: 'h' },
            { word: 'فلك',   clue: '🌙', row: 0, col: 0, dir: 'v' },
            { word: 'ضوء',   clue: '💡', row: 2, col: 0, dir: 'h' },
            { word: 'كوكب',  clue: '🪐', row: 0, col: 3, dir: 'v' },
            { word: 'نجوم',  clue: '⭐', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 11 ---
    {
        words: [
            { word: 'رياضة', clue: '⚽', row: 0, col: 0, dir: 'h' },
            { word: 'ركض',   clue: '🏃', row: 0, col: 0, dir: 'v' },
            { word: 'ضرب',   clue: '🥊', row: 2, col: 0, dir: 'h' },
            { word: 'يرمي',  clue: '🎯', row: 0, col: 4, dir: 'v' },
            { word: 'بطل',   clue: '🏆', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 6
    },
    // --- مستوى 12 ---
    {
        words: [
            { word: 'موسيقى',clue: '🎵', row: 0, col: 0, dir: 'h' },
            { word: 'مغني',  clue: '🎤', row: 0, col: 0, dir: 'v' },
            { word: 'غناء',  clue: '🎶', row: 3, col: 0, dir: 'h' },
            { word: 'يعزف',  clue: '🎸', row: 0, col: 4, dir: 'v' },
            { word: 'فرقة',  clue: '🎼', row: 5, col: 0, dir: 'h' },
        ],
        rows: 6, cols: 6
    },
    // --- مستوى 13 ---
    {
        words: [
            { word: 'طعام',  clue: '🍽️', row: 0, col: 0, dir: 'h' },
            { word: 'طبخ',   clue: '🍳', row: 0, col: 0, dir: 'v' },
            { word: 'خبز',   clue: '🍞', row: 2, col: 0, dir: 'h' },
            { word: 'بيتزا', clue: '🍕', row: 0, col: 3, dir: 'v' },
            { word: 'زيت',   clue: '🫙', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 5
    },
    // --- مستوى 14 ---
    {
        words: [
            { word: 'حديقة', clue: '🌳', row: 0, col: 0, dir: 'h' },
            { word: 'هواء',  clue: '💨', row: 0, col: 3, dir: 'v' },
            { word: 'قطة',   clue: '🐈', row: 2, col: 0, dir: 'h' },
            { word: 'حياة',  clue: '🌱', row: 0, col: 0, dir: 'v' },
            { word: 'طفل',   clue: '👶', row: 4, col: 0, dir: 'h' },
        ],
        rows: 5, cols: 6
    },
    // --- مستوى 15 ---
    {
        words: [
            { word: 'مدرسة', clue: '🏫', row: 0, col: 0, dir: 'h' },
            { word: 'معلم',  clue: '👨‍🏫', row: 0, col: 4, dir: 'v' },
            { word: 'درس',   clue: '📝', row: 2, col: 0, dir: 'h' },
            { word: 'مرسم',  clue: '🎨', row: 0, col: 0, dir: 'v' },
            { word: 'سبورة', clue: '🖊️', row: 4, col: 0, dir: 'h' },
        ],
        rows: 6, cols: 6
    },
];


function buildExactGrid(words, rows, cols) {
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    const placed = new Set();

    const DIRS = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];

    for (const word of words) {
        let wordPlaced = false;
        for (let attempt = 0; attempt < 300 && !wordPlaced; attempt++) {
            const sr = Math.floor(Math.random() * rows);
            const sc = Math.floor(Math.random() * cols);
            if (placed.has(`${sr},${sc}`)) continue;

            const path = [{ r: sr, c: sc }];
            const visited = new Set([`${sr},${sc}`]);

            const dfs = depth => {
                if (depth === word.length) return true;
                const { r, c } = path[path.length - 1];
                const shuffled = DIRS.slice().sort(() => Math.random() - 0.5);
                for (const [dr, dc] of shuffled) {
                    const nr = r + dr, nc = c + dc;
                    const key = `${nr},${nc}`;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                    if (visited.has(key) || placed.has(key)) continue;
                    path.push({ r: nr, c: nc });
                    visited.add(key);
                    if (dfs(depth + 1)) return true;
                    path.pop();
                    visited.delete(key);
                }
                return false;
            };

            if (dfs(1)) {
                path.forEach((pos, i) => {
                    grid[pos.r][pos.c] = word[i];
                    placed.add(`${pos.r},${pos.c}`);
                });
                wordPlaced = true;
            }
        }
    }

    return grid;
}

// ==================== LEVEL GENERATION ====================

function buildLevelList() {
    const pool = [];
    for (let i = 0; i < 46; i++) pool.push(1);
    for (let i = 0; i < 16; i++) pool.push(2);
    for (let i = 0; i < 14; i++) pool.push(3);
    for (let i = 0; i < 14; i++) pool.push(4);

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const allModes = [1, 2, 3, 4, ...pool]; // 100 مستوى

    const counters = { 1: 0, 2: 0, 3: 0, 4: 0 };

    return allModes.map((mode, i) => {
        const id = i + 1;
        const idx = counters[mode]++;
        let data = {};

        if (mode === 1) {
            const d = WORD_SETS_M1[idx % WORD_SETS_M1.length];
            data = {
                image: d.img,
                label: d.label || '',
                words: d.words,
                gridRows: d.grid.rows,
                gridCols: d.grid.cols,
                exactGrid: true  // علامة إن الجريد بحروف بس
            };
        } else if (mode === 2) {
            const d = PROVERBS_M2[idx % PROVERBS_M2.length];
            data = {
                emojis: d.emojis,
                words: d.words,
                gridRows: d.grid.rows,
                gridCols: d.grid.cols,
                exactGrid: true
            };
        } else if (mode === 3) {
            const d = MULTI_SETS_M3[idx % MULTI_SETS_M3.length];
            data = { title: d.title, images: d.images, words: d.words, gridSize: d.gridSize };
        } else {
            const d = CROSSWORD_DATA_M4[idx % CROSSWORD_DATA_M4.length];
            data = { crosswordWords: d.words, gridRows: d.rows, gridCols: d.cols };
        }

        return { id, mode, data };
    });
}

// Cache
let _cachedLevels = null;

function getAllLevels() {
    if (_cachedLevels) return _cachedLevels;

    const levels = buildLevelList();

    const saved = localStorage.getItem('kc_unlocked');
    const unlocked = saved ? JSON.parse(saved) : new Array(100).fill(false);
    if (!saved) { unlocked[0] = true; saveUnlocked(unlocked); }

    _cachedLevels = levels.map((l, i) => ({ ...l, unlocked: !!unlocked[i] }));
    return _cachedLevels;
}

function saveUnlocked(arr) {
    localStorage.setItem('kc_unlocked', JSON.stringify(arr));
}

function unlockNextLevel(currentId) {
    const unlocked = JSON.parse(localStorage.getItem('kc_unlocked') || '[]') || new Array(100).fill(false);
    if (currentId < 100) {
        unlocked[currentId] = true;
        saveUnlocked(unlocked);
        if (_cachedLevels) _cachedLevels[currentId].unlocked = true;
    }
}

function saveCoins(amount) { localStorage.setItem('kc_coins', amount); }
function loadCoins() { return parseInt(localStorage.getItem('kc_coins') || '100'); }