// ==================== MODE 1: صورة + كلمات ====================
const WORD_SETS_M1 = [
    { img:'assets/images/levels/mode1.png', label:'شمس',       words:['شمس','حرارة','ضوء'] },
    { img:'assets/images/levels/honey.webp', label:'عسل',       words:['عسل','نحل','رحيق','حلو'] },
    { img:'assets/images/levels/ump.png', label:'شمسية',  words:['مظله','حر','شتاء','شمس','مطر'] },
    { img:'assets/images/levels/ice.jpg',   label:'ثلج ذائب',  words:['ثلج','ماء','ذوبان','مكعب','بارد'] },
    { img:'assets/images/levels/sun_moon.jpg', label:'شمس وقمر', words:['شمس','يوم','ليل','قمر','نهار'] },
    { img:'assets/images/levels/crown.jpg', label:'تاج',       words:['تاج','ذهب','ملك','جواهر','حكم'] },
    { img:'assets/images/levels/seasons.jpg', label:'فصول',    words:['ربيع','خريف','صيف','شتاء','طقس'] },
    { img:'assets/images/levels/bulb.jpg',  label:'مصباح',     words:['كهرباء','ضوء','مصباح','فكرة'] },
    { img:'assets/images/levels/shapes.jpg', label:'أشكال',    words:['مثلث','مربع','دائره','هندسه'] },
    { img:'assets/images/levels/l2.jpg',    label:'بحر',       words:['بحر','موج','رمل','شاطئ'] },
    { img:'assets/images/levels/l3.jpg',    label:'جبل',       words:['جبل','ثلج','قمة','هواء'] },
    { img:'assets/images/levels/l4.jpg',    label:'غابة',      words:['غابة','شجرة','خضرة','حياة'] },
    { img:'assets/images/levels/l5.jpg',    label:'مدينة',     words:['مدينة','برج','شارع','ناس'] },
    { img:'assets/images/levels/l6.jpg',    label:'قطة',       words:['قطة','فرو','لعب','مواء'] },
    { img:'assets/images/levels/l8.jpg',    label:'وردة',      words:['وردة','عطر','بتلة','جمال'] },
    { img:'assets/images/levels/l10.jpg',   label:'قمر',       words:['قمر','ليل','نجوم','ظلام'] },
    { img:'assets/images/levels/l11.jpg',   label:'طائرة',     words:['طائرة','سماء','رحلة','سفر'] },
    { img:'assets/images/levels/l12.jpg',   label:'سيارة',     words:['سيارة','طريق','سرعة','وقود'] },
    { img:'assets/images/levels/l13.jpg',   label:'كتاب',      words:['كتاب','قراءة','معرفة','علم'] },
    { img:'assets/images/levels/l14.jpg',   label:'مطر',       words:['مطر','سحاب','برق','رعد'] },
    { img:'assets/images/levels/l15.jpg',   label:'نهر',       words:['نهر','ماء','سمك','ضفة'] },
    { img:'assets/images/levels/l16.jpg',   label:'صحراء',     words:['خيمة','صحراء','رمال','نخيل'] },
    { img:'assets/images/levels/l17.jpg',   label:'قارب',      words:['قارب','بحيرة','مجداف','ماء'] },
    { img:'assets/images/levels/l18.jpg',   label:'عصفور',     words:['عصفور','ريش','طيران','غناء'] },
    { img:'assets/images/levels/l1.jpg',    label:'فراولة',    words:['فراولة','حمراء','حلوة','حقل'] },
    { img:'assets/images/levels/l2.jpg',    label:'برتقال',    words:['برتقال','حامض','قشرة','عصير'] },
    { img:'assets/images/levels/l3.jpg',    label:'واحة',      words:['صحراء','واحة','نخيل','ماء'] },
    { img:'assets/images/levels/l4.jpg',    label:'بركان',     words:['بركان','حمم','دخان','نار'] },
    { img:'assets/images/levels/l5.jpg',    label:'أسد',       words:['أسد','قوة','غابة','صيد'] },
    { img:'assets/images/levels/l6.jpg',    label:'فيل',       words:['فيل','خرطوم','ماء','ضخم'] },
    { img:'assets/images/levels/l7.jpg',    label:'دولفين',    words:['دولفين','موج','ذكاء','بحر'] },
    { img:'assets/images/levels/l8.jpg',    label:'نمر',       words:['نمر','مخطط','سرعة','قفز'] },
    { img:'assets/images/levels/l9.jpg',    label:'ذئب',       words:['ذئب','عواء','قطيع','برد'] },
    { img:'assets/images/levels/l10.jpg',   label:'أرنب',      words:['أرنب','قفز','حقل','جزر'] },
    { img:'assets/images/levels/l11.jpg',   label:'بيت',       words:['بيت','باب','نافذة','سقف'] },
    { img:'assets/images/levels/l12.jpg',   label:'مطبخ',      words:['مطبخ','طبخ','وصفة','طعام'] },
    { img:'assets/images/levels/l13.jpg',   label:'حديقة',     words:['حديقة','زهور','نباتات','ماء'] },
    { img:'assets/images/levels/l14.jpg',   label:'مسجد',      words:['مسجد','أذان','صلاة','قبة'] },
    { img:'assets/images/levels/l15.jpg',   label:'ميناء',     words:['ميناء','سفينة','مرساة','بحر'] },
    { img:'assets/images/levels/l16.jpg',   label:'قلم',       words:['قلم','كتابة','حبر','ورق'] },
    { img:'assets/images/levels/l17.jpg',   label:'كمبيوتر',   words:['شاشة','لوحة','برنامج','بيانات'] },
    { img:'assets/images/levels/l18.jpg',   label:'هاتف',      words:['هاتف','صوت','اتصال','رسالة'] },
    { img:'assets/images/levels/l19.jpg',   label:'ساعة',      words:['ساعة','وقت','عقارب','ثانية'] },
    { img:'assets/images/levels/l20.jpg',   label:'نظارة',     words:['نظارة','رؤية','عدسة','ضوء'] },
    { img:'assets/images/levels/l1.jpg',    label:'حذاء',      words:['حذاء','مشي','قدم','جلد'] },
    { img:'assets/images/levels/l2.jpg',    label:'قبعة',      words:['قبعة','رأس','لبس','موضة'] },
    { img:'assets/images/levels/l3.jpg',    label:'حقيبة',     words:['حقيبة','سفر','أمتعة','جلد'] },
    { img:'assets/images/levels/l4.jpg',    label:'مفتاح',     words:['مفتاح','قفل','باب','سر'] },
    { img:'assets/images/levels/l5.jpg',    label:'مرآة',      words:['مرآة','وجه','انعكاس','نور'] },
    { img:'assets/images/levels/l6.jpg',    label:'قلعة',      words:['قلعة','أسوار','فارس','حرب'] },
    { img:'assets/images/levels/l7.jpg',    label:'شاطئ',      words:['شاطئ','رمال','صدف','نخيل'] },
];

