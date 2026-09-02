# remark42.quartz

Quartz 5 component for [Remark42](https://remark42.com/) comments.

Originally written by [OCDkirby](https://github.com/OCDkirby/remark42.quartz)
for Quartz 4. This fork restructures it as a Quartz 5 plugin (a compatibility
break — see [Upstream](#upstream)) and adds one feature: comment threads can
be keyed by a stable frontmatter field instead of the page URL, so renaming a
page's slug doesn't orphan its comments.

## Installing

```sh
npx quartz plugin add https://github.com/cidus/remark42.quartz
npx quartz plugin enable remark42
```

Then configure it in `quartz.config.yaml`:

```yaml
plugins:
  - source: https://github.com/cidus/remark42.quartz
    enabled: true
    options:
      host: "https://comments.my-host.com"
      site_id: "remark"
      theme: "light"
      no_footer: true
    layout:
      position: afterBody
      priority: 10
```

For advanced use cases you can override in TypeScript:

```ts title="quartz.ts (override)"
import * as ExternalPlugin from "./.quartz/plugins"

ExternalPlugin.Remark42({
  host: "https://comments.my-host.com",
  site_id: "remark",
  theme: "light",
  no_footer: true,
})
```

## Usage

Configure the options below according to the
[Remark42 docs](https://remark42.com/docs/configuration/frontend/). The
component renders its own `<div id="remark42">`, so there's nothing to add to
your content or layout beyond enabling it.

A single-page comment thread can be hidden by setting `comments: false` in
that page's frontmatter.

## Options

| Option                     | Type                 | Default     | Description                                                             |
| --------------------------- | -------------------- | ----------- | ------------------------------------------------------------------------ |
| `host`                      | `string`              | -           | URL of your Remark42 instance.                                          |
| `site_id`                   | `string`              | -           | Your Remark42 site id.                                                  |
| `idField`                   | `string`              | `undefined` | Frontmatter field to use as the thread id instead of the page URL.      |
| `components`                | `string[]`            | `["embed"]` | Remark42 web components to load, e.g. `["embed", "last-comments"]`.     |
| `max_shown_comments`        | `number`              | -           | Max comments shown initially.                                           |
| `max_last_comments`         | `number`              | -           | Max comments shown in the `last-comments` component.                    |
| `theme`                     | `"light" \| "dark"`   | -           | Falls back to Quartz's `saved-theme` attribute and syncs on toggle.     |
| `page_title`                | `string`              | -           | Don't use this — it'll break your comment database.                     |
| `locale`                    | `string`              | -           | See the [locale list](https://remark42.com/docs/configuration/frontend/#locales). |
| `show_email_subscription`   | `boolean`             | -           | Show the email subscription option.                                     |
| `show_rss_subscription`     | `boolean`             | -           | Show the RSS subscription option.                                       |
| `simple_view`               | `boolean`             | -           | Use Remark42's simple view.                                             |
| `no_footer`                 | `boolean`             | -           | Hide the Remark42 footer.                                               |

### Stable comment identity (`idField`)

By default Remark42 keys a thread by the page's URL. If your site derives
slugs from something that can change (a title, for example), editing that
field changes the URL and silently orphans the existing thread.

If your content already carries a stable id in frontmatter, point `idField`
at it:

```yaml
options:
  host: "https://comments.my-host.com"
  site_id: "remark"
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

## Upstream

This is a restructuring of the whole plugin for Quartz 5 and breaks
compatibility with the original Quartz 4 version. If you're looking for the
Quartz 4 plugin, see [OCDkirby/remark42.quartz](https://github.com/OCDkirby/remark42.quartz).

## License

MIT — see [LICENSE](./LICENSE). Original work by OCDkirby.
