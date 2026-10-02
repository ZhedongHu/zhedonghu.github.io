/* ==========================================================================
   data/site.js —— 全站唯一内容源（★ 平时只改这个文件就够了 ★）
   --------------------------------------------------------------------------
   规则很简单：
   1. 需要 bilingual（中英双语）的字段写成 { zh: "中文", en: "English" }
      只有一种语言也没关系，缺的那个会自动回退到另一个。
   2. 不需要翻译的字段（邮箱、年份、链接、emoji）直接写字符串。
   3. 数组里多写/少写一项都没问题，页面会自动渲染，不用改 HTML。

   想加一篇笔记？在 posts 数组里追加一项即可。
   想加一个作品？在 works 数组里追加一项即可。
   ========================================================================== */

window.SITE_DATA = {

  /* -------------------------------------------------------------- 顶部临时横幅*/ 
  banner: {
    enabled: true,
    id: "v2-launch",                 // 改这个字符串 = 推送一条新横幅
    dismissible: true,               // 是否显示右侧 × 关闭按钮
    tag: { zh: "新版本", en: "NEW" }, // 左侧小标签，留空 "" 则不显示
    text: { zh: "全新版本个人主页发布！欢迎体验", en: "Brand-new website is live! Take a look" },
    /*link: {                          // 不需要链接就整段删掉，或把 url 留空
      text: { zh: "查看更新", en: "What's new" },
      url: "zhedonghu.github.io",
      newTab: true
    }*/
  },

  /* ------------------------------------------------------------- 欢迎页（开场） */
  /* 进入站点前的全屏欢迎页。可以点按钮、敲回车、点任意处跳过。
     once: true 表示每个浏览会话只显示一次（刷新不再出现）。       */
  welcome: {
    enabled: true,
    once: true,
    hello:   { zh: "你好，我是", en: "Hello, I'm" },
    // 这句是真实站点首页的招牌开场白（海内存知己，天涯若比邻）
    motto:   { zh: "海内存知己，天涯若比邻", en: "A bosom friend afar brings a distant land near" }
  },

  /* ---------------------------------------------------------------- 基本信息 */
  profile: {
    name:        { zh: "胡哲栋", en: "Zhedong Hu" },
    nameLatin:   "Zhedong Hu",
    role:        { zh: "七年级 · 探索者", en: "7th Grader · Explorer" },
    location:    { zh: "中国 · 杭州", en: "Hangzhou, China" },
    // ★ 真实学校（来自 GitHub 个人主页 / README）
    school:      { zh: "杭州师范大学东城中学", en: "Hangzhou Dongcheng Middle School" },
    // ★ 邮箱
    email:       "ZhedongHu@hotmail.com",
    // ★ 真实座右铭（来自 README 个人信息）
    motto:       { zh: "变化是唯一的永恒", en: "Change is the only constant" },
    welcome:     { zh: "幸会👏！欢迎来到我的个人主页",
                   en: "Nice to meet you 👏 Welcome to my homepage" },
    // 以下 heroDesc / wish 与真实站点首页文案一致
    heroDesc:    { zh: "星辰大海，逐梦前行。七年级的故事刚刚开始，这是一段全新的旅程，我将全力以赴。",
                   en: "To the stars and the sea, chasing my dreams. The story of Grade 7 is  begin — a brand-new journey I will give my all to." },
    wish:        { zh: "祝所有同学：新学期，身体健康，学业有成！",
                   en: "To all my classmates: a healthy and successful new semester!" },
    // ★ 真实自我介绍（来自 README / 个人主页）
    about: [
      { zh: "我叫胡哲栋，是一个来自中国浙江杭州的初中生。我最大的爱好是编程（你都在我的个人主页上看到我了）；除此之外，我也喜欢绘画、阅读、书法和写作。",
        en: "My name is Zhedong Hu, a junior high school student from Hangzhou, Zhejiang, China. On GitHub my favorite hobby is programming; I also enjoy drawing, reading, calligraphy and writing." },
      { zh: "欢迎来到我的个人主页——这里记录着我学过、做过、以及正在成为什么样的自己。如果你也对这些感兴趣，随时可以来找我聊聊。",
        en: "Welcome to my homepage — it records what I've learned, built, and who I'm becoming. If you're into the same things, come say hi anytime." }
    ],
    // 关于我卡片下方的标签云（综合技能与爱好）
    tags: ["Scratch", "Android","Python", "HTML", "C", "Kotlin", "Markdown"]
  },

  /* ------------------------------------------------------------ 顶部数字卡片 */
  stats: [
    { value: "7",   label: { zh: "年级",   en: "Grade" } },
    { value: "∞",   label: { zh: "好奇心",  en: "Curiosity" } },
    { value: "24/7", label: { zh: "在思考", en: "Thinking" } },
    { value: "1",   label: { zh: "个我",   en: "Of me" } }
  ],

  /* ------------------------------------------------------------------ 信息表 */
  info: [
    { key: { zh: "姓名",   en: "Name" },     value: { zh: "胡哲栋", en: "Zhedong Hu" } },
    { key: { zh: "学校",   en: "School" },   value: { zh: "杭州师范大学东城中学", en: "Hangzhou Dongcheng Middle School" } },
    { key: { zh: "城市",   en: "City" },     value: { zh: "杭州",   en: "Hangzhou" } },
    { key: { zh: "座右铭", en: "Motto" },    value: { zh: "变化是唯一的永恒", en: "Change is the only constant" } }
  ],

  /* ---------------------------------------------------------------- 成长时间线 */
  // 按 year 从大到小排列即可（页面会原样按顺序渲染）
  timeline: [
    { year: "2026",
      title: { zh: "七年级 · 新的旅程开始", en: "Grade 7 · A new journey begins" },
      desc:  { zh: "星辰大海，逐梦前行。带着好奇走进新教室，认识新的老师和同学，开始一段全新的旅程。",
               en: "To the stars and the sea. Walking into a new classroom with curiosity, meeting new teachers and classmates, starting a brand-new journey." },
      tag:   { zh: "现在", en: "Now" } },
    { year: "2024",
      title: { zh: "在浙江省学生信息素养提升实践活动创客竞赛创意智造赛项与队友取得浙江省一等奖（排名第四）", en: "Won the Zhejiang Provincial First Prize (ranked 4th)​ with teammates in the Creative Making​ category of the Maker Competition​ at the Zhejiang Student Information Literacy Enhancement Practice Activity." },
      desc:  { zh: "还有很多，懒得写了",
               en: "There's a lot more, but I'm too lazy to write them all." },
      tag:   { zh: "编程", en: "Coding" } },
  ],

  /* ------------------------------------------------------------- 编程技能（进度条） */
  // 从「编程语言」兴趣中拆分出来的独立栏目。level 为能力百分比（0–100），
  // 数值依据真实 README / 作品：Scratch 与 Markdown 最熟，C 写过小程序，
  // Python 写过脚本，HTML 搭过网页，Kotlin 刚起步。
  skills: [
    { name: "中文",  level: 100, note: { zh: "用于编写提示词，利用AI做作品", en: "For AI prompt" } },
    { name: "Scratch",  level: 100, note: { zh: "最熟练，拖积木就能做出小游戏", en: "Most fluent — build games by dragging blocks" } },
    { name: "Markdown", level: 100, note: { zh: "写笔记和 README 的标配", en: "My default for notes and READMEs" } },
    { name: "C",        level: 70,  note: { zh: "写过一个计算机健康检查小程序(仅供娱乐！）", en: "Built a small computer health-check program(ONLY FOR FUN!)" } },
    { name: "Python",   level: 50,  note: { zh: "能写跑起来的小工具", en: "Can build runnable little tools" } },
    { name: "HTML",     level: 40,  note: { zh: "搭网页结构与内容", en: "Page structure & content" } },
    { name: "Kotlin",   level: 40,  note: { zh: "刚刚开始接触", en: "Just getting started" } }
  ],

  /* ------------------------------------------------------------ 兴趣（可过滤） */
  // cat 取值：tech（技术）/ study（学习）/ life（生活）
  interests: [
    { icon: "💻", title: { zh: "编程", en: "Programming" },
      desc: { zh: "我最喜欢的爱好！用 Scratch、Python 和 HTML 把脑子里的想法变成能跑起来、看得见的东西。",
              en: "My favorite hobby! Turning the ideas in my head into runnable, visible things with Scratch, Python and HTML." },
      tags: ["Scratch", "Python", "HTML"], cat: "tech" },
    { icon: "🖌", title: { zh: "绘画", en: "Drawing" },
      desc: { zh: "画画是我除了编程以外的另一项特长，喜欢用色彩把脑子里的画面表现出来。",
              en: "Drawing is my other specialty besides coding — I love putting the pictures in my head onto paper." },
      tags: ["Art"], cat: "life" },
    { icon: "📚", title: { zh: "阅读", en: "Reading" },
      desc: { zh: "科幻、科普、人物传记都看，书是最便宜的时空穿越机。",
              en: "Sci-fi, popular science, biographies — books are the cheapest time machine." },
      tags: ["Books"], cat: "life" },
    { icon: "🖋", title: { zh: "书法", en: "Calligraphy" },
      desc: { zh: "一笔一画里藏着耐心，练字也是练心。",
              en: "Patience lives in every stroke — practising calligraphy is also practising the mind." },
      tags: ["Art"], cat: "life" },
    { icon: "📝", title: { zh: "写作", en: "Writing" },
      desc: { zh: "把读到的、想到的写下来，写下来的那一刻，想法才真正属于自己。",
              en: "Writing down what I read and think — the moment it's written, the idea truly becomes mine." },
      tags: ["Essays"], cat: "life" }
  ],

  /* -------------------------------------------------------------------- 作品集 */
  works: [
    { emoji: "🌐", title: { zh: "个人主页", en: "Personal Homepage" },
      desc:  { zh: "你现在看到的这个网站：蓝色科技风、中英文双语、可轻松扩展的项目列表。",
               en: "The website you are looking at now: blue tech style, bilingual, and an easily extensible project list." },
      link: "https://zhedonghu.github.io/", tags: ["HTML", "CSS", "JavaScript"] },
    { emoji: "📓", title: { zh: "日记仓库", en: "Diary" },
      desc:  { zh: "一个日记仓库，配有一个非常简陋的网页。",
               en: "A diary repository with a very rudimentary web interface." },
      link: "https://zhedonghu.github.io/Diary", tags: ["HTML", "Markdown", "Diary"] },
    { emoji: "👤", title: { zh: "关于我", en: "About me" },
      desc:  { zh: "这是我的自我介绍。",
               en: "Something about me." },
      link: "https://github.com/ZhedongHu/ZhedongHu/blob/main/README.md", tags: ["Markdown"] },
    { emoji: "🎮", title: { zh: "2048 小游戏", en: "2048 Game" },
      desc:  { zh: "一个经典的数字消除游戏。",
               en: "A classic number-merging puzzle game." },
      link: "https://zhedonghu.github.io/2048", tags: ["HTML", "CSS", "JavaScript"] },
    { emoji: "🔢", title: { zh: "猜数字游戏", en: "Guess the Number" },
      desc:  { zh: "一个极简猜数字游戏。",
               en: "A minimal guess-the-number game." },
      link: "https://zhedonghu.github.io/guess-number", tags: ["HTML", "CSS", "JavaScript"] },
    { emoji: "💻", title: { zh: "计算机健康状况检查", en: "Computer Health Check" },
      desc:  { zh: "仅供娱乐，没有任何实际意义的计算机健康状况检查。",
               en: "For entertainment only — a computer health check with no real meaning." },
      link: "https://github.com/ZhedongHu/computer-health-check", tags: ["C"] },
    { emoji: "🏠", title: { zh: "浏览器主页", en: "Browser Homepage" },
      desc:  { zh: "一个简洁的浏览器主页。",
               en: "A clean, simple browser homepage." },
      link: "https://zhedonghu.github.io/simple-browser-homepage", tags: ["HTML", "CSS", "JavaScript"] },
    { emoji: "🐍", title: { zh: "贪吃蛇", en: "Snake Game" },
      desc:  { zh: "经典贪吃蛇游戏。",
               en: "The classic Snake game." },
      link: "https://zhedonghu.github.io/snake/", tags: ["HTML", "CSS", "JavaScript"] },
    { emoji: "🎨", title: { zh: "字符画设计器", en: "AICILL Art" },
      desc:  { zh: "你可以通过涂抹色块的方式，制作独一无二的字符画。",
               en: "Make unique ASCII art by painting color blocks." },
      link: "https://zhedonghu.github.io/AICILL-art", tags: ["HTML", "CSS", "JavaScript", "Art"] }
  ],

  /* ------------------------------------------------------------------ 趣闻录 */
  // body 支持 Markdown（标题 / 列表 / 代码 / 引用 / 加粗 / 链接 都可以）
  posts: [
    {
      id: "national-day",
      date: "2026-10-1",
      title: { zh: "热烈庆祝中华人民共和国成立77周年！", en: "Warmly celebrate the 77th anniversary of the founding of the People's Republic of China!" },
      summary: { zh: "盛世华诞，举国同庆！",
                 en: "A glorious birthday in a flourishing era — the whole nation celebrates as one!" },
      tags: ["国庆"],
      body: {
        zh: [
          "# 热烈庆祝中华人民共和国成立77周年！"
        ].join("\n"),
        en: [
          "# Warmly celebrate the 77th anniversary of the founding of the People's Republic of China!"
        ].join("\n")
      }
    },
  ],
  /* ---------------------------------------------------------------- 在GitHub上找我 */
  links: [
    { name: "GitHub", url: "https://github.com/ZhedongHu/" }
  ],

  /* ------------------------------------------------------------------ 页脚文案 */
  footer: {
    copy: { zh: "© 2026 胡哲栋 | 利用人工智能辅助生成 | 网页代码采用MIT协议授权",
            en: "© 2026 Zhedong Hu | AI-assisted generation | Website code licensed under the MIT License" }
  }
};
