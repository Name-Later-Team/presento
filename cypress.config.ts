import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportHeight:900,
    viewportWidth:1600,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium') {
          const browserWidth = 1980;
          const browserHeight = 1080;

          launchOptions.args.push('--start-fullscreen')
          launchOptions.args.push(`--window-size=${browserWidth},${browserHeight}`)
        }
        return launchOptions

      })
    },
    experimentalStudio: true,
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,

  },
});
