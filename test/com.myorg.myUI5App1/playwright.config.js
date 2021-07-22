const { devices } = require('playwright');


// playwright.config.js
module.exports = {
    // Put any shared options on the top level.
    use: {
      headless: true,
    },
  
    projects: [
      {
        name: 'Chromium',
        use: {
          // Configure the browser to use.
          browserName: 'chromium',
  
          // Any Chromium-specific options.
          viewport: { width: 600, height: 800 },
        },
      },

      // "Pixel 4" tests use Chromium browser.
    {
        name: 'Pixel 4',
        use: {
          browserName: 'chromium',
          ...devices['Pixel 4'],
        },
      },

      {
        name: 'iPhone 11',
        use: {
          browserName: 'webkit',
          ...devices['iPhone 11'],
        },
      },
  
      {
        name: 'Firefox',
        use: { browserName: 'firefox' },
      },
  
      {
        name: 'WebKit',
        use: { browserName: 'webkit' },
      },
    ],
  };