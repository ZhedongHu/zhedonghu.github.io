/* ==========================================================================
   assets/js/app.js —— 渲染与交互
   --------------------------------------------------------------------------
   页面所有内容都由 data/site.js 驱动，改数据即改页面。
   一般情况下不需要修改这个文件。
   ========================================================================== */

(function () {
  var D = window.SITE_DATA || {};
  var pick = window.I18N.pick;
  var t = window.I18N.t;

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  /* ==========================================================================
     顶部横幅
     ========================================================================== */
  var BANNER_KEY = "zh-site-banner-dismissed";
  var WELCOME_KEY = "zh-site-welcomed";

  /* 安全访问本地存储：隐私模式 / file:// / iframe 限制下不会报错 */
  function store(kind) {
    try { return window[kind] || null; } catch (e) { return null; }
  }
  function readJSON(kind, key, fallback) {
    var s = store(kind);
    if (!s) return fallback;
    try {
      var raw = s.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(kind, key, value) {
    var s = store(kind);
    if (!s) return;
    try { s.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function dismissedBannerIds() { return readJSON("localStorage", BANNER_KEY, []); }
  function rememberBanner(id) {
    var list = dismissedBannerIds();
    if (list.indexOf(id) === -1) list.push(id);
    writeJSON("localStorage", BANNER_KEY, list);
  }

  function renderBanner() {
    var cfg = D.banner || {};
    var el = $("#announce");
    if (!el) return;

    var id = cfg.id || "default";
    var show = cfg.enabled !== false && dismissedBannerIds().indexOf(id) === -1;
    if (!show) { el.hidden = true; setBannerHeight(0); return; }

    // 文案（允许内嵌 HTML，例如 <a href="...">链接</a>）
    var text = pick(cfg.text || "");
    $("#announceText").innerHTML = text;

    var tagText = pick(cfg.tag || "");
    var tagEl = $("#announceTag");
    tagEl.textContent = tagText;
    tagEl.style.display = tagText ? "" : "none";

    // 链接
    var link = cfg.link || {};
    var linkEl = $("#announceLink");
    if (link.url && pick(link.text)) {
      linkEl.href = link.url;
      if (link.newTab !== false) { linkEl.target = "_blank"; linkEl.rel = "noopener"; }
      $("#announceLinkText").textContent = pick(link.text);
      linkEl.style.display = "";
    } else {
      linkEl.style.display = "none";
    }

    // 关闭按钮
    var closeEl = $("#announceClose");
    closeEl.style.display = cfg.dismissible === false ? "none" : "";
    closeEl.setAttribute("aria-label", t("bannerClose"));
    closeEl.onclick = function () {
      rememberBanner(id);
      el.hidden = true;
      setBannerHeight(0);
    };

    el.hidden = false;
    // 等布局完成后测量高度，写入 CSS 变量（导航与 Hero 会自动让位）
    requestAnimationFrame(function () { setBannerHeight(el.offsetHeight); });
  }

  function setBannerHeight(h) {
    document.documentElement.style.setProperty("--banner-h", (h || 0) + "px");
  }

  /* ==========================================================================
     欢迎页
     ========================================================================== */

  function initWelcome() {
    var cfg = D.welcome || {};
    var el = $("#welcome");
    if (!el) return;

    var already = false;
    if (cfg.once !== false) {
      var s = store("sessionStorage");
      if (s) { try { already = s.getItem(WELCOME_KEY) === "1"; } catch (e) {} }
    }

    if (cfg.enabled === false || already) { closeWelcome(el, true); return; }

    document.body.classList.add("welcome-open");
    var ss = store("sessionStorage");
    if (ss) { try { ss.setItem(WELCOME_KEY, "1"); } catch (e) {} }

    var enter = function () { closeWelcome(el, false); };
    var btn = $("#welcomeEnter");
    if (btn) btn.addEventListener("click", enter);
    el.addEventListener("click", enter);
    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        document.removeEventListener("keydown", onKey);
        enter();
      }
    });
    // 兜底：8 秒后自动进入，避免访客卡在欢迎页
    setTimeout(enter, 8000);
  }

  function closeWelcome(el, instant) {
    if (!el) return;
    if (instant) { el.style.display = "none"; }
    else { el.classList.add("hide"); setTimeout(function () { el.style.display = "none"; }, 700); }
    document.body.classList.remove("welcome-open");
    // 欢迎页消失后再做一次滚动测量，确保进度条/导航状态正确
    setTimeout(measure, 60);
  }

  /* ==========================================================================
     文本与内容渲染
     ========================================================================== */
  function applyStaticText() {
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });

    var p = D.profile || {};
    var w = D.welcome || {};

    $("#wName").textContent = pick(p.name);
    $("#wLatin").textContent = (p.nameLatin || "").toUpperCase();
    $("#wMotto").textContent = pick(w.motto) || pick(p.motto);

    // Hero 主标题：数据里的欢迎语是纯文本，保留 emoji 挥手动画
    var welcome = pick(p.welcome) || t("heroTitle1");
    $("#heroTitle").innerHTML = esc(welcome).replace("👏", '<span class="wave">👏</span>');

    $("#heroMotto").textContent = pick(p.motto);
    $("#heroDesc").textContent = pick(p.heroDesc) || t("heroDesc");
    $("#heroWish").textContent = pick(p.wish) || t("heroWish");

    $("#footerWish").textContent = pick(p.wish) || t("heroWish");
    $("#footerCopy").textContent = pick((D.footer || {}).copy) || "";

    document.title = t("docTitle");
    $("html").lang = window.I18N.lang === "zh" ? "zh-CN" : "en";
  }

  /* ------------------------------------------------------------- Hero 终端卡 */
  function renderTerminal() {
    var p = D.profile || {};
    if ($("#termWho")) {
      $("#termWho").textContent = pick(p.name) + " · " + pick(p.role);
    }
    if ($("#termJson")) {
      var obj = {
        name: pick(p.name),
        role: pick(p.role),
        grade: pick(p.school),
        location: pick(p.location),
        email: p.email || "",
        motto: pick(p.motto)
      };
      $("#termJson").textContent = JSON.stringify(obj, null, 2);
    }
  }

  /* --------------------------------------------------- Hero 终端彩蛋（sudo） */
  // 只绑定一次，避免语言切换时重复挂载监听器
  var _termEggReady = false;
  function initTerminalEgg() {
    if (_termEggReady) return;
    var card = $("#termCard");
    var input = $("#termInput");
    var live = $("#termLive");
    var log = $("#termLog");
    var body = $("#termBody");
    if (!card || !input) return;
    _termEggReady = true;

    // 点击终端任意位置即聚焦输入框
    card.addEventListener("click", function () { input.focus(); });

    function lang() { return (window.I18N && window.I18N.lang) === "en" ? "en" : "zh"; }

    // 输出一行文本（用 textContent，避免任意文本注入）
    function appendLine(text, cls) {
      var p = document.createElement("p");
      p.className = "tout " + (cls || "");
      p.textContent = text;
      log.appendChild(p);
    }

    // 回显已输入的命令（用户输入走文本节点，杜绝 XSS）
    function echo(cmd) {
      var p = document.createElement("p");
      p.className = "tline";
      var tp = document.createElement("span");
      tp.className = "tp"; tp.textContent = "$";
      p.appendChild(tp);
      p.appendChild(document.createTextNode(cmd));
      log.appendChild(p);
    }

    // 解析命令并给出回应
    function run(raw) {
      var c = raw.trim();
      if (!c) return;
      echo(c);
      var low = c.toLowerCase();
      if (low === "clear" || low === "cls") {
        log.innerHTML = "";
      } else if (low === "help") {
        appendLine(lang() === "en"
          ? "hint: try `sudo` — though it won't help you 😏"
          : "提示：试试输入 sudo …… 不过据说没用 😏", "term-dim");
      } else if (low.indexOf("sudo make me a sandwich") === 0) {
        appendLine(lang() === "en" ? "Okay. 🥪" : "好嘞，三明治来了 🥪", "term-ok");
      } else if (low.indexOf("sudo rm -rf") === 0) {
        appendLine(lang() === "en"
          ? "rm: think twice — my homework says no 😈"
          : "rm: 想毁灭世界？先问问我的作业同不同意 😈", "term-err");
      } else if (low.indexOf("sudo") === 0) {
        appendLine(lang() === "en"
          ? "zhedong is not in the sudoers file. This incident will be reported. 👮"
          : "zhedong 不在 sudoers 文件中。这次事件将被上报。👮", "term-err");
      } else {
        appendLine(lang() === "en" ? "command not found: " + c : "未找到命令：" + c, "term-dim");
      }
      body.scrollTop = body.scrollHeight;
    }

    input.addEventListener("input", function () { live.textContent = input.value; });
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      run(input.value);
      input.value = "";
      live.textContent = "";
    });
  }

  /* ------------------------------------------------------------------ 统计条 */
  function renderStats() {
    var box = $("#heroStats");
    if (!box || !D.stats) return;
    box.innerHTML = D.stats.map(function (s) {
      return '<div class="stat"><div class="stat-value"><span>' + esc(s.value) +
             '</span></div><div class="stat-label">' + esc(pick(s.label)) + "</div></div>";
    }).join("");
  }

  /* -------------------------------------------------------------------- 关于我 */
  function renderAbout() {
    var p = D.profile || {};

    var prose = $("#aboutText");
    if (prose) {
      prose.innerHTML = (p.about || []).map(function (x) { return "<p>" + esc(pick(x)) + "</p>"; }).join("");
    }

    var tags = $("#aboutTags");
    if (tags) {
      tags.innerHTML = (p.tags || []).map(function (x) { return '<span class="tag">' + esc(x) + "</span>"; }).join("");
    }

    var table = $("#infoTable");
    if (table && D.info) {
      table.innerHTML = D.info.map(function (r) {
        return '<div class="info-row"><dt>' + esc(pick(r.key)) + "</dt><dd>" + esc(pick(r.value)) + "</dd></div>";
      }).join("");
    }
  }

  /* -------------------------------------------------------------------- 时间线 */
  function renderTimeline() {
    var box = $("#timelineList");
    if (!box || !D.timeline) return;
    box.innerHTML = D.timeline.map(function (item) {
      return '<li class="tl-item reveal">' +
        '<div class="tl-year">' + esc(item.year) + "</div>" +
        '<div class="tl-main">' +
          '<h3 class="tl-title">' + esc(pick(item.title)) + "</h3>" +
          '<p class="tl-desc">' + esc(pick(item.desc)) + "</p>" +
          (item.tag ? '<span class="tl-tag">' + esc(pick(item.tag)) + "</span>" : "") +
        "</div></li>";
    }).join("");
  }

  /* --------------------------------------------------------- 兴趣（含分类过滤） */
  var interestFilter = "all";

  function renderInterests() {
    var bar = $("#interestFilters");
    var list = $("#interestList");
    if (!list || !D.interests) return;

    if (bar) {
      var cats = [
        { id: "all", label: t("filterAll") },
        { id: "tech", label: t("filterTech") },
        { id: "study", label: t("filterStudy") },
        { id: "life", label: t("filterLife") }
      ];
      bar.innerHTML = cats.map(function (c) {
        return '<button type="button" data-cat="' + c.id + '" class="' +
               (interestFilter === c.id ? "on" : "") + '">' + esc(c.label) + "</button>";
      }).join("");
      bar.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () {
          interestFilter = btn.getAttribute("data-cat");
          renderInterests();
          observeReveals();
        });
      });
    }

    var items = D.interests.filter(function (x) {
      return interestFilter === "all" || x.cat === interestFilter;
    });

    list.innerHTML = items.map(function (x) {
      return '<article class="card ic-card reveal">' +
        '<div class="ic-icon">' + esc(x.icon || "✨") + "</div>" +
        '<h3 class="ic-title">' + esc(pick(x.title)) + "</h3>" +
        '<p class="ic-desc">' + esc(pick(x.desc)) + "</p>" +
        ((x.tags || []).length ? '<div class="ic-tags">' + x.tags.map(function (g) {
          return '<span class="tag">' + esc(g) + "</span>";
        }).join("") + "</div>" : "") +
        "</article>";
    }).join("");
  }

  /* ----------------------------------------------------------- 编程技能（进度条） */
  function renderSkills() {
    var box = $("#skillList");
    if (!box || !D.skills) return;
    box.innerHTML = D.skills.map(function (s) {
      var lvl = Math.max(0, Math.min(100, Number(s.level) || 0));
      var note = s.note ? pick(s.note) : "";
      return '<div class="skill-item reveal">' +
        '<div class="skill-head">' +
          '<span class="skill-name">' + esc(s.name || "") + "</span>" +
          '<span class="skill-pct">' + lvl + "%</span>" +
        "</div>" +
        '<div class="skill-bar"><div class="skill-fill" style="--w:' + lvl + '%"></div></div>' +
        (note ? '<p class="skill-note">' + esc(note) + "</p>" : "") +
        "</div>";
    }).join("");
  }

  /* ---------------------------------------------------------------------- 作品 */
  function renderWorks() {
    var box = $("#workList");
    if (!box || !D.works) return;
    box.innerHTML = D.works.map(function (w) {
      var hasLink = w.link && /^(https?:|mailto:)/i.test(w.link);
      return '<article class="wc-item reveal">' +
        '<div class="wc-emoji">' + esc(w.emoji || "📦") + "</div>" +
        "<div>" +
          '<h4 class="wc-title">' + esc(pick(w.title)) + "</h4>" +
          '<p class="wc-desc">' + esc(pick(w.desc)) + "</p>" +
          ((w.tags || []).length ? '<div class="wc-tags">' + w.tags.map(function (g) {
            return '<span class="tag">' + esc(g) + "</span>";
          }).join("") + "</div>" : "") +
        "</div>" +
        '<div class="wc-side">' +
          (hasLink ? '<a class="wc-link" href="' + esc(w.link) + '" target="_blank" rel="noopener">' +
            (window.I18N.lang === "zh" ? "查看" : "View") + " <span>→</span></a>" : "") +
        "</div></article>";
    }).join("");
  }

  /* ---------------------------------------------------------------------- 笔记 */
  function formatDate(str) {
    if (!str) return "";
    var parts = String(str).split("-");
    if (parts.length !== 3) return str;
    var y = parts[0], m = Number(parts[1]), d = Number(parts[2]);
    if (window.I18N.lang === "zh") return y + "." + (m < 10 ? "0" + m : m) + "." + (d < 10 ? "0" + d : d);
    var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (MON[m - 1] || "") + " " + d + ", " + y;
  }

  function renderNotes() {
    var box = $("#noteList");
    if (!box || !D.posts) return;
    box.innerHTML = D.posts.map(function (p) {
      return '<article class="note-item reveal">' +
        '<button class="note-head" type="button" aria-expanded="false">' +
          '<span class="note-date">' + esc(formatDate(p.date)) + "</span>" +
          '<span class="note-title">' + esc(pick(p.title)) + "</span>" +
          ((p.tags || []).length ? '<span class="note-tags">' + p.tags.map(function (g) {
            return '<span class="tag">' + esc(g) + "</span>";
          }).join("") + "</span>" : "<span></span>") +
          '<span class="note-arrow">▾</span>' +
        "</button>" +
        '<p class="note-summary">' + esc(pick(p.summary)) + "</p>" +
        '<div class="note-body md">' + window.mdToHtml(pick(p.body || {})) + "</div>" +
        "</article>";
    }).join("");

    box.querySelectorAll(".note-head").forEach(function (head) {
      head.addEventListener("click", function () {
        var item = head.closest(".note-item");
        var open = item.classList.toggle("open");
        head.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---------------------------------------------------------------- 联系与链接 */
  function renderContact() {
    var mail = (D.profile || {}).email || "";
    var mv = $("#mailValue");
    if (mv) { mv.textContent = mail; mv.href = "mailto:" + mail; }
    var mb = $("#mailBtn");
    if (mb) mb.href = "mailto:" + mail;

    var box = $("#friendLinks");
    if (box && D.links) {
      box.innerHTML = D.links.map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.name) + "</a>";
      }).join("");
    }
  }

  function bindCopy() {
    var btn = $("#copyBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var mail = (D.profile || {}).email || "";
      var done = function () { showToast(t("copied")); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = mail; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  var toastTimer;
  function showToast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ==========================================================================
     语言切换（页面上有多处切换器，统一用 [data-lang-switch] 标记）
     ========================================================================== */
  function syncLangSwitch() {
    $$("[data-lang-switch]").forEach(function (wrap) {
      var thumb = wrap.querySelector(".lang-thumb");
      var btns = wrap.querySelectorAll("button");
      var active = null;
      btns.forEach(function (b) {
        var on = b.getAttribute("data-lang") === window.I18N.lang;
        b.classList.toggle("on", on);
        if (on) active = b;
      });
      if (thumb && active) {
        thumb.style.width = active.offsetWidth + "px";
        thumb.style.transform = "translateX(" + (active.offsetLeft - 3) + "px)";
      }
      btns.forEach(function (b) {
        b.onclick = function (e) {
          e.stopPropagation();
          window.I18N.set(b.getAttribute("data-lang"));
        };
      });
    });
  }

  /* ==========================================================================
     动效与滚动
     ========================================================================== */
  var io = null;
  function observeReveals() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    }
    els.forEach(function (el) { io.observe(el); });
  }

  function measure() {
    var nav = $("#nav");
    var bar = $("#scrollProgress");
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 10);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    var links = $$("#navLinks a");
    var idx = -1;
    links.forEach(function (a, i) {
      var sec = document.querySelector(a.getAttribute("href"));
      if (sec && sec.offsetTop - 160 <= y) idx = i;
    });
    links.forEach(function (a, i) { a.classList.toggle("active", i === idx); });
  }

  function bindNavToggle() {
    var btn = $("#navToggle");
    var menu = $("#navLinks");
    if (!btn || !menu) return;
    btn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ==========================================================================
     总渲染
     ========================================================================== */
  function renderAll() {
    applyStaticText();
    renderBanner();
    renderTerminal();
    initTerminalEgg();
    renderStats();
    renderAbout();
    renderTimeline();
    renderSkills();
    renderInterests();
    renderWorks();
    renderNotes();
    renderContact();
    syncLangSwitch();
    observeReveals();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
    initWelcome();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", function () {
      syncLangSwitch();
      var el = $("#announce");
      setBannerHeight(el && !el.hidden ? el.offsetHeight : 0);
    });
    bindNavToggle();
    bindCopy();
    measure();
    window.I18N.onChange(function () { renderAll(); });
  });
})();
