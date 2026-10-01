import { createRequire } from 'module';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/scripts/remark42.inline.ts
var remark42_inline_default = '(function(){let c=!1,d=!1,o;function a(n){return n===void 0?void 0:n==="1"}function m(){return document.getElementById("remark42")}function l(n){let e=n.dataset,t={host:e.host,site_id:e.siteId};return e.maxShownComments&&(t.max_shown_comments=Number(e.maxShownComments)),e.maxLastComments&&(t.max_last_comments=Number(e.maxLastComments)),e.pageTitle&&(t.page_title=e.pageTitle),e.locale&&(t.locale=e.locale),e.showEmailSubscription&&(t.show_email_subscription=a(e.showEmailSubscription)),e.showRssSubscription&&(t.show_rss_subscription=a(e.showRssSubscription)),e.simpleView&&(t.simple_view=a(e.simpleView)),e.noFooter&&(t.no_footer=a(e.noFooter)),t.theme=e.theme||document.documentElement.getAttribute("saved-theme")||void 0,t.url=e.threadId||window.location.origin+window.location.pathname,t}function w(n){let e=n.dataset.host,t=(n.dataset.components||"embed").split(","),s=t.length;for(let h of t){let r=document.createElement("script");r.src=e+"/web/"+h+".js",r.async=!0,r.onload=function(){--s===0&&g()},r.onerror=function(){s=0,!d&&(d=!0,c=!1,setTimeout(i,1e3))},document.head.appendChild(r)}}function u(){try{o&&o.destroy?o.destroy():window.REMARK42&&window.REMARK42.destroy&&window.REMARK42.destroy()}catch{}o=void 0}function f(){u(),o=window.REMARK42?.createInstance?.(window.remark_config)}function g(){let n=m();!n||!window.REMARK42||!window.REMARK42.createInstance||n.querySelector("iframe")||(window.remark_config=l(n),f())}function i(){let n=m();n&&(window.remark_config=l(n),c?window.REMARK42&&f():(c=!0,w(n)))}document.addEventListener("prenav",u),document.addEventListener("nav",i),document.addEventListener("render",i),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i,{once:!0}):i(),document.addEventListener("click",function(n){let e=n.target;if(!(e&&e.closest&&e.closest("#darkmode-toggle"))||!window.REMARK42)return;let s=document.documentElement.getAttribute("saved-theme");s&&window.REMARK42.changeTheme?.(s)})})();\n';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  return l.vnode && l.vnode(l2), l2;
}

// src/components/Remark42.tsx
function boolToStringBool(b2) {
  return b2 === void 0 ? void 0 : b2 ? "1" : "0";
}
var Remark42_default = ((opts) => {
  const Remark42 = ({ displayClass, fileData }) => {
    const commentsOverride = fileData.frontmatter?.comments;
    if (commentsOverride === false || commentsOverride === "false" || !opts) {
      return null;
    }
    const threadId = opts.idField ? fileData.frontmatter?.[opts.idField] : void 0;
    return /* @__PURE__ */ u2(
      "div",
      {
        id: "remark42",
        class: classNames(displayClass),
        "data-host": opts.host,
        "data-site-id": opts.site_id,
        "data-components": (opts.components ?? ["embed"]).join(","),
        "data-max-shown-comments": opts.max_shown_comments,
        "data-max-last-comments": opts.max_last_comments,
        "data-theme": opts.theme,
        "data-page-title": opts.page_title,
        "data-locale": opts.locale,
        "data-show-email-subscription": boolToStringBool(opts.show_email_subscription),
        "data-show-rss-subscription": boolToStringBool(opts.show_rss_subscription),
        "data-simple-view": boolToStringBool(opts.simple_view),
        "data-no-footer": boolToStringBool(opts.no_footer),
        "data-thread-id": threadId
      }
    );
  };
  Remark42.afterDOMLoaded = remark42_inline_default;
  return Remark42;
});

export { Remark42_default as Remark42 };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map