import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
	presetWebFonts,
} from "unocss"

export default defineConfig({
	presets: [
		presetIcons({
			extraProperties: {
				display: "inline-block",
				height: "1.2em",
				width: "1.2em",
				"vertical-align": "text-bottom",
			},
		}),
		presetUno(),
		presetAttributify(),
		presetWebFonts({
			provider: "google",
			fonts: {
				sans: ["Noto Serif SC"],
			},
		}),
	],
})
