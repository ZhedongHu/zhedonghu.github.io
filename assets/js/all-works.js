/* ==========================================================================
   assets/js/all-works.js —— 独立「全部作品」页面的渲染与交互
   --------------------------------------------------------------------------
   复用主页的设计语言与数据（data/site.js + i18n.js）：
   · 卡片网格由 D.works 驱动（与全屏作品流同源）
   · 支持中英双语切换、reveal 渐入、导航滚动状态、汉堡菜单
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

  /* ------------------------------------------------------------ 静态文案 */
  function applyStaticText() {
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });

    var fw = $("#footerWish");
    if (fw) fw.textContent = pick((D.profile || {}).wish) || t("heroWish");
    var fc = $("#footerCopy");
    if (fc) fc.textContent = pick((D.footer || {}).copy) || "";

    document.title = t("allTitle") + " | " + t("brandName");
    $("html").lang = window.I18N.lang === "zh" ? "zh-CN" : "en";
  }

  /* ----------------------------------------------------- 全部作品（卡片网格） */
  function renderAllWorks() {
    var box = $("#allWorksList");
    if (!box || !D.works) return;
    box.innerHTML = D.works.map(function (w) {
      var hasLink = w.link && /^(https?:|mailto:)/i.test(w.link);
      var thumb = w.image ? "background-image:url('" + esc(w.image) + "')" : "";
      return '<article class="card aw-card reveal">' +
        '<div class="aw-thumb' + (w.image ? "" : " aw-thumb--fallback") + '" style="' + thumb + '"></div>' +
        '<div class="aw-body">' +
          (w.emoji ? '<div class="aw-emoji">' + esc(w.emoji) + "</div>" : "") +
          '<h3 class="aw-title">' + esc(pick(w.title)) + "</h3>" +
          '<p class="aw-desc">' + esc(pick(w.desc)) + "</p>" +
          ((w.tags || []).length ? '<div class="aw-tags">' + w.tags.map(function (g) {
            return '<span class="tag">' + esc(g) + "</span>";
          }).join("") + "</div>" : "") +
          (hasLink ? '<a class="wc-link" href="' + esc(w.link) + '" target="_blank" rel="noopener">' +
            (window.I18N.lang === "zh" ? "查看" : "View") + " <span>→</span></a>" : "") +
        "</div>" +
      "</article>";
    }).join("");
  }

  /* ------------------------------------------------------------ 语言切换器 */
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

  /* ------------------------------------------------------------ 动效与滚动 */
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
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("scrolled", y > 10);
    var bar = $("#scrollProgress");
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }

  /* ------------------------------------------------------------ 汉堡菜单 */
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

  /* ------------------------------------------------------------ 总渲染 */
  function renderAll() {
    applyStaticText();
    renderAllWorks();
    syncLangSwitch();
    observeReveals();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", syncLangSwitch);
    bindNavToggle();
    measure();
    window.I18N.onChange(function () { renderAll(); });
  });
})();
