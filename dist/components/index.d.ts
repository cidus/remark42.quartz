import { QuartzComponent } from '@quartz-community/types';

interface Remark42Options {
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
    page_title?: string;
    locale?: string;
    show_email_subscription?: boolean;
    show_rss_subscription?: boolean;
    simple_view?: boolean;
    no_footer?: boolean;
}
declare const _default: (opts?: Remark42Options) => QuartzComponent;

export { _default as Remark42, type Remark42Options };