// ==================== MODE 2: أمثال مصرية ====================
const PROVERBS_M2 = [
    { emojis:['🧠','✨'],          words:['العقل','زينة'] },
    { emojis:['🐒','👀','👩','🦌'], words:['القرد','في','عين','امه','غزال'] },
    { emojis:['🖊️','🪢','📏'],     words:['حبل','الكذب','قصير'] },
    { emojis:['❤️','🕶️'],          words:['الحب','اعمي'] },
    { emojis:['👬','⏰','🚪'],      words:['الصديق','وقت','الضيق'] },
    { emojis:['✋','📚','🇨🇳'],     words:['اطلب','العلم','ولو','في','الصين'] },
    { emojis:['🐦','🐦','🪨'],      words:['عصفورين','بحجر','واحد'] },
    { emojis:['🤚','👏'],           words:['إيد','وحدة','ما','تصفقش'] },
    { emojis:['🌧️','🌈','☀️'],     words:['بعد','المطر','شمس'] },
    { emojis:['🐦','🌅','🌾'],      words:['الطير','بكير','يأكل','الحب'] },
    { emojis:['🌙','⭐','💡'],      words:['ليل','المؤمن','نوره'] },
    { emojis:['🌱','🌳','⏳'],      words:['الشجرة','من','غرسها','صغيرة'] },
    { emojis:['🌊','🏖️','🐚'],     words:['البحر','واسع','والغريق'] },
    { emojis:['🤚','🧅','💧'],      words:['إيد','لحمها','ما','تتأكلش'] },
    { emojis:['🌛','🌙','⭐'],      words:['الهلال','ما','يكملش','بليلة'] },
    { emojis:['🏠','🏰','🌍'],      words:['بيتك','أحسن','من','قصور'] },
    { emojis:['🦁','🌿','👑'],      words:['الأسد','في','غابته','ملك'] },
    { emojis:['🍯','🪰','😋'],      words:['ذباب','العسل','يدوق'] },
    { emojis:['🌺','🐝','🍯'],      words:['الزهرة','ما','بتعطيش','لكل','نحلة'] },
    { emojis:['🐟','💧','🌊'],      words:['السمكة','تعوم','في','المية'] },
];

