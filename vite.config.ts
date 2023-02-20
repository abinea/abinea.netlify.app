import { defineConfig } from "vite"
import { resolve } from "path"
import vue from "@vitejs/plugin-vue"

import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import UnoCss from "unocss/vite"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"

import Pages from "vite-plugin-pages"
import fs from "fs-extra"
import matter from "gray-matter"

import { remove } from "diacritics"
import Markdown from "vite-plugin-vue-markdown"
import Shiki from "markdown-it-shiki"
import Anchor from "markdown-it-anchor"
import LinkAttributes from "markdown-it-link-attributes"
// @ts-expect-error missing types
import TOC from "markdown-it-table-of-contents"

export default defineConfig({
	resolve: {
		alias: {
			"~/": `${resolve(__dirname, "./src")}/`,
		},
	},
	plugins: [
		vue(),
		UnoCss(),
		AutoImport({
			imports: ["vue", "vue-router", "@vueuse/core", "@vueuse/head"],
		}),
		Components({
			dts: true,
			extensions: ["vue", "md"],
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
			resolvers: [
				IconsResolver({
					prefix: "",
				}),
			],
		}),
		Icons({
			defaultClass: "inline",
			defaultStyle: "vertical-align: sub;",
		}),
		Pages({
			extensions: ["vue", "md"],
			pagesDir: "pages",
			extendRoute(route) {
				const path = resolve(__dirname, route.component.slice(1))

				if (!path.includes("projects.md") && path.endsWith(".md")) {
					const md = fs.readFileSync(path, "utf-8")
					const { data } = matter(md)
					route.meta = Object.assign(route.meta || {}, {
						frontmatter: data,
					})
				}
				return route
			},
		}),

		Markdown({
			wrapperComponent: "post",
			wrapperClasses: "prose m-auto",
			headEnabled: true,
			markdownItOptions: {
				quotes: "\"\"''",
			},
			markdownItSetup(md) {
				md.use(Shiki, {
					theme: "github-dark-dimmed",
				})
				md.use(Anchor, {
					slugify,
					permalink: Anchor.permalink.linkInsideHeader({
						symbol: "#",
						renderAttrs: () => ({ "aria-hidden": "true" }),
					}),
				})

				md.use(LinkAttributes, {
					matcher: (link: string) => /^https?:\/\//.test(link),
					attrs: {
						target: "_blank",
						rel: "noopener",
					},
				})

				md.use(TOC, {
					includeLevel: [1, 2, 3],
				})
			},
		}),
	],

	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				if (warning.code === "UNUSED_EXTERNAL_IMPORT") {
					// Use default for everything else
					warn(warning)
				}
			},
		},
	},
})

export const slugify = (str: string): string => {
	const rControl = /[\u0000-\u001F]/g
	const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g
	return (
		remove(str)
			// Remove control characters
			.replace(rControl, "")
			// Replace special characters
			.replace(rSpecial, "-")
			// Remove continuos separators
			.replace(/-{2,}/g, "-")
			// Remove prefixing and trailing separtors
			.replace(/^-+|-+$/g, "")
			// ensure it doesn't start with a number (#121)
			.replace(/^(\d)/, "_$1")
			// lowercase
			.toLowerCase()
	)
}
