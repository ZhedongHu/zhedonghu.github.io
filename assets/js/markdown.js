/* ==========================================================================
   assets/js/markdown.js —— 极简 Markdown 渲染器（零依赖，可离线）
   --------------------------------------------------------------------------
   支持：# ## ### 标题、段落、- / * 无序列表、1. 有序列表、> 引用、
        ``` 代码块、`行内代码`、**粗体**、*斜体*、~~删除线~~、[链接](url)、--- 分隔线
   想换更强的解析器（如 marked.js）也可以，只要暴露同名函数 window.mdToHtml 即可。
   ========================================================================== */

(function () {
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /** 行内语法：先保护代码，再处理强调与链接 */
  function inline(raw) {
    var codes = [];
    var text = escapeHtml(raw);

    // 行内代码 `xxx`
    text = text.replace(/`([^`]+)`/g, function (m, c) {
      codes.push(c);
      return "\u0000CODE" + (codes.length - 1) + "\u0000";
    });

    // 链接 [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
      var safe = /^(https?:|mailto:|#|\/|\.\/)/i.test(href) ? href : "#";
      return '<a href="' + safe + '"' + (safe.charAt(0) !== "#" ? ' target="_blank" rel="noopener"' : "") + ">" + label + "</a>";
    });

    // 强调
    text = text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>");

    // 还原代码
    text = text.replace(/\u0000CODE(\d+)\u0000/g, function (m, i) {
      return "<code>" + codes[Number(i)] + "</code>";
    });

    return text;
  }

  window.mdToHtml = function (src) {
    if (!src) return "";
    var lines = String(src).replace(/\r\n/g, "\n").split("\n");
    var out = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      // 空行
      if (!line.trim()) { i++; continue; }

      // 分隔线
      if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { out.push("<hr />"); i++; continue; }

      // 代码块
      var fence = line.match(/^\s*```\s*(\w*)\s*$/);
      if (fence) {
        var buf = [];
        i++;
        while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++; // 跳过结束的 ```
        out.push("<pre><code>" + escapeHtml(buf.join("\n")) + "</code></pre>");
        continue;
      }

      // 标题
      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        var lv = Math.min(h[1].length, 3);
        out.push("<h" + lv + ">" + inline(h[2].trim()) + "</h" + lv + ">");
        i++;
        continue;
      }

      // 引用
      if (/^\s*>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          q.push(inline(lines[i].replace(/^\s*>\s?/, "")));
          i++;
        }
        out.push("<blockquote>" + q.join("<br />") + "</blockquote>");
        continue;
      }

      // 无序列表
      if (/^\s*[-*+]\s+/.test(line)) {
        var ul = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          ul.push("<li>" + inline(lines[i].replace(/^\s*[-*+]\s+/, "")) + "</li>");
          i++;
        }
        out.push("<ul>" + ul.join("") + "</ul>");
        continue;
      }

      // 有序列表
      if (/^\s*\d+[.)]\s+/.test(line)) {
        var ol = [];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          ol.push("<li>" + inline(lines[i].replace(/^\s*\d+[.)]\s+/, "")) + "</li>");
          i++;
        }
        out.push("<ol>" + ol.join("") + "</ol>");
        continue;
      }

      // 段落（连续非空行合并）
      var para = [];
      while (i < lines.length && lines[i].trim() &&
             !/^\s*(#{1,6}\s|>|```|[-*+]\s|\d+[.)]\s)/.test(lines[i]) &&
             !/^\s*(-{3,}|\*{3,})\s*$/.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      if (para.length) out.push("<p>" + inline(para.join(" ")) + "</p>");
    }

    return out.join("\n");
  };
})();
