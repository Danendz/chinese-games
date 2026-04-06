// Daily bilingual quotes — rotated by date
// Each quote has a theme that determines the card's visual style
export const dailyQuotes = [
  // 学习与成长
  { zh: '学无止境', en: 'Learning never ends.', theme: 'mountain' },
  { zh: '千里之行，始于足下', en: 'A journey of a thousand miles begins with a single step.', theme: 'path' },
  { zh: '书山有路勤为径', en: 'The path to knowledge is paved with diligence.', theme: 'mountain' },
  { zh: '活到老，学到老', en: 'Live and learn — never stop growing.', theme: 'bamboo' },
  { zh: '不积跬步，无以至千里', en: 'Without small steps, you cannot reach a thousand miles.', theme: 'path' },
  { zh: '温故而知新', en: 'Review the old to learn the new.', theme: 'sunrise' },
  { zh: '学而时习之，不亦说乎', en: 'To learn and practice — is this not a joy?', theme: 'bamboo' },
  { zh: '读万卷书，行万里路', en: 'Read ten thousand books, travel ten thousand miles.', theme: 'mountain' },
  { zh: '知识就是力量', en: 'Knowledge is power.', theme: 'sunrise' },
  { zh: '功夫不负有心人', en: 'Hard work pays off for those who try.', theme: 'mountain' },

  // 坚持与毅力
  { zh: '坚持就是胜利', en: 'Persistence is victory.', theme: 'sunrise' },
  { zh: '有志者事竟成', en: 'Where there is a will, there is a way.', theme: 'mountain' },
  { zh: '滴水穿石', en: 'Constant dripping wears away the stone.', theme: 'wave' },
  { zh: '失败是成功之母', en: 'Failure is the mother of success.', theme: 'sunrise' },
  { zh: '不怕慢，就怕站', en: 'Don\'t fear going slow — only fear standing still.', theme: 'path' },
  { zh: '宝剑锋从磨砺出', en: 'A sharp sword comes from grinding.', theme: 'mountain' },
  { zh: '世上无难事，只怕有心人', en: 'Nothing is impossible for a willing heart.', theme: 'sunrise' },
  { zh: '锲而不舍，金石可镂', en: 'With perseverance, even metal and stone can be carved.', theme: 'mountain' },
  { zh: '每天进步一点点', en: 'A little progress each day adds up to big results.', theme: 'bamboo' },
  { zh: '今天的努力，明天的收获', en: 'Today\'s effort brings tomorrow\'s harvest.', theme: 'sunrise' },

  // 智慧与人生
  { zh: '三人行，必有我师', en: 'In a group of three, there is always a teacher.', theme: 'bamboo' },
  { zh: '己所不欲，勿施于人', en: 'Do not do to others what you would not want done to you.', theme: 'wave' },
  { zh: '海纳百川，有容乃大', en: 'The sea accepts all rivers — greatness lies in tolerance.', theme: 'wave' },
  { zh: '吃得苦中苦，方为人上人', en: 'Endure the hardest hardships to rise above.', theme: 'mountain' },
  { zh: '路遥知马力，日久见人心', en: 'Distance tests a horse\'s strength; time reveals a person\'s heart.', theme: 'path' },
  { zh: '笑一笑，十年少', en: 'Smile and you\'ll feel ten years younger.', theme: 'bamboo' },
  { zh: '知足常乐', en: 'Contentment brings happiness.', theme: 'wave' },
  { zh: '心静自然凉', en: 'A calm mind naturally brings coolness.', theme: 'wave' },
  { zh: '塞翁失马，焉知非福', en: 'A blessing in disguise.', theme: 'mountain' },
  { zh: '天生我材必有用', en: 'I was born with talents that will surely be put to use.', theme: 'sunrise' },

  // 时间与机遇
  { zh: '一寸光阴一寸金', en: 'An inch of time is worth an inch of gold.', theme: 'sunrise' },
  { zh: '机不可失，时不再来', en: 'Opportunity knocks but once.', theme: 'sunrise' },
  { zh: '少壮不努力，老大徒伤悲', en: 'If you don\'t work hard in youth, you\'ll regret it in old age.', theme: 'path' },
  { zh: '今日事，今日毕', en: 'Today\'s task, today\'s finish.', theme: 'sunrise' },
  { zh: '黑发不知勤学早', en: 'In youth we don\'t know how precious time for learning is.', theme: 'bamboo' },

  // 友情与善良
  { zh: '有朋自远方来，不亦乐乎', en: 'How joyful to have friends visiting from afar!', theme: 'bamboo' },
  { zh: '赠人玫瑰，手有余香', en: 'Give someone a rose, and your hand retains the fragrance.', theme: 'wave' },
  { zh: '善有善报', en: 'Goodness is rewarded with goodness.', theme: 'bamboo' },
  { zh: '远亲不如近邻', en: 'A near neighbor is better than a distant relative.', theme: 'path' },
  { zh: '一个好汉三个帮', en: 'Even heroes need helping hands.', theme: 'mountain' },

  // 梦想与勇气
  { zh: '心有多大，舞台就有多大', en: 'Your stage is as big as your heart.', theme: 'sunrise' },
  { zh: '勇敢的人，运气不会太差', en: 'Fortune favors the brave.', theme: 'mountain' },
  { zh: '不要怕，大胆地去尝试', en: 'Don\'t be afraid — try boldly.', theme: 'sunrise' },
  { zh: '梦想还是要有的，万一实现了呢', en: 'Keep your dreams — what if they come true?', theme: 'wave' },
  { zh: '星光不负赶路人', en: 'The stars never let down those who chase their path.', theme: 'path' },
  { zh: '越努力，越幸运', en: 'The harder you work, the luckier you get.', theme: 'sunrise' },
  { zh: '相信自己，你比想象中更强大', en: 'Believe in yourself — you\'re stronger than you think.', theme: 'mountain' },
  { zh: '每一次努力都不会白费', en: 'No effort is ever wasted.', theme: 'bamboo' },
  { zh: '做最好的自己', en: 'Be the best version of yourself.', theme: 'sunrise' },
  { zh: '明天会更好', en: 'Tomorrow will be better.', theme: 'sunrise' },
]

// Theme color palettes for card backgrounds
export const themeColors = {
  mountain: { from: '#2d3436', to: '#636e72', accent: '#dfe6e9' },
  bamboo:   { from: '#00b894', to: '#00cec9', accent: '#55efc4' },
  wave:     { from: '#0984e3', to: '#6c5ce7', accent: '#a29bfe' },
  sunrise:  { from: '#e17055', to: '#fdcb6e', accent: '#ffeaa7' },
  path:     { from: '#d63031', to: '#e17055', accent: '#fab1a0' },
}

/**
 * Get today's quote based on the date (deterministic rotation).
 */
export function getTodayQuote() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  const index = dayOfYear % dailyQuotes.length
  return dailyQuotes[index]
}
