import { test, expect } from '@playwright/test'

test.describe('YYC³ 餐饮平台端到端测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3100')
  })

  test('用户登录流程', async ({ page }) => {
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('.dashboard-container')).toBeVisible()
  })

  test('AI Widget功能测试', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const aiWidgetButton = page.locator('.ai-widget-button')
    await expect(aiWidgetButton).toBeVisible()

    await aiWidgetButton.click()

    const aiWidgetPanel = page.locator('.ai-widget-panel')
    await expect(aiWidgetPanel).toBeVisible()

    const chatInput = page.locator('.chat-input input')
    await chatInput.fill('今天的营收情况如何？')
    await page.keyboard.press('Enter')

    await expect(page.locator('.message.user')).toBeVisible()
    await expect(page.locator('.message.assistant')).toBeVisible({ timeout: 5000 })
  })

  test('Closed Loop管理测试', async ({ page }) => {
    await page.goto('http://localhost:3100/closed-loop')

    await expect(page.locator('.closed-loop-management')).toBeVisible()

    const metricCards = page.locator('.metric-card')
    await expect(metricCards).toHaveCount(4)

    const executeButton = page.locator('button:has-text("执行新周期")')
    await executeButton.click()

    await expect(page.locator('.el-timeline-item')).toHaveCount(3)
  })

  test('订单管理流程', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    await expect(page.locator('.order-management')).toBeVisible()

    const createButton = page.locator('button:has-text("新建订单")')
    await createButton.click()

    await page.fill('input[name="customerName"]', '测试客户')
    await page.fill('input[name="amount"]', '100')
    await page.click('button:has-text("提交")')

    await expect(page.locator('.el-message--success')).toBeVisible()
  })

  test('菜单管理流程', async ({ page }) => {
    await page.goto('http://localhost:3100/menu')

    await expect(page.locator('.menu-management')).toBeVisible()

    const searchInput = page.locator('input[placeholder*="搜索"]')
    await searchInput.fill('宫保鸡丁')

    await expect(page.locator('.dish-item')).toHaveCount(1)
  })

  test('客户管理流程', async ({ page }) => {
    await page.goto('http://localhost:3100/customers')

    await expect(page.locator('.customer-management')).toBeVisible()

    const customerRow = page.locator('.customer-row').first()
    await customerRow.click()

    await expect(page.locator('.customer-detail')).toBeVisible()
  })

  test('数据分析流程', async ({ page }) => {
    await page.goto('http://localhost:3100/analytics')

    await expect(page.locator('.data-analytics')).toBeVisible()

    const chart = page.locator('.echarts-container')
    await expect(chart).toBeVisible()

    const dateRange = page.locator('.date-range-picker')
    await dateRange.click()
    await page.click('text="最近7天"')

    await expect(chart).toBeVisible()
  })

  test('系统监控流程', async ({ page }) => {
    await page.goto('http://localhost:3100/system-monitoring')

    await expect(page.locator('.system-monitoring')).toBeVisible()

    const healthCheck = page.locator('.health-check')
    await expect(healthCheck).toBeVisible()

    const alertList = page.locator('.alert-list')
    await expect(alertList).toBeVisible()
  })

  test('响应式布局测试', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('.sidebar')).toBeVisible()

    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('.sidebar')).not.toBeVisible()

    const menuButton = page.locator('.menu-toggle')
    await menuButton.click()
    await expect(page.locator('.sidebar')).toBeVisible()
  })

  test('主题切换测试', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const themeToggle = page.locator('.theme-toggle')
    await themeToggle.click()

    await expect(page.locator('body')).toHaveClass(/dark/)

    await themeToggle.click()
    await expect(page.locator('body')).not.toHaveClass(/dark/)
  })

  test('表单验证测试', async ({ page }) => {
    await page.goto('http://localhost:3100/orders/create')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    await expect(page.locator('.el-form-item__error')).toBeVisible()

    await page.fill('input[name="customerName"]', '测试客户')
    await page.fill('input[name="amount"]', 'invalid')
    await submitButton.click()

    await expect(page.locator('.el-form-item__error')).toBeVisible()
  })

  test('数据导出测试', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    const exportButton = page.locator('button:has-text("导出")')
    await exportButton.click()

    const downloadPromise = page.waitForEvent('download')
    await page.click('text="导出Excel"')

    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.(xlsx|csv)$/)
  })

  test('批量操作测试', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    const checkboxes = page.locator('.el-checkbox input')
    await checkboxes.nth(0).check()
    await checkboxes.nth(1).check()

    const batchDelete = page.locator('button:has-text("批量删除")')
    await batchDelete.click()

    await page.click('button:has-text("确认")')

    await expect(page.locator('.el-message--success')).toBeVisible()
  })

  test('搜索和筛选测试', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    const searchInput = page.locator('input[placeholder*="搜索"]')
    await searchInput.fill('测试订单')

    await expect(page.locator('.order-row')).toHaveCount(1)

    const statusFilter = page.locator('.status-filter')
    await statusFilter.click()
    await page.click('text="已完成"')

    await expect(page.locator('.order-row')).toHaveCount(1)
  })

  test('分页测试', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    const nextPage = page.locator('.el-pagination .btn-next')
    await nextPage.click()

    await expect(page.locator('.el-pagination .active')).toHaveText(/2/)
  })

  test('模态框测试', async ({ page }) => {
    await page.goto('http://localhost:3100/orders')

    const createButton = page.locator('button:has-text("新建订单")')
    await createButton.click()

    const modal = page.locator('.el-dialog')
    await expect(modal).toBeVisible()

    const closeButton = page.locator('.el-dialog__close')
    await closeButton.click()

    await expect(modal).not.toBeVisible()
  })

  test('通知系统测试', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const notificationButton = page.locator('.notification-button')
    await notificationButton.click()

    const notificationPanel = page.locator('.notification-panel')
    await expect(notificationPanel).toBeVisible()

    const notificationItem = page.locator('.notification-item').first()
    await notificationItem.click()

    const notificationDetail = page.locator('.notification-detail')
    await expect(notificationDetail).toBeVisible()
  })

  test('权限控制测试', async ({ page, context }) => {
    await context.clearCookies()

    await page.goto('http://localhost:3100/admin')

    await expect(page).toHaveURL(/.*login/)
  })

  test('错误处理测试', async ({ page, context }) => {
    await context.route('**/api/orders', route => route.abort())

    await page.goto('http://localhost:3100/orders')

    await expect(page.locator('.el-message--error')).toBeVisible()
  })

  test('性能测试 - 页面加载', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('http://localhost:3100/dashboard')

    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000)
  })

  test('性能测试 - 组件渲染', async ({ page }) => {
    await page.goto('http://localhost:3100/dashboard')

    const startTime = Date.now()

    await page.waitForSelector('.dashboard-container')

    const renderTime = Date.now() - startTime
    expect(renderTime).toBeLessThan(1000)
  })
})
