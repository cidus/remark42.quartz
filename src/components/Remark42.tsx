import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

// Configuration documented at https://remark42.com/docs/configuration/frontend/
export interface Remark42Options {
  host: string
  site_id: string
  /**
   * Name of a frontmatter field whose value is used as the Remark42 thread
   * id, instead of the page URL. Set this when slugs can change (e.g. a
   * title-derived slug) so existing comment threads aren't orphaned.
   */
  idField?: string
  components?: string[]
  max_shown_comments?: number
  max_last_comments?: number
  theme?: "light" | "dark"
  page_title?: string // Don't use this, it'll break your comment database. It's included for the sake of completeness.
  locale?: string // Technically an enum, full list at https://remark42.com/docs/configuration/frontend/#locales
  show_email_subscription?: boolean
  show_rss_subscription?: boolean
  simple_view?: boolean
  no_footer?: boolean
}

function classNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ")
}

function boolToStringBool(b?: boolean): string | undefined {
  return b === undefined ? undefined : b ? "1" : "0"
}

// Runs client-side. Reads its config from the #remark42 element's data-*
// attributes, which the component below renders per-page at build time —
// that's how a stable thread id (from frontmatter) or the default page URL
// reaches the browser.
const remark42Script = `
(function () {
  var scriptsLoaded = false
  var instance

  function boolAttr(v) {
    return v === undefined ? undefined : v === "1"
  }

  function buildConfig(el) {
    var cfg = { host: el.dataset.host, site_id: el.dataset.siteId }
    if (el.dataset.maxShownComments) cfg.max_shown_comments = Number(el.dataset.maxShownComments)
    if (el.dataset.maxLastComments) cfg.max_last_comments = Number(el.dataset.maxLastComments)
    if (el.dataset.pageTitle) cfg.page_title = el.dataset.pageTitle
    if (el.dataset.locale) cfg.locale = el.dataset.locale
    if (el.dataset.showEmailSubscription) cfg.show_email_subscription = boolAttr(el.dataset.showEmailSubscription)
    if (el.dataset.showRssSubscription) cfg.show_rss_subscription = boolAttr(el.dataset.showRssSubscription)
    if (el.dataset.simpleView) cfg.simple_view = boolAttr(el.dataset.simpleView)
    if (el.dataset.noFooter) cfg.no_footer = boolAttr(el.dataset.noFooter)
    cfg.theme = el.dataset.theme || document.documentElement.getAttribute("saved-theme") || undefined
    cfg.url = el.dataset.threadId || (window.location.origin + window.location.pathname)
    return cfg
  }

  function loadScripts(el) {
    var host = el.dataset.host
    var components = (el.dataset.components || "embed").split(",")
    for (var i = 0; i < components.length; i++) {
      var script = document.createElement("script")
      script.src = host + "/web/" + components[i] + ".js"
      script.async = true
      document.head.appendChild(script)
    }
  }

  function initRemark42() {
    var el = document.getElementById("remark42")
    if (!el) return

    window.remark_config = buildConfig(el)

    if (!scriptsLoaded) {
      // The first script load reads window.remark_config itself and self-inits.
      scriptsLoaded = true
      loadScripts(el)
    } else if (window.REMARK42) {
      if (instance) instance.destroy()
      instance = window.REMARK42.createInstance(window.remark_config)
    }
  }

  document.addEventListener("nav", initRemark42)
  document.addEventListener("render", initRemark42)

  document.addEventListener("click", function (e) {
    var toggle = e.target && e.target.closest && e.target.closest("#darkmode-toggle")
    if (!toggle || !window.REMARK42) return
    var currentTheme = document.documentElement.getAttribute("saved-theme")
    if (currentTheme) window.REMARK42.changeTheme(currentTheme)
  })
})()
`

export default ((opts?: Remark42Options) => {
  const Remark42: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const commentsOverride = fileData.frontmatter?.comments
    if (commentsOverride === false || commentsOverride === "false" || !opts) {
      return null
    }

    const threadId = opts.idField
      ? (fileData.frontmatter?.[opts.idField] as string | undefined)
      : undefined

    return (
      <div
        id="remark42"
        class={classNames(displayClass)}
        data-host={opts.host}
        data-site-id={opts.site_id}
        data-components={(opts.components ?? ["embed"]).join(",")}
        data-max-shown-comments={opts.max_shown_comments}
        data-max-last-comments={opts.max_last_comments}
        data-theme={opts.theme}
        data-page-title={opts.page_title}
        data-locale={opts.locale}
        data-show-email-subscription={boolToStringBool(opts.show_email_subscription)}
        data-show-rss-subscription={boolToStringBool(opts.show_rss_subscription)}
        data-simple-view={boolToStringBool(opts.simple_view)}
        data-no-footer={boolToStringBool(opts.no_footer)}
        data-thread-id={threadId}
      />
    )
  }

  Remark42.afterDOMLoaded = remark42Script

  return Remark42
}) satisfies QuartzComponentConstructor<Remark42Options>
