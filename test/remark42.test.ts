import { describe, it, expect, vi } from "vitest";
import Remark42 from "../src/components/Remark42";
import type { QuartzComponentProps } from "@quartz-community/types";

// The build turns the inline script into a string (see tsup.config.ts); under vitest it would be
// executed as a module instead, so stand in a string for it.
vi.mock("../src/components/scripts/remark42.inline.ts", () => ({ default: "/* remark42 */" }));

type Remark42Options = NonNullable<Parameters<typeof Remark42>[0]>;

const baseOpts: Remark42Options = {
  host: "https://comments.example.com",
  site_id: "mysite",
};

function buildProps(frontmatter: Record<string, unknown> = {}): QuartzComponentProps {
  return {
    ctx: {},
    externalResources: { css: [], js: [], additionalHead: [] },
    fileData: { frontmatter } as QuartzComponentProps["fileData"],
    cfg: {} as QuartzComponentProps["cfg"],
    children: [],
    tree: null,
    allFiles: [],
  } as unknown as QuartzComponentProps;
}

function render(opts: Remark42Options | undefined, frontmatter?: Record<string, unknown>) {
  const vnode = Remark42(opts)(buildProps(frontmatter)) as {
    type?: unknown;
    props?: Record<string, unknown>;
  } | null;
  return vnode;
}

describe("Remark42", () => {
  it("renders the #remark42 root with host and site id", () => {
    const vnode = render(baseOpts);
    expect(vnode?.type).toBe("div");
    expect(vnode?.props?.id).toBe("remark42");
    expect(vnode?.props?.["data-host"]).toBe("https://comments.example.com");
    expect(vnode?.props?.["data-site-id"]).toBe("mysite");
    expect(vnode?.props?.["data-components"]).toBe("embed");
  });

  it("attaches the client script", () => {
    expect(Remark42(baseOpts).afterDOMLoaded).toBe("/* remark42 */");
  });

  it("renders nothing without options", () => {
    expect(render(undefined)).toBeNull();
  });

  it.each([false, "false"])("renders nothing when frontmatter comments is %j", (value) => {
    expect(render(baseOpts, { comments: value })).toBeNull();
  });

  it("uses the idField frontmatter value as the thread id", () => {
    const vnode = render({ ...baseOpts, idField: "uid" }, { uid: "01K5A0" });
    expect(vnode?.props?.["data-thread-id"]).toBe("01K5A0");
  });

  it("leaves the thread id unset without idField", () => {
    const vnode = render(baseOpts, { uid: "01K5A0" });
    expect(vnode?.props?.["data-thread-id"]).toBeUndefined();
  });

  it("serializes booleans and component lists", () => {
    const vnode = render({
      ...baseOpts,
      components: ["embed", "last-comments"],
      no_footer: true,
      simple_view: false,
    });
    expect(vnode?.props?.["data-components"]).toBe("embed,last-comments");
    expect(vnode?.props?.["data-no-footer"]).toBe("1");
    expect(vnode?.props?.["data-simple-view"]).toBe("0");
    expect(vnode?.props?.["data-show-rss-subscription"]).toBeUndefined();
  });
});
