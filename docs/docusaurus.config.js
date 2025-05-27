// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "hll-ircon",
  tagline: "Integrated RCON Client for HLL RCONv1 and RCONv2",
  favicon: "img/ircon-favicon.ico",

  // Set the production url of your site here
  url: "https://ircon.hllplanner.net",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "hllplanner", // Usually your GitHub org/user name.
  projectName: "hll-ircon", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/hllplanner/hll-ircon/tree/master/docs"
        },
        theme: {
          customCss: "./src/css/custom.css"
        }
      })
    ]
  ],

  themeConfig:
  /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/ircon-primary-logo.png",
      navbar: {
        logo: {
          alt: "HLL-IRCON",
          src: "img/ircon-primary-logo-transparent.png"
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Documentation"
          },
          {
            href: "https://github.com/hllplanner/hll-ircon",
            label: "GitHub",
            position: "right"
          }
        ]
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Tutorial",
                to: "/docs/getting-started"
              }
            ]
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/D3HaSRvUaJ"
              }
            ]
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/hllplanner/hll-ircon"
              }
            ]
          }
        ]
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      }
    })
};

export default config;
