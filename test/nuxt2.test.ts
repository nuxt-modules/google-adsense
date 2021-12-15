import { getBrowser, url } from '@nuxt/test-utils'
import { assert } from 'chai'
import type { Page } from 'playwright'
import { setupTest } from './utils'

describe('Features', () => {
  beforeEach(done => {
    setTimeout(done, 1000)
  })

  setupTest({
    browser: true,
    fixture: '../example/' + process.env.FIXTURE_NAME,
    waitFor: 0
  })

  describe('Ads', () => {
    let browser, page: Page

    it('Render a page', async () => {
      browser = await getBrowser()
      page = await browser.newPage()
      page.on('console', (message) => {
        assert(message.type() !== 'error', 'Error in console, ' + message.text())
      })

      await page.goto(url('/'))
      await new Promise(resolve => setTimeout(resolve, 1000))

      const iframe = await page.$('.adsbygoogle iframe')

      assert(iframe !== null)

      // Wait 1s
      await new Promise(resolve => setTimeout(resolve, 1000))
    })
  })
})
