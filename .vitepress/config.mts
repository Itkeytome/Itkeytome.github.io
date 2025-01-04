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
    sidebar: [],
    nav: [
      { text: "掘金 JueJin", link: "https://juejin.cn/user/1698079717464174" },
    ],
    // 右侧页面导航栏配置
    outlineTitle: "页面导航",
    outline: [2, 6], // 定义标题级别,字符串"deep"相当于是[2,6]
    // 搜索框配置
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
  markdown: {
    toc: {},
    lineNumbers: true,
  },
});
