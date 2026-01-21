import { test, expect } from '@playwright/test'

test.describe('性能基准测试', () => {
  test('首页加载性能', async ({ page }) => {
    const metrics = await page.goto('http://localhost:3100/dashboard')

    if (metrics) {
      expect(metrics.timing?.domContentLoaded).toBeLessThan(2000)
      expect(metrics.timing?.load).toBeLessThan(3000)
    }
  })

  test('首次内容绘制(FCP)', async ({ page }) => {
    const fcp = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
          if (fcpEntry) {
            resolve(fcpEntry.startTime)
          }
        })
        observer.observe({ entryTypes: ['paint'] })
      })
    })

    expect(fcp).toBeLessThan(1500)
  })

  test('最大内容绘制(LCP)', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries()
          const lcpEntry = entries[entries.length - 1]
          resolve(lcpEntry.startTime)
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })

    expect(lcp).toBeLessThan(2500)
  })

  test('累积布局偏移(CLS)', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          resolve(clsValue)
        })
        observer.observe({ entryTypes: ['layout-shift'] })
      })
    })

    expect(cls).toBeLessThan(0.1)
  })

  test('首次输入延迟(FID)', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const fid = await page.evaluate(() => {
      return new Promise(resolve => {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries()
          if (entries.length > 0) {
            resolve(entries[0].processingStart - entries[0].startTime)
          }
        })
        observer.observe({ entryTypes: ['first-input'] })

        setTimeout(() => resolve(0), 5000)
      })
    })

    expect(fid).toBeLessThan(100)
  })

  test('交互时间(TTI)', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const tti = await page.evaluate(() => {
      return new Promise(resolve => {
        let ttiValue = 0
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries()
          const longTasks = entries.filter(entry => entry.duration > 50)
          if (longTasks.length > 0) {
            ttiValue = longTasks[longTasks.length - 1].startTime + longTasks[longTasks.length - 1].duration
          }
        })
        observer.observe({ entryTypes: ['longtask'] })

        setTimeout(() => resolve(ttiValue || 0), 5000)
      })
    })

    expect(tti).toBeLessThan(3500)
  })
})

test.describe('内存性能测试', () => {
  test('内存泄漏检测', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    for (let i = 0; i < 10; i++) {
      await page.click('.ai-widget-button')
      await page.waitForTimeout(100)
      await page.click('.ai-widget-button')
      await page.waitForTimeout(100)
    }

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0
    })

    const memoryIncrease = finalMemory - initialMemory
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
  })

  test('DOM节点数量', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const nodeCount = await page.evaluate(() => {
      return document.querySelectorAll('*').length
    })

    expect(nodeCount).toBeLessThan(3000)
  })
})

test.describe('网络性能测试', () => {
  test('资源加载时间', async ({ page }) => {
    const resources: any[] = []

    page.on('response', async response => {
      const timing = response.timing()
      if (timing) {
        resources.push({
          url: response.url(),
          duration: timing.responseEnd - timing.requestStart,
        })
      }
    })

    await page.goto('http://localhost:3100/dashboard')
    await page.waitForLoadState('networkidle')

    const slowResources = resources.filter(r => r.duration > 1000)
    expect(slowResources.length).toBeLessThan(5)
  })

  test('总资源大小', async ({ page }) => {
    let totalSize = 0

    page.on('response', async response => {
      const headers = response.headers()
      const contentLength = headers['content-length']
      if (contentLength) {
        totalSize += parseInt(contentLength)
      }
    })

    await page.goto('http://localhost:3100/dashboard')
    await page.waitForLoadState('networkidle')

    const sizeInMB = totalSize / (1024 * 1024)
    expect(sizeInMB).toBeLessThan(5)
  })
})

test.describe('渲染性能测试', () => {
  test('帧率测试', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const fps = await page.evaluate(() => {
      return new Promise(resolve => {
        let frameCount = 0
        let startTime = performance.now()

        const measureFPS = () => {
          frameCount++
          const currentTime = performance.now()
          if (currentTime - startTime >= 1000) {
            resolve(frameCount)
          } else {
            requestAnimationFrame(measureFPS)
          }
        }

        requestAnimationFrame(measureFPS)
      })
    })

    expect(fps).toBeGreaterThan(30)
  })

  test('滚动性能', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    const startTime = Date.now()

    await page.evaluate(() => {
      window.scrollTo(0, 1000)
    })

    const scrollTime = Date.now() - startTime
    expect(scrollTime).toBeLessThan(100)
  })
})

test.describe('并发性能测试', () => {
  test('多标签页性能', async ({ context }) => {
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage(),
    ])

    const startTime = Date.now()

    await Promise.all([
      pages[0].goto('http://localhost:3100/dashboard'),
      pages[1].goto('http://localhost:3100/orders'),
      pages[2].goto('http://localhost:3100/menu'),
    ])

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(5000)

    await Promise.all(pages.map(page => page.close()))
  })

  test('并发API请求', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const startTime = Date.now()

    await Promise.all([
      page.evaluate(() => fetch('/api/orders')),
      page.evaluate(() => fetch('/api/menu')),
      page.evaluate(() => fetch('/api/customers')),
    ])

    const requestTime = Date.now() - startTime
    expect(requestTime).toBeLessThan(2000)
  })
})
