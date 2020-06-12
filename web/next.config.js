const path = require('path');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');

const API_URL = 'http://localhost:4000';

const nextConfig = {
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  publicRuntimeConfig: {
    api: {
      endpoint: `${API_URL}/api`,
    },
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.modules = [path.resolve(__dirname, ''), 'node_modules'];

    return config;
  },
};

module.exports = withPlugins([withCSS, withFonts, withImages], nextConfig);
