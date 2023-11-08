/** @type {import('next').NextConfig} */
const path = require("path");
const dotenv = require("dotenv");

const isProd = process.env.NODE_ENV === 'production';

if(isProd) {
	dotenv.config({ path: path.join(__dirname, '../../private_html/.env.local') });
}

const nextConfig = {
	assetPrefix: isProd ? "/app" : undefined,
    reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
		prependData: `@import "@/styles/variables.scss";`,
	},
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'stage.toddcokennel.com',
			port: '',
		  },
		  {
			protocol: 'https',
			hostname: 'toddcokennel.com',
			port: '',
		  },
		],
	  },
	  async redirects() {
		return [
			{
				source: '/app',
				destination: '/',
				basePath: false,
				permanent: false,
			},
			{
				source: '/app/about-us',
				destination: '/about-us',
				basePath: false,
				permanent: false,
			},
			{
				source: '/app/adoption-center',
				destination: '/adoption-center',
				basePath: false,
				permanent: false,
			},
			{
				source: '/app/kennel-tour',
				destination: '/kennel-tour',
				basePath: false,
				permanent: false,
			},
			{
				source: '/app/gallery',
				destination: '/gallery',
				basePath: false,
				permanent: false,
			},
		]
	  },
};

module.exports = nextConfig;
