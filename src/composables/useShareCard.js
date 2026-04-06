import { getTodayStr, formatTime } from '../data/statsStore'

/**
 * Generate a shareable stats card as a PNG image using Canvas API.
 * Returns a data URL.
 */
export async function generateShareCard({ streak, todayTime, todayWords, date }) {
  const W = 1200 // 2x for retina
  const H = 800
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // Wait for fonts to load
  try {
    await document.fonts.ready
  } catch {}

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#d63031')
  grad.addColorStop(1, '#e17055')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Decorative circles
  ctx.globalAlpha = 0.06
  ctx.fillStyle = '#ffffff'
  ctx.beginPath(); ctx.arc(200, 150, 180, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(1000, 600, 250, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(600, 700, 120, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1

  // Logo box
  const logoX = 80, logoY = 60, logoSize = 70
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  roundRect(ctx, logoX, logoY, logoSize, logoSize, 16)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 44px "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('字', logoX + logoSize / 2, logoY + logoSize / 2)

  // App name
  ctx.textAlign = 'left'
  ctx.font = 'bold 40px "Noto Sans SC", "Microsoft YaHei", sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('中文游戏', logoX + logoSize + 20, logoY + logoSize / 2 - 5)
  ctx.font = '22px "Noto Sans", Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText('Chinese Learning Games', logoX + logoSize + 22, logoY + logoSize / 2 + 28)

  // Date
  const dateStr = formatDateChinese(date || getTodayStr())
  ctx.textAlign = 'right'
  ctx.font = '24px "Noto Sans", Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText(dateStr, W - 80, 100)

  // Separator line
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(80, 170)
  ctx.lineTo(W - 80, 170)
  ctx.stroke()

  // Stats section — 3 columns
  const statsY = 300
  const colW = W / 3
  const stats = [
    { icon: '🔥', value: `${streak}`, label: '天连续', sublabel: 'Day Streak' },
    { icon: '⏱️', value: formatTime(todayTime), label: '学习时间', sublabel: 'Study Time' },
    { icon: '📚', value: `${todayWords}`, label: '学过的词', sublabel: 'Words Practiced' }
  ]

  stats.forEach((s, i) => {
    const cx = colW * i + colW / 2

    // Icon
    ctx.font = '64px serif'
    ctx.textAlign = 'center'
    ctx.fillText(s.icon, cx, statsY - 40)

    // Value
    ctx.font = 'bold 72px "Noto Sans", Arial, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(s.value, cx, statsY + 50)

    // Chinese label
    ctx.font = '28px "Noto Sans SC", "Microsoft YaHei", sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText(s.label, cx, statsY + 100)

    // English label
    ctx.font = '18px "Noto Sans", Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText(s.sublabel, cx, statsY + 130)
  })

  // Footer
  ctx.textAlign = 'center'
  ctx.font = 'italic 24px "Noto Sans", Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('I\'m learning Chinese! 我在学中文!', W / 2, H - 60)

  return canvas.toDataURL('image/png')
}

export function downloadShareCard(dataUrl) {
  const link = document.createElement('a')
  link.download = `chinese-games-stats-${getTodayStr()}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
