import { getTodayStr, formatTime } from '../data/statsStore'
import { getTodayQuote, themeColors } from '../data/dailyQuotes'
import { useI18n } from './useI18n'

/**
 * Generate a shareable stats card with daily quote and themed background.
 */
export async function generateShareCard({ streak, todayTime, todayWords, date }) {
  const { t, locale } = useI18n()
  const W = 1200, H = 900 // 2x retina
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  try { await document.fonts.ready } catch {}

  const quote = getTodayQuote()
  const colors = themeColors[quote.theme] || themeColors.sunrise

  // === Background gradient ===
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, colors.from)
  grad.addColorStop(1, colors.to)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // === Theme-specific decorations ===
  drawThemeDecoration(ctx, quote.theme, W, H, colors)

  // === Top: Logo + App name ===
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  roundRect(ctx, 60, 45, 64, 64, 14)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 38px "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('字', 92, 77)

  ctx.textAlign = 'left'
  ctx.font = 'bold 34px "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('中文游戏', 140, 68)
  ctx.font = '18px "Noto Sans", Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText(t('share.appName'), 142, 95)

  // Date (top right)
  ctx.textAlign = 'right'
  ctx.font = '20px "Noto Sans", Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(formatDateChinese(date || getTodayStr()), W - 60, 77)

  // === Daily Quote (center top) ===
  ctx.textAlign = 'center'

  // Chinese quote
  ctx.font = 'bold 42px "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = 8
  ctx.fillText(`「${quote.zh}」`, W / 2, 210)
  ctx.shadowBlur = 0

  // English quote
  ctx.font = 'italic 22px "Noto Sans", Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  const quoteText = (locale.value === 'ru' && quote.ru) ? quote.ru : quote.en
  ctx.fillText(quoteText, W / 2, 260)

  // Thin separator
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(W / 2 - 120, 300)
  ctx.lineTo(W / 2 + 120, 300)
  ctx.stroke()

  // === Stats Section ===
  const statsY = 420
  const stats = [
    { icon: '🔥', value: `${streak}`, label: '天连续', sub: t('share.dayStreak') },
    { icon: '⏱️', value: formatTime(todayTime), label: '学习时间', sub: t('share.studyTime') },
    { icon: '✅', value: `${todayWords}`, label: '学会的词', sub: t('share.wordsLearned') }
  ]

  const colW = W / 3
  stats.forEach((s, i) => {
    const cx = colW * i + colW / 2

    // Circle background
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.beginPath()
    ctx.arc(cx, statsY - 15, 55, 0, Math.PI * 2)
    ctx.fill()

    // Icon
    ctx.font = '48px serif'
    ctx.textAlign = 'center'
    ctx.fillText(s.icon, cx, statsY - 15)

    // Value
    ctx.font = 'bold 56px "Noto Sans", Arial, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(s.value, cx, statsY + 65)

    // Chinese label
    ctx.font = '22px "Noto Sans SC", "Microsoft YaHei", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(s.label, cx, statsY + 105)

    // English label
    ctx.font = '14px "Noto Sans", Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText(s.sub, cx, statsY + 128)
  })

  // === Footer ===
  ctx.textAlign = 'center'
  ctx.font = '18px "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(t('share.footer'), W / 2, H - 45)

  return canvas.toDataURL('image/png')
}

