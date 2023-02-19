import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import UnoCss from "unocss/vite"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"

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
			imports: ["vue", "vue-router"],
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
