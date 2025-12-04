import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devServer: { port: parseInt(process.env.NUXT_PORT || "5173") },
	devtools: { enabled: true },

	ssr: true,
	routeRules: {
		"/admin/**": { ssr: false },
		"/user/**": { ssr: false },
		"/login": { ssr: false },
		"/register": { ssr: false },
	},

	runtimeConfig: {
		public: {
			apiBase: process.env.NUXT_API_URL,
		},
	},

	modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "shadcn-nuxt", "@vueuse/nuxt", "nuxt-svgo", "@pinia/nuxt", "nuxt-security"],

	css: ["~/assets/css/tailwind.css"],
	vite: {
		plugins: [tailwindcss()],
	},

	icon: {
		mode: "css",
		cssLayer: "base",
	},

	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./app/components/ui"
		 */
		componentDir: "./app/components/ui",
	},

	fonts: {
		defaults: {
			weights: [400, 500, 600, 700, 800, 900],
		},
	},

	security: {
		sri: false,
		ssg: {
			hashScripts: false,
		},

		headers: {
			contentSecurityPolicy: {
				"default-src": ["'self'"],
				"worker-src": ["'self'", "blob:"],
				"child-src": ["'self'", "blob:"],

				"connect-src": ["'self'", "https://stankom.fanreza.my.id", "https://vokasi.fanreza.my.id", "https://apistankom.kemnaker.go.id", "https://apisiapvokasi.kemnaker.go.id", "https://www.instagram.com", "https://i.instagram.com", "https://graph.instagram.com", "https://platform.twitter.com", "https://maps.googleapis.com"],

				"img-src": ["'self'", "data:", "blob:", "https://apistankom.kemnaker.go.id", "https://vokasi.fanreza.my.id", "https://apisiapvokasi.kemnaker.go.id", "https://storage.googleapis.com", "https://scontent.cdninstagram.com", "https://*.cdninstagram.com", "https://*.fbcdn.net", "https://maps.gstatic.com", "https://lh3.googleusercontent.com"],

				"script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.instagram.com", "https://static.cdninstagram.com", "https://platform.instagram.com", "https://platform.twitter.com", "https://www.google.com", "https://maps.googleapis.com", "https://maps.gstatic.com"],

				"style-src": ["'self'", "'unsafe-inline'", "https://www.instagram.com", "https://static.cdninstagram.com"],

				"frame-src": ["'self'", "https://www.instagram.com", "https://instagram.com", "https://platform.twitter.com", "https://www.google.com", "https://maps.googleapis.com", "https://maps.gstatic.com", "https://www.youtube.com", "https://*.instagram.com"],
			},

			crossOriginEmbedderPolicy: "unsafe-none",
			crossOriginResourcePolicy: "cross-origin",
			crossOriginOpenerPolicy: "unsafe-none",
		},
	},
});