export function downloadShareCard(dataUrl) {
  const link = document.createElement('a')
  link.download = `chinese-games-${getTodayStr()}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// === Theme Decorations (canvas-drawn Chinese motifs) ===
function drawThemeDecoration(ctx, theme, W, H, colors) {
  ctx.globalAlpha = 0.08

  switch (theme) {
    case 'mountain':
      drawMountains(ctx, W, H)
      break
    case 'bamboo':
      drawBamboo(ctx, W, H)
      break
    case 'wave':
      drawWaves(ctx, W, H)
      break
    case 'sunrise':
      drawSunrise(ctx, W, H)
      break
    case 'path':
      drawPath(ctx, W, H)
      break
  }

  ctx.globalAlpha = 1
}

function drawMountains(ctx, W, H) {
  ctx.fillStyle = '#ffffff'
  // Back mountain
  ctx.beginPath()
  ctx.moveTo(0, H)
  ctx.lineTo(0, H - 200)
  ctx.quadraticCurveTo(200, H - 400, 400, H - 250)
  ctx.quadraticCurveTo(500, H - 180, 600, H - 300)
  ctx.quadraticCurveTo(800, H - 450, 900, H - 200)
  ctx.quadraticCurveTo(1000, H - 100, W, H - 280)
  ctx.lineTo(W, H)
  ctx.fill()

  // Front mountain
  ctx.globalAlpha = 0.05
  ctx.beginPath()
  ctx.moveTo(0, H)
  ctx.lineTo(100, H - 150)
  ctx.quadraticCurveTo(350, H - 350, 550, H - 180)
  ctx.quadraticCurveTo(700, H - 80, 850, H - 220)
  ctx.quadraticCurveTo(1050, H - 380, W, H - 150)
  ctx.lineTo(W, H)
  ctx.fill()
}

function drawBamboo(ctx, W, H) {
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  // Draw 3 bamboo stalks
  const positions = [100, W - 150, W - 80]
  positions.forEach(x => {
    ctx.beginPath()
    ctx.moveTo(x, H)
    ctx.lineTo(x, 100)
    ctx.stroke()
    // Nodes
    for (let y = H - 120; y > 100; y -= 120) {
      ctx.beginPath()
      ctx.ellipse(x, y, 8, 3, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
    // Leaves
    ctx.globalAlpha = 0.06
    ctx.fillStyle = '#ffffff'
    for (let y = 200; y < H - 100; y += 150) {
      ctx.beginPath()
      ctx.ellipse(x + 30, y, 40, 8, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x - 25, y + 40, 35, 7, 0.4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 0.08
  })
}

function drawWaves(ctx, W, H) {
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  for (let row = 0; row < 5; row++) {
    const y = H - 60 - row * 60
    ctx.beginPath()
    for (let x = 0; x <= W; x += 80) {
      const cy = y + Math.sin((x + row * 40) * 0.03) * 20
      if (x === 0) ctx.moveTo(x, cy)
      else ctx.quadraticCurveTo(x - 40, cy - 15, x, cy)
    }
    ctx.stroke()
  }
  // Circle (moon reflection)
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.05
  ctx.beginPath()
  ctx.arc(W - 200, 180, 80, 0, Math.PI * 2)
  ctx.fill()
}

function drawSunrise(ctx, W, H) {
  ctx.fillStyle = '#ffffff'
  // Sun
  ctx.beginPath()
  ctx.arc(W / 2, H - 100, 150, Math.PI, 0)
  ctx.fill()
  // Rays
  ctx.lineWidth = 2
  ctx.strokeStyle = '#ffffff'
  for (let angle = Math.PI; angle >= 0; angle -= 0.25) {
    const x1 = W / 2 + Math.cos(angle) * 170
    const y1 = H - 100 + Math.sin(angle) * -170
    const x2 = W / 2 + Math.cos(angle) * 220
    const y2 = H - 100 + Math.sin(angle) * -220
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  // Horizon
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.04
  ctx.fillRect(0, H - 100, W, 100)
}

function drawPath(ctx, W, H) {
  ctx.fillStyle = '#ffffff'
  // Winding path
  ctx.beginPath()
  ctx.moveTo(W / 2 - 40, H)
  ctx.quadraticCurveTo(W / 2 - 100, H - 200, W / 2 + 50, H - 350)
  ctx.quadraticCurveTo(W / 2 + 150, H - 500, W / 2 - 30, H - 650)
  ctx.quadraticCurveTo(W / 2 - 80, H - 750, W / 2, 0)
  ctx.lineTo(W / 2 + 30, 0)
  ctx.quadraticCurveTo(W / 2 - 50, H - 750, W / 2, H - 650)
  ctx.quadraticCurveTo(W / 2 + 180, H - 500, W / 2 + 80, H - 350)
  ctx.quadraticCurveTo(W / 2 - 70, H - 200, W / 2 + 40, H)
  ctx.fill()

  // Small dots along path (footsteps)
  ctx.globalAlpha = 0.06
  for (let i = 0; i < 12; i++) {
    const t = i / 12
    const x = W / 2 + Math.sin(t * 6) * 30
    const y = H - t * H
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Helpers
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function formatDateChinese(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}
