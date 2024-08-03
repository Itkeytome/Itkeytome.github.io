import { defineConfig } from "vitepress";
import AutoSidebar from "vite-plugin-vitepress-auto-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "陈适时: Blog",
  description: "想多了都是问题，做多了都是答案",
  head: [
    [
      "link",
      {
        type: "image/x-icon",
        rel: "shortcut icon",
        href: "https://yomionly.com/picture/favicon.ico",
      },
    ],
  ],
  vite: {
    plugins: [
      AutoSidebar({
        path: ".",
        collapsed: false,
        ignoreList: [".obsidian", ".git", "node_modules", ".github", "public"],
        sideBarResolved: (v) => {
          v["/docs/"][0].items.sort(
            (a: { text: string }, b: { text: string }) => {
              return a.text.localeCompare(b.text, undefined, { numeric: true });
            }
          );
          return v["/docs/"][0].items;
        },
      }),
    ],
  },
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",
    socialLinks: [{ icon: "github", link: "https://github.com/Itkeytome" }],
    sidebar: [
      {
        text: "Section Title A",
        items: [
          { text: "Item A", link: "/item-a" },
          { text: "Item B", link: "/item-b" },
        ],
        collapsed: false,
      },
      {
        text: "Section Title B",
        items: [
          { text: "Item C", link: "/item-c" },
          { text: "Item D", link: "/item-d" },
        ],
        collapsed: false,
      },
    ],
    nav: [
      { text: "掘金 JueJin", link: "https://juejin.cn/user/1698079717464174" },
    ],
  },
  markdown: {
    toc: {},
  },
});
