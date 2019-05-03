const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');;

const nextConfig = {
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
}

module.exports = withPlugins([
  withTypescript,
  withCSS,
  withFonts,
  withImages,
], nextConfig)