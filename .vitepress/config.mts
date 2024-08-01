import { defineConfig } from "vitepress";
import AutoSidebar from "vite-plugin-vitepress-auto-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "陈适时",
  description: "aasd",
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
        collapsed: true,
        ignoreList: [".obsidian", ".git", "node_modules"],
        sideBarResolved: (v) => {
          v["/docs/"][0].items.sort((a, b) => {
            return a.text.localeCompare(b.text, undefined, { numeric: true });
          });
          return v;
        },
      }),
    ],
  },
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/favicon.ico",
    socialLinks: [
      {
        link: "https://juejin.cn/user/1698079717464174",
        icon: {
          svg: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="32.000000pt" height="32.000000pt" viewBox="0 0 32.000000 32.000000" preserveAspectRatio="xMidYMid meet"> 
                  <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path d="M140 265 c-10 -12 -9 -16 4 -21 9 -3 23 -3 32 0 13 5 14 9 4 21 -16 19 -24 19 -40 0z"/>
                    <path d="M77 213 c-3 -5 15 -23 39 -42 l44 -33 44 33 c25 20 41 38 36 43 -5 5 -22 -2 -40 -18 -39 -32 -41 -32 -78 -1 -32 27 -38 29 -45 18z"/>
                    <path d="M17 164 c-3 -4 27 -33 68 -66 l75 -58 75 59 c42 33 71 62 65 66 -6 3 -40 -17 -75 -45 l-65 -52 -64 51 c-67 54 -69 55 -79 45z"/>
                  </g>
                </svg>
                `,
        },
        // 也可以为无障碍添加一个自定义标签 (可选但推荐):
        ariaLabel: "cool link",
      },
      { icon: "github", link: "https://github.com/Itkeytome" },
    ],
    sidebar: [],
    nav: [{ text: "掘金 JueJin", link: "https://github.com/..." }],
  },
});
