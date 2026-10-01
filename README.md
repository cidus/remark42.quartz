# remark42.quartz

Self-hosted, privacy-friendly comments for Quartz 5 sites, powered by Remark42. Adds a comment thread below each page, follows Quartz's light/dark theme and SPA navigation, can be turned off per page from frontmatter, and can key threads by a stable frontmatter id so renaming a page never orphans its comments.

Originally written by [OCDkirby](https://github.com/OCDkirby/remark42.quartz)
for Quartz 4. This fork restructures it as a Quartz 5 plugin (a compatibility
break — see [Upstream](#upstream)) and adds the stable thread id
([`idField`](#stable-comment-identity-idfield)).

You need a running [Remark42](https://remark42.com/) server; this plugin only
embeds it.

## Installing

```sh
npx quartz plugin add github:cidus/remark42.quartz
npx quartz plugin enable remark42.quartz
```

The plugin ships disabled (`defaultEnabled: false`) because it does nothing
useful until `host` and `site_id` point at your Remark42 server — hence the
`enable` step.

Quartz's plugin loader (`parsePluginSource`) only accepts a handful of
`source:` formats — notably **not** a bare npm package name, even if the
package is already in `node_modules`:

```yaml
- source: "quartz-plugin-remark42" # Error: Cannot parse plugin source
```

What works:

```yaml
- source: "github:cidus/remark42.quartz" # GitHub shorthand
- source: "https://github.com/cidus/remark42.quartz" # full URL, same thing
- source: "/home/you/git/github/remark42.quartz" # local path, for plugin development
```

A full working example, since this plugin is a component and needs the
`layout:` block:

```yaml
plugins:
  - source: "github:cidus/remark42.quartz"
    enabled: true
    options:
      host: "https://comments.example.com"
      site_id: "mysite"
      theme: "light"
      no_footer: true
    layout:
      position: afterBody
      priority: 10
```

For advanced use cases you can override in TypeScript:

```ts title="quartz.ts (override)"
import * as ExternalPlugin from "./.quartz/plugins";

ExternalPlugin.Remark42({
  host: "https://comments.example.com",
  site_id: "mysite",
  theme: "light",
  no_footer: true,
});
```

## Usage

Configure the options below according to the
[Remark42 docs](https://remark42.com/docs/configuration/frontend/). At minimum
set `host` and `site_id`. The component renders its own `<div id="remark42">`,
so there's nothing to add to your content or layout beyond enabling it.

A single-page comment thread can be hidden by setting `comments: false` in
that page's frontmatter.

## Options

| Option                    | Type                | Default     | Description                                                                       |
| ------------------------- | ------------------- | ----------- | --------------------------------------------------------------------------------- |
| `host`                    | `string`            | placeholder | URL of your Remark42 instance. **Required.**                                      |
| `site_id`                 | `string`            | `"remark"`  | Your Remark42 site id (Remark42's own default is `remark`).                       |
| `idField`                 | `string`            | -           | Frontmatter field to use as the thread id instead of the page URL.                |
| `components`              | `string[]`          | `["embed"]` | Remark42 web components to load, e.g. `["embed", "last-comments"]`.               |
| `max_shown_comments`      | `number`            | -           | Max comments shown initially.                                                     |
| `max_last_comments`       | `number`            | -           | Max comments shown in the `last-comments` component.                              |
| `theme`                   | `"light" \| "dark"` | -           | Unset: follows Quartz's current theme. Either way, syncs on the dark-mode toggle. |
| `page_title`              | `string`            | -           | Don't use this — it'll break your comment database.                               |
| `locale`                  | `string`            | -           | See the [locale list](https://remark42.com/docs/configuration/frontend/#locales). |
| `show_email_subscription` | `boolean`           | -           | Show the email subscription option.                                               |
| `show_rss_subscription`   | `boolean`           | -           | Show the RSS subscription option.                                                 |
| `simple_view`             | `boolean`           | -           | Use Remark42's simple view.                                                       |
| `no_footer`               | `boolean`           | `true`      | Hide the Remark42 footer.                                                         |

### Default identity: the page URL

Without `idField`, the thread id is `window.location.origin + pathname` —
deliberately dropping the query string and hash, so `?utm_source=x` or
`#section` can't fork one page into several separate comment threads.

### Stable comment identity (`idField`)

By default Remark42 keys a thread by the page's URL. If your site derives
slugs from something that can change (a title, for example), editing that
field changes the URL and silently orphans the existing thread.

If your content already carries a stable id in frontmatter, point `idField`
at it:

```yaml
options:
  host: "https://comments.example.com"
  site_id: "mysite"
  idField: "my_stable_id"
```

```yaml
---
title: A Page Whose Title May Change
my_stable_id: 01K5A00000000000000000EXAMPLE
---
```

The comment thread then stays attached to `my_stable_id`, independent of the
page's URL. Leave `idField` unset to keep the default (page URL) behavior.

**Caveat — the "last comments" widget.** Remark42's `last-comments` component
builds each comment's link by concatenating the thread id directly into an
`href` (`` `${url}#${anchor}` ``). That's fine for the comment thread itself,
which works correctly with any opaque id, but if the id isn't a URL the
"last comments" widget produces a dead relative link like
`href="01K5A0...#comment-abc"` that resolves against whatever page it's
embedded on. This only affects that optional widget.

If you need both a stable id _and_ working "last comments" links, there's no
built-in option for it yet — the shape would be: emit a redirect page at
`/id/<value>` (e.g. via `@quartz-community/alias-redirects`, driven from an
`aliases` frontmatter entry) and give this plugin an option to prefix the
`idField` value with the site's base URL so it resolves to that redirect.

## Developing this plugin

The project follows the
[Quartz community plugin template](https://github.com/quartz-community/plugin-template):

```
src/
├── index.ts                         # entry point (exports Remark42)
├── types.ts                         # re-exported types (./types subpath)
├── components/
│   ├── index.ts                     # ./components subpath
│   ├── Remark42.tsx                 # the component (server-rendered)
│   └── scripts/remark42.inline.ts   # client script, bundled into a string
├── util/lang.ts
└── build/validate-manifest.ts       # warns about an incomplete `quartz` manifest
test/remark42.test.ts
```

```sh
npm install
npm run check   # typecheck + lint + format + test
npm run build   # writes dist/
```

`dist/` is committed on purpose: Quartz detects the pre-built output and skips
the install/build step when the plugin is added. Run `npm run build` and
commit `dist/` together with any change to `src/`.

When Quartz does have to build the plugin (a working copy without `dist/`, for
example), note that `npx quartz plugin add <source> --verbose` **exits 0 even
when the plugin's own build fails** — it prints `✗ <name>: build failed` in
the middle of otherwise-successful-looking output. Always read the output; don't trust the
exit code.

## Upstream

This is a restructuring of the whole plugin for Quartz 5 and breaks
compatibility with the original Quartz 4 version. If you're looking for the
Quartz 4 plugin, see [OCDkirby/remark42.quartz](https://github.com/OCDkirby/remark42.quartz).

## License

MIT — see [LICENSE](./LICENSE). Original work by OCDkirby.
