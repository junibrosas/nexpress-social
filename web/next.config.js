const path = require('path');
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');;

const domain = 'http://localhost:4000';

const nextConfig = {
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  publicRuntimeConfig: {
    api: {
      endpoint: `${domain}/api`
    }
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.modules = [
      path.resolve(__dirname, ''),
      'node_modules'
    ];

    return config;
  }
}

module.exports = withPlugins([
  withTypescript,
  withCSS,
  withFonts,
  withImages,
], nextConfig)