const path = require('path');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const env = require('./config/config');

console.warn(env.API);
console.warn('.....');

const nextConfig = {
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  publicRuntimeConfig: {
    api: {
      endpoint: `${env.API}/api`,
    },
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.modules = [path.resolve(__dirname, ''), 'node_modules'];

    return config;
  },
};

module.exports = withPlugins([withCSS, withFonts, withImages], nextConfig);
