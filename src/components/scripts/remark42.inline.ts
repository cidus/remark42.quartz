/* eslint-disable no-restricted-syntax -- the document-level listeners below are registered once per
   full page load and must survive SPA navigations, so they are deliberately not passed to
   window.addCleanup (which runs on every navigation). */

// Runs client-side. Reads its config from the #remark42 element's data-*
// attributes, which the component renders per-page at build time — that's how
// a stable thread id (from frontmatter) or the default page URL reaches the
// browser.

type Remark42Config = {
  host?: string;
  site_id?: string;
  url?: string;
  max_shown_comments?: number;
  max_last_comments?: number;
  page_title?: string;
  locale?: string;
  show_email_subscription?: boolean;
  show_rss_subscription?: boolean;
  simple_view?: boolean;
  no_footer?: boolean;
  theme?: string;
};

type Remark42Instance = { destroy?: () => void };

type Remark42Global = {
  createInstance?: (config: Remark42Config) => Remark42Instance;
  destroy?: () => void;
  changeTheme?: (theme: string) => void;
};

declare global {
  interface Window {
    REMARK42?: Remark42Global;
    remark_config?: Remark42Config;
  }
}

(function () {
  let scriptsLoaded = false;
  let scriptsRetried = false;
  let instance: Remark42Instance | undefined;

  function boolAttr(v: string | undefined): boolean | undefined {
    return v === undefined ? undefined : v === "1";
  }

  function root(): HTMLElement | null {
    return document.getElementById("remark42");
  }

  function buildConfig(el: HTMLElement): Remark42Config {
    const d = el.dataset;
    const cfg: Remark42Config = { host: d.host, site_id: d.siteId };
    if (d.maxShownComments) cfg.max_shown_comments = Number(d.maxShownComments);
    if (d.maxLastComments) cfg.max_last_comments = Number(d.maxLastComments);
    if (d.pageTitle) cfg.page_title = d.pageTitle;
    if (d.locale) cfg.locale = d.locale;
    if (d.showEmailSubscription) cfg.show_email_subscription = boolAttr(d.showEmailSubscription);
    if (d.showRssSubscription) cfg.show_rss_subscription = boolAttr(d.showRssSubscription);
    if (d.simpleView) cfg.simple_view = boolAttr(d.simpleView);
    if (d.noFooter) cfg.no_footer = boolAttr(d.noFooter);
    cfg.theme = d.theme || document.documentElement.getAttribute("saved-theme") || undefined;
    cfg.url = d.threadId || window.location.origin + window.location.pathname;
    return cfg;
  }

  function loadScripts(el: HTMLElement) {
    const host = el.dataset.host;
    const components = (el.dataset.components || "embed").split(",");
    let pending = components.length;
    for (const component of components) {
      const script = document.createElement("script");
      script.src = host + "/web/" + component + ".js";
      script.async = true;
      script.onload = function () {
        if (--pending === 0) ensureMounted();
      };
      script.onerror = function () {
        // A single failed request (a cold tunnel, a dropped connection on the
        // first hit of a session) would otherwise leave the thread missing
        // until the visitor reloads by hand. Retry once, then give up.
        pending = 0;
        if (scriptsRetried) return;
        scriptsRetried = true;
        scriptsLoaded = false;
        setTimeout(initRemark42, 1000);
      };
      document.head.appendChild(script);
    }
  }

  // Tear the widget down while its instance is still the one REMARK42 exposes.
  // Every createInstance() overwrites window.REMARK42.destroy, so an instance
  // left running across a navigation can never be reached again -- and it keeps
  // a "message" listener that, on the next instance's "inited", empties every
  // child of the comments node except its own (by then removed) iframe. Since
  // the node itself survives Quartz's DOM patch, that wipes the iframe the new
  // instance had just mounted, which is why comments vanished after an
  // in-place navigation and came back on a full reload.
  function teardown() {
    try {
      if (instance && instance.destroy) instance.destroy();
      else if (window.REMARK42 && window.REMARK42.destroy) window.REMARK42.destroy();
    } catch (_e) {
      // A widget that fails to tear down must not break navigation.
    }
    instance = undefined;
  }

  function createInstance() {
    teardown();
    instance = window.REMARK42?.createInstance?.(window.remark_config!);
  }

  // Runs once the embed scripts are in. embed.js normally mounts itself from
  // window.remark_config, but only if the root node was in the document at the
  // moment it ran and its config was already set. If it wasn't, nothing else
  // will ever retry, so check for the iframe and mount explicitly.
  function ensureMounted() {
    const el = root();
    if (!el || !window.REMARK42 || !window.REMARK42.createInstance) return;
    if (el.querySelector("iframe")) return;
    window.remark_config = buildConfig(el);
    createInstance();
  }

  function initRemark42() {
    const el = root();
    if (!el) return;

    window.remark_config = buildConfig(el);

    if (!scriptsLoaded) {
      // The first script load reads window.remark_config itself and self-inits.
      scriptsLoaded = true;
      loadScripts(el);
    } else if (window.REMARK42) {
      createInstance();
    }
  }

  // Quartz fires "prenav" before it patches the DOM, which is the last moment
  // the running instance can still be destroyed cleanly.
  document.addEventListener("prenav", teardown);
  document.addEventListener("nav", initRemark42);
  document.addEventListener("render", initRemark42);

  // Quartz fires "nav" from its SPA router, which is loaded after this script.
  // Don't depend on winning that race: the root node is server-rendered, so if
  // it is already here there is nothing to wait for, and mounting now also puts
  // the request for embed.js in flight sooner. Later "nav" events still fire
  // and are idempotent.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRemark42, { once: true });
  } else {
    initRemark42();
  }

  document.addEventListener("click", function (e) {
    const target = e.target as Element | null;
    const toggle = target && target.closest && target.closest("#darkmode-toggle");
    if (!toggle || !window.REMARK42) return;
    const currentTheme = document.documentElement.getAttribute("saved-theme");
    if (currentTheme) window.REMARK42.changeTheme?.(currentTheme);
  });
})();

export {};
