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
			// 默认是由Google Fonts提供，但是不稳定容易出错（挂梯？）
			provider: "google", // "google","bunny","fontshare"
			fonts: {
				sans: ["Webfont", "Noto Serif SC"],
				mono: "JetBrains Mono",
			},
		}),
	],
})
