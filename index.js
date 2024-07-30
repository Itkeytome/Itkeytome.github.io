const fs = require("fs");
const path = require("path");

const docsDir = path.resolve(__dirname, "docs");
const configFilePath = path.resolve(__dirname, ".vitepress/config.mts");

function updateLinks(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const updatedContent = content.replace(
    /https:\/\/(p\d)-juejin/g,
    "https://image.baidu.com/search/down?url=https://$1-juejin"
  );
  fs.writeFileSync(filePath, updatedContent, "utf-8");
}

function generateSidebar(dir, base = "") {
  let sidebar = [];
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subSidebar = generateSidebar(fullPath, path.join(base, item));
      sidebar.push(...subSidebar);
    } else if (item.endsWith(".md")) {
      const name = item.replace(/\.md$/, "");
      const link = path.join(base, name).replace(/\\/g, "/");
      sidebar.push({ text: name, link: `/docs/${link}` });
      // Update links in the Markdown file
      updateLinks(fullPath);
    }
  });

  sidebar = sidebar.sort((a, b) =>
    a.text.localeCompare(b.text, undefined, { numeric: true })
  );

  return sidebar;
}

function updateConfigFile(sidebar) {
  const configContent = `import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Nest 通关秘籍",
  description: "aasd",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    sidebar: ${JSON.stringify(sidebar, null, 2)},

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
`;

  fs.writeFileSync(configFilePath, configContent, "utf-8");
}

const sidebar = generateSidebar(docsDir);
updateConfigFile(sidebar);

console.log("Sidebar configuration has been written to .vitepress/config.mts");