// ==================== MODE 3: صور متعددة ====================
const MULTI_SETS_M3 = [
    { title:'حيوانات الغابة', images:['🐿️','🐊','🐘','🦁','🦌','🦔','🐻','🐨'], words:['سنجاب','تمساح','فيل','أسد','غزال','قنفذ','دب','كوالا'], gridSize:{rows:6,cols:7} },
    { title:'أشكال هندسية',   images:['⭕','🔺','🟦','🔷','🔶','⬡','🔻','⬜','🔹','🔸'], words:['دائرة','مثلث','مربع','معين','متوازي','سداسي','هرم','مستطيل','مضلع','شكل'], gridSize:{rows:7,cols:8} },
    { title:'دول عربية',      images:['🇪🇬','🇸🇦','🇶🇦','🇲🇦','🇮🇶','🇩🇿','🇱🇧','🇯🇴','🇹🇳'], words:['مصر','السعودية','قطر','المغرب','العراق','الجزائر','لبنان','الأردن','تونس'], gridSize:{rows:7,cols:8} },
    { title:'حشرات',          images:['🐝','🦋','🐛','🐜','🦗','🪲','🦟','🪳','🐞'], words:['نحلة','فراشة','دودة','نملة','جرادة','خنفساء','بعوضة','صرصار','دعسوقة'], gridSize:{rows:7,cols:8} },
    { title:'مشاعر',          images:['😡','😀','😂','😢','😱','😍','🤔','😴','😎'], words:['غضب','سعادة','ضحك','حزن','خوف','حب','تفكير','نوم','برود'], gridSize:{rows:6,cols:7} },
    { title:'فواكه',          images:['🍉','🍊','🍌','🍎','🥝','🍇','🍑'], words:['بطيخ','برتقال','موز','تفاح','كيوي','عنب','خوخ'], gridSize:{rows:6,cols:6} },
    { title:'رياضة',          images:['⚽','🏀','🎾','🏊','🚴','🥊','🏋️','🤸'], words:['كرة','سلة','تنس','سباحة','دراجة','ملاكمة','أثقال','جمباز'], gridSize:{rows:6,cols:7} },
    { title:'مهن',            images:['👨‍⚕️','👨‍🏫','👨‍🍳','👨‍🔧','👨‍💻','👮','🧑‍🚒','👨‍✈️'], words:['طبيب','معلم','طباخ','ميكانيكي','مبرمج','شرطي','إطفائي','طيار'], gridSize:{rows:6,cols:7} },
    { title:'الطقس',          images:['☀️','🌧️','❄️','⚡','🌈','🌪️','🌫️','🌊'], words:['مشمس','مطر','ثلج','عاصفة','قوس','إعصار','ضباب','موج'], gridSize:{rows:6,cols:7} },
    { title:'وسائل النقل',    images:['🚗','🚌','🚂','✈️','🚢','🏍️','🚁','🚀'], words:['سيارة','حافلة','قطار','طائرة','سفينة','دراجة','مروحية','صاروخ'], gridSize:{rows:6,cols:7} },
    { title:'أدوات المدرسة',  images:['📚','✏️','📐','📏','✂️','🖊️','📓','🖍️'], words:['كتاب','قلم','مثلثة','مسطرة','مقص','حبر','دفتر','تلوين'], gridSize:{rows:6,cols:7} },
    { title:'الطعام',         images:['🍕','🍔','🌮','🍜','🍣','🧆','🥗','🍱'], words:['بيتزا','برجر','تاكو','نودلز','سوشي','فلافل','سلطة','بنتو'], gridSize:{rows:6,cols:7} },
    { title:'أعضاء الجسم',    images:['👁️','👂','👃','🦷','💪','🦵','🤚','❤️'], words:['عين','أذن','أنف','سنة','عضلة','ساق','يد','قلب'], gridSize:{rows:6,cols:7} },
    { title:'الملابس',        images:['👕','👖','👗','👔','🧥','👟','🧤','🧢'], words:['قميص','بنطلون','فستان','بدلة','معطف','حذاء','قفاز','قبعة'], gridSize:{rows:6,cols:7} },
    { title:'الألوان',        images:['🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪'], words:['أحمر','برتقالي','أصفر','أخضر','أزرق','بنفسجي','أسود','أبيض'], gridSize:{rows:6,cols:7} },
];

