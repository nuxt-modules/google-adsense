import { fileURLToPath } from 'url'
import { describe, it, expect, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

vi.spyOn(console, 'error')

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  dev: true
})

describe('Nuxt 3 dev', () => {
  it('should have adsense request', async () => {
    const body = await $fetch('/')

    expect(body).toContain('//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?')
    expect(body).toContain('<ins class="adsbygoogle"')
  })
})