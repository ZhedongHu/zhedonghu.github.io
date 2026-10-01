/* ==========================================================================
   assets/js/i18n.js —— 界面文案 + 语言切换
   --------------------------------------------------------------------------
   · 界面固定文案（导航、按钮、小标题）写在下面的 UI 字典里
   · 具体内容（介绍、作品、文章）写在 data/site.js 里
   · 默认跟随系统语言，手动切换后记住选择（localStorage）
   ========================================================================== */

window.UI_TEXT = {
  zh: {
    brandName: "胡哲栋", brandSub: "ZHEDONG HU",
    navAbout: "关于我", navTimeline: "成长轨迹", navSkills: "编程技能",
    navInterests: "兴趣与作品",
    navNotes: "趣闻录", navContact: "联系我",
    heroBadge: "七年级 · 新学期进行中",
    heroTitle1: '幸会<span class="wave">👏</span>！欢迎来到我的个人主页',
    motto: "海内存知己，天涯若比邻",
    heroDesc: "星辰大海，逐梦前行。七年级的故事即将开始，这是一段全新的旅程，我将全力以赴。",
    heroWish: "祝所有同学：新学期，身体健康，学业有成！",
    ctaWorks: "看看我的作品", ctaContact: "和我联系",

    aboutEyebrow: "01 / ABOUT", aboutTitle: "关于我",
    aboutSub: "一名刚刚开启七年级旅程的学生，喜欢把想法变成看得见的东西。",
    timeEyebrow: "02 / TIMELINE", timeTitle: "成长轨迹",
    timeSub: "每一步都不大，但一直向前。",

    skillEyebrow: "03 / SKILLS", skillTitle: "编程技能",
    skillSub: "这些是我在 GitHub 上练过的语言，进度条代表目前的熟练程度。",

    intEyebrow: "04 / INTERESTS & WORKS", intTitle: "兴趣与作品",
    intSub: "好奇心指向哪里，时间就花在哪里。",
    filterAll: "全部", filterTech: "技术", filterStudy: "学习", filterLife: "生活",
    worksTitle: "作品集",

    noteEyebrow: "05 / ANECDOTES", noteTitle: "趣闻录",
    noteSub: "趣闻或者日记",

    ctEyebrow: "06 / CONTACT", ctTitle: "联系我",
    ctSub: "有问题、想交流、或者只是打个招呼，都可以给我发邮件。",
    ctEmailLabel: "电子邮件", ctSend: "发邮件给我", ctCopy: "复制邮箱",
    ctLinks: "在GitHub上找我", copied: "邮箱已复制到剪贴板 ✅",

    footerWish: "祝所有同学：新学期，身体健康，学业有成！",
    wHello: "你好，我是", wEnter: "进入主页", termHint: "点这里，然后试着输入 sudo 👀",
    wHint: "按 Enter 键或点击任意处进入", wTag: "个人主页 · 2026",
    bannerClose: "关闭",
    docTitle: "胡哲栋 | Zhedong Hu"
  },

  en: {
    brandName: "Zhedong Hu", brandSub: "HU ZHEDONG",
    navAbout: "About", navTimeline: "Timeline", navSkills: "Skills",
    navInterests: "Interests",
    navNotes: "Anecdotes", navContact: "Contact",
    heroBadge: "Grade 7 · New semester in progress",
    heroTitle1: 'Nice to meet you <span class="wave">👏</span> Welcome to my homepage',
    motto: "A bosom friend afar brings distant lands near",
    heroDesc: "To the stars and the sea, chasing my dreams. The story of Grade 7 is about to begin — a brand-new journey I will give my all to.",
    heroWish: "To all my classmates: a healthy and successful new semester!",
    ctaWorks: "See my work", ctaContact: "Get in touch",

    aboutEyebrow: "01 / ABOUT", aboutTitle: "About me",
    aboutSub: "A student who just started Grade 7, turning ideas into something you can see.",
    timeEyebrow: "02 / TIMELINE", timeTitle: "Timeline",
    timeSub: "Small steps, always forward.",

    skillEyebrow: "03 / SKILLS", skillTitle: "Coding Skills",
    skillSub: "The languages I've practiced on GitHub — the bars show how comfortable I am with each.",

    intEyebrow: "04 / INTERESTS & WORKS", intTitle: "Interests & Works",
    intSub: "Where curiosity points, time goes.",
    filterAll: "All", filterTech: "Tech", filterStudy: "Study", filterLife: "Life",
    worksTitle: "Works",

    noteEyebrow: "05 / ANECDOTES", noteTitle: "Anecdotes",
    noteSub: "Something funny or my diary",

    ctEyebrow: "06 / CONTACT", ctTitle: "Contact",
    ctSub: "Questions, ideas, or just a hello — feel free to email me.",
    ctEmailLabel: "Email", ctSend: "Send me an email", ctCopy: "Copy email",
    ctLinks: "Find me on GitHub", copied: "Email copied to clipboard ✅",

    footerWish: "To all my classmates: a healthy and successful new semester!",
    wHello: "Hello, I'm", wEnter: "Enter site", termHint: "Tap here, then try typing sudo 👀",
    wHint: "Press Enter or click anywhere to continue", wTag: "Homepage · 2026",
    bannerClose: "Close",
    docTitle: "Zhedong Hu | Homepage"
  }
};

(function () {
  var STORE_KEY = "zh-site-lang";
  var listeners = [];

  function detect() {
    var saved = null;
    try { if (window.localStorage) saved = window.localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved === "zh" || saved === "en") return saved;
    var sys = (navigator.language || navigator.userLanguage || "zh").toLowerCase();
    return sys.indexOf("zh") === 0 ? "zh" : "en";
  }

  var current = detect();

  window.I18N = {
    /** 当前语言 */
    get lang() { return current; },
    /** 界面文案 t('navAbout') */
    t: function (key) {
      var pack = window.UI_TEXT[current] || {};
      var fallback = window.UI_TEXT.zh || {};
      return pack[key] !== undefined ? pack[key] : (fallback[key] !== undefined ? fallback[key] : key);
    },
    /** 数据字段取值：{zh, en} → 字符串 */
    pick: function (field) {
      if (field == null) return "";
      if (typeof field === "string" || typeof field === "number") return String(field);
      return field[current] || field.zh || field.en || "";
    },
    set: function (lang) {
      if (lang !== "zh" && lang !== "en") return;
      current = lang;
      try { if (window.localStorage) window.localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
      listeners.forEach(function (fn) { fn(lang); });
    },
    onChange: function (fn) { listeners.push(fn); },
    toggle: function () { this.set(current === "zh" ? "en" : "zh"); }
  };

  document.documentElement.lang = current === "zh" ? "zh-CN" : "en";
})();