// ==================== MODE 4: كلمات متقاطعة ====================

const CROSSWORD_DATA_M4 = [
    {
        words: [
            { word:'ملح',    clue:'🧂', row:0, col:0, dir:'h' },
            { word:'مدرسة', clue:'🏫', row:0, col:0, dir:'v' },
            { word:'حمام',  clue:'🕊️', row:0, col:2, dir:'v' },
            { word:'رسالة', clue:'✉️',  row:2, col:0, dir:'h' },
            { word:'سلم',   clue:'🪜',  row:3, col:0, dir:'h' },
        ],
        rows: 6, cols: 7
    },

    {
        words: [
            { word:'تفاح',   clue:'🍎', row:0, col:0, dir:'h' },
            { word:'تمساح', clue:'🐊', row:0, col:0, dir:'v' },
            { word:'حمص',   clue:'🫘', row:4, col:0, dir:'h' },
            { word:'فانوس', clue:'🏮', row:5, col:0, dir:'h' },
            { word:'خوخ',   clue:'🍑', row:6, col:0, dir:'h' },
        ],
        rows: 7, cols: 6
    },

    {
        words: [
            { word:'شمس',  clue:'☀️',  row:0, col:0, dir:'h' },
            { word:'سماء', clue:'🌌',  row:0, col:2, dir:'v' },
            { word:'ضوء',  clue:'💡',  row:3, col:0, dir:'h' },
            { word:'مطر',  clue:'🌧️', row:4, col:0, dir:'h' },
            { word:'ثلج',  clue:'❄️',  row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 5
    },

    {
        words: [
            { word:'قلم',   clue:'✏️', row:0, col:0, dir:'h' },
            { word:'قراءة', clue:'📖', row:0, col:0, dir:'v' },
            { word:'ليمون', clue:'🍋', row:0, col:1, dir:'v' },
            { word:'دفتر',  clue:'📓', row:5, col:0, dir:'h' },
            { word:'علم',   clue:'🔬', row:6, col:0, dir:'h' },
        ],
        rows: 7, cols: 5
    },


    {
        words: [
            { word:'أسد',  clue:'🦁', row:0, col:0, dir:'h' },
            { word:'أرنب', clue:'🐰', row:0, col:0, dir:'v' },
            { word:'سمكة', clue:'🐟', row:0, col:1, dir:'v' },
            { word:'ذئب',  clue:'🐺', row:4, col:0, dir:'h' },
            { word:'فيل',  clue:'🐘', row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 5
    },

    {
        words: [
            { word:'طبيب',  clue:'👨‍⚕️', row:0, col:0, dir:'h' },
            { word:'طائرة', clue:'✈️',   row:0, col:0, dir:'v' },
            { word:'بيت',   clue:'🏠',   row:0, col:3, dir:'v' },
            { word:'بحر',   clue:'🌊',   row:5, col:0, dir:'h' },
            { word:'نهر',   clue:'🏞️',  row:6, col:0, dir:'h' },
        ],
        rows: 7, cols: 5
    },


    {
        words: [
            { word:'قهوة', clue:'☕', row:0, col:0, dir:'h' },
            { word:'قمر',  clue:'🌙', row:0, col:0, dir:'v' },
            { word:'وردة', clue:'🌹', row:0, col:2, dir:'v' },
            { word:'شاي',  clue:'🍵', row:4, col:0, dir:'h' },
            { word:'لبن',  clue:'🥛', row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 5
    },


    {
        words: [
            { word:'سيارة', clue:'🚗', row:0, col:0, dir:'h' },
            { word:'سفينة', clue:'🚢', row:0, col:0, dir:'v' },
            { word:'يختار', clue:'🤔', row:2, col:0, dir:'h' },
            { word:'قطار',  clue:'🚂', row:5, col:0, dir:'h' },
            { word:'مترو',  clue:'🚇', row:6, col:0, dir:'h' },
        ],
        rows: 7, cols: 6
    },

    {
        words: [
            { word:'مصر',  clue:'🇪🇬', row:0, col:0, dir:'h' },
            { word:'مكة',  clue:'🕋',   row:0, col:0, dir:'v' },
            { word:'صقر',  clue:'🦅',   row:0, col:1, dir:'v' },
            { word:'هرم',  clue:'🔺',   row:3, col:0, dir:'h' },
            { word:'جمل',  clue:'🐪',   row:4, col:0, dir:'h' },
        ],
        rows: 5, cols: 4
    },

 
    {
        words: [
            { word:'فضاء', clue:'🌌', row:0, col:0, dir:'h' },
            { word:'فلك',  clue:'🪐', row:0, col:0, dir:'v' },
            { word:'ضياء', clue:'💡', row:0, col:1, dir:'v' },
            { word:'لياء', clue:'🌟', row:1, col:0, dir:'h' },
            { word:'مجرة', clue:'🌠', row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 5
    },


    {
        words: [
            { word:'رياضة', clue:'⚽', row:0, col:0, dir:'h' },
            { word:'ركض',   clue:'🏃', row:0, col:0, dir:'v' },
            { word:'يرمي',  clue:'🎯', row:0, col:1, dir:'v' },
            { word:'كرة',   clue:'🏀', row:1, col:0, dir:'h' },
            { word:'بطل',   clue:'🏆', row:4, col:0, dir:'h' },
        ],
        rows: 5, cols: 6
    },


    {
        words: [
            { word:'موسيقى', clue:'🎵', row:0, col:0, dir:'h' },
            { word:'مغني',   clue:'🎤', row:0, col:0, dir:'v' },
            { word:'غناء',   clue:'🎶', row:1, col:0, dir:'h' },
            { word:'عزف',    clue:'🎸', row:4, col:0, dir:'h' },
            { word:'أغنية',  clue:'🎼', row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 7
    },

    {
        words: [
            { word:'طعام', clue:'🍽️', row:0, col:0, dir:'h' },
            { word:'طبخ',  clue:'🍳', row:0, col:0, dir:'v' },
            { word:'عنب',  clue:'🍇', row:0, col:1, dir:'v' },
            { word:'خبز',  clue:'🍞', row:2, col:0, dir:'h' },
            { word:'زيت',  clue:'🫙', row:4, col:0, dir:'h' },
        ],
        rows: 5, cols: 5
    },

 
    {
        words: [
            { word:'حديقة', clue:'🌳', row:0, col:0, dir:'h' },
            { word:'حياة',  clue:'🌱', row:0, col:0, dir:'v' },
            { word:'دوار',  clue:'🌻', row:0, col:1, dir:'v' },
            { word:'نبات',  clue:'🪴', row:4, col:0, dir:'h' },
            { word:'ماء',   clue:'💧', row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 6
    },


    {
        words: [
            { word:'مدرسة', clue:'🏫', row:0, col:0, dir:'h' },
            { word:'مريم',  clue:'👩', row:0, col:0, dir:'v' },
            { word:'رسم',   clue:'🎨', row:1, col:0, dir:'h' },
            { word:'سبورة', clue:'🖊️', row:4, col:0, dir:'h' },
            { word:'كتاب',  clue:'📚', row:5, col:0, dir:'h' },
        ],
        rows: 6, cols: 7
    },
];

// ==================== دالة التحقق من الكلمات المتقاطعة ====================
function validateAndFixCrossword(data) {
    const { words, rows, cols } = data;
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(null));
    const validWords = [];

    for (const wInfo of words) {
        const { word, row, col, dir } = wInfo;
        let conflict = false;
        const cells = [];

        for (let i = 0; i < word.length; i++) {
            const r = dir === 'h' ? row : row + i;
            const c = dir === 'h' ? col + i : col;
            if (r < 0 || r >= rows || c < 0 || c >= cols) { conflict = true; break; }
            const existing = grid[r][c];
            if (existing !== null && existing !== word[i]) { conflict = true; break; }
            cells.push({ r, c, letter: word[i] });
        }

        if (!conflict) {
            cells.forEach(({ r, c, letter }) => { grid[r][c] = letter; });
            validWords.push(wInfo);
        }
    }

    return { words: validWords, rows, cols, grid };
}

// ==================== بناء قائمة المستويات — نمط ثابت ====================


function buildLevelList() {
    const pattern = [];

    pattern.push(1, 2, 3, 4);

    let i = 4;
    while (i < 100) {
        for (const m of [1, 1, 1, 2, 2, 3, 4]) {
            if (i >= 100) break;
            pattern.push(m);
            i++;
        }
    }

    const counters = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('kc_unlocked') : null;
    const unlocked = saved ? JSON.parse(saved) : new Array(100).fill(false);
    if (!saved) {
        unlocked[0] = true;
        if (typeof localStorage !== 'undefined') localStorage.setItem('kc_unlocked', JSON.stringify(unlocked));
    }

    return pattern.map((mode, idx) => {
        const id = idx + 1;
        const ci = counters[mode]++;
        let data = {};

        if (mode === 1) {
            const d = WORD_SETS_M1[ci % WORD_SETS_M1.length];
            data = { image: d.img, label: d.label, words: d.words };
        } else if (mode === 2) {
            const d = PROVERBS_M2[ci % PROVERBS_M2.length];
            data = { emojis: d.emojis, words: d.words };
        } else if (mode === 3) {
            const d = MULTI_SETS_M3[ci % MULTI_SETS_M3.length];
            data = { title: d.title, images: d.images, words: d.words, gridSize: d.gridSize };
        } else {
            const raw = CROSSWORD_DATA_M4[ci % CROSSWORD_DATA_M4.length];
            const validated = validateAndFixCrossword(raw);
            data = { crosswordWords: validated.words, gridRows: raw.rows, gridCols: raw.cols };
        }

        return { id, mode, data, unlocked: !!unlocked[idx] };
    });
}

let _cachedLevels = null;

function getAllLevels() {
    if (_cachedLevels) return _cachedLevels;
    _cachedLevels = buildLevelList();
    return _cachedLevels;
}

function saveUnlocked(arr) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('kc_unlocked', JSON.stringify(arr));
}

function unlockNextLevel(currentId) {
    const arr = JSON.parse((typeof localStorage !== 'undefined' ? localStorage.getItem('kc_unlocked') : null) || '[]') || new Array(100).fill(false);
    if (currentId < 100) {
        arr[currentId] = true;
        saveUnlocked(arr);
        if (_cachedLevels) _cachedLevels[currentId].unlocked = true;
    }
}

function saveCoins(amount) { if (typeof localStorage !== 'undefined') localStorage.setItem('kc_coins', amount); }
function loadCoins() { return parseInt((typeof localStorage !== 'undefined' ? localStorage.getItem('kc_coins') : null) || '100'); }