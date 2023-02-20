import "@unocss/reset/tailwind.css"
import "uno.css"
import "./styles/main.css"

import App from "./App.vue"
import autoRoutes from "pages-generated"
import { ViteSSG } from "vite-ssg"
import NProgress from "nprogress"

import dayjs from "dayjs"
import LocalizedFormat from "dayjs/plugin/localizedFormat"

const routes = autoRoutes.map((i) => {
	return {
		...i,
		alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
	}
})

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
	return savedPosition || { top: 0 }
}

export const createApp = ViteSSG(
	App,
	{
		routes,
		scrollBehavior,
	},
	({ router, isClient }) => {
		dayjs.extend(LocalizedFormat)

		if (isClient) {
			router.beforeEach(() => {
				NProgress.start()
			})
			router.afterEach(() => {
				NProgress.done()
			})
		}
	}
)
