import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/remark42.inline.ts";

// Configuration documented at https://remark42.com/docs/configuration/frontend/
export interface Remark42Options {
  host: string;
  site_id: string;
  /**
   * Name of a frontmatter field whose value is used as the Remark42 thread
   * id, instead of the page URL. Set this when slugs can change (e.g. a
   * title-derived slug) so existing comment threads aren't orphaned.
   */
  idField?: string;
  components?: string[];
  max_shown_comments?: number;
  max_last_comments?: number;
  theme?: "light" | "dark";
  page_title?: string; // Don't use this, it'll break your comment database. It's included for the sake of completeness.
  locale?: string; // Technically an enum, full list at https://remark42.com/docs/configuration/frontend/#locales
  show_email_subscription?: boolean;
  show_rss_subscription?: boolean;
  simple_view?: boolean;
  no_footer?: boolean;
}

function boolToStringBool(b?: boolean): string | undefined {
  return b === undefined ? undefined : b ? "1" : "0";
}

export default ((opts?: Remark42Options) => {
  const Remark42: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const commentsOverride = fileData.frontmatter?.comments;
    if (commentsOverride === false || commentsOverride === "false" || !opts) {
      return null;
    }

    const threadId = opts.idField
      ? (fileData.frontmatter?.[opts.idField] as string | undefined)
      : undefined;

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
    );
  };

  Remark42.afterDOMLoaded = script;

  return Remark42;
}) satisfies QuartzComponentConstructor<Remark42Options>;
