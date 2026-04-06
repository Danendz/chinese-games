// Extended sentence dictionary for auto-fill lookup
// Common daily sentences that users are likely to want to add
export const extraSentences = [
  // 日常问候
  { words: ['你', '吃', '了', '吗', '？'], pinyin: 'nǐ chī le ma?', english: 'Have you eaten?', grammarPattern: 'Subject + Verb + 了 + 吗', grammarNote: 'A common Chinese greeting, literally asking if you\'ve eaten.' },
  { words: ['最近', '怎么样', '？'], pinyin: 'zuìjìn zěnmeyàng?', english: 'How have you been lately?', grammarPattern: '最近 + 怎么样', grammarNote: '最近 = recently, 怎么样 = how about.' },
  { words: ['好久不见', '！'], pinyin: 'hǎojiǔ bújiàn!', english: 'Long time no see!', grammarPattern: 'Fixed expression', grammarNote: 'A common greeting when you haven\'t seen someone for a while.' },
  { words: ['认识', '你', '很', '高兴', '。'], pinyin: 'rènshi nǐ hěn gāoxìng.', english: 'Nice to meet you.', grammarPattern: 'Verb + Object + 很 + Adj', grammarNote: '认识 = to know/meet. A polite introduction phrase.' },

  // 点餐
  { words: ['我', '要', '一杯', '咖啡', '。'], pinyin: 'wǒ yào yī bēi kāfēi.', english: 'I want a cup of coffee.', grammarPattern: 'Subject + 要 + Measure + Noun', grammarNote: '要 = want, 一杯 = one cup (measure word for drinks).' },
  { words: ['请', '给', '我', '菜单', '。'], pinyin: 'qǐng gěi wǒ càidān.', english: 'Please give me the menu.', grammarPattern: '请 + 给 + Person + Object', grammarNote: '给 = to give. 菜单 = menu.' },
  { words: ['这个', '多少', '钱', '？'], pinyin: 'zhège duōshǎo qián?', english: 'How much is this?', grammarPattern: 'Object + 多少 + 钱', grammarNote: '多少钱 is the standard way to ask for a price.' },
  { words: ['太', '辣', '了', '！'], pinyin: 'tài là le!', english: 'Too spicy!', grammarPattern: '太 + Adj + 了', grammarNote: '太...了 = too..., expressing excess.' },
  { words: ['味道', '很', '好', '！'], pinyin: 'wèidào hěn hǎo!', english: 'It tastes great!', grammarPattern: 'Noun + 很 + Adj', grammarNote: '味道 = taste/flavor.' },
  { words: ['我', '吃', '饱', '了', '。'], pinyin: 'wǒ chī bǎo le.', english: 'I\'m full.', grammarPattern: 'Subject + Verb + Result + 了', grammarNote: '吃饱 = eat until full. 了 marks completion.' },
  { words: ['买单', '！'], pinyin: 'mǎidān!', english: 'Check, please!', grammarPattern: 'Fixed expression', grammarNote: 'Used to ask for the bill in a restaurant.' },

  // 问路与交通
  { words: ['请问', '，', '地铁站', '在', '哪里', '？'], pinyin: 'qǐngwèn, dìtiězhàn zài nǎlǐ?', english: 'Excuse me, where is the subway station?', grammarPattern: '请问 + Place + 在 + 哪里', grammarNote: '请问 is a polite way to start a question.' },
  { words: ['我', '迷路', '了', '。'], pinyin: 'wǒ mílù le.', english: 'I\'m lost.', grammarPattern: 'Subject + Verb + 了', grammarNote: '迷路 = to get lost.' },
  { words: ['到', '机场', '要', '多长', '时间', '？'], pinyin: 'dào jīchǎng yào duō cháng shíjiān?', english: 'How long does it take to get to the airport?', grammarPattern: '到 + Place + 要 + 多长时间', grammarNote: '多长时间 = how long (duration).' },
  { words: ['我', '要', '去', '火车站', '。'], pinyin: 'wǒ yào qù huǒchēzhàn.', english: 'I want to go to the train station.', grammarPattern: 'Subject + 要 + 去 + Place', grammarNote: 'Standard pattern for expressing destination.' },

  // 购物
  { words: ['可以', '便宜', '一点', '吗', '？'], pinyin: 'kěyǐ piányi yīdiǎn ma?', english: 'Can you make it a bit cheaper?', grammarPattern: '可以 + Adj + 一点 + 吗', grammarNote: 'Useful for bargaining! 便宜 = cheap.' },
  { words: ['我', '只是', '看看', '。'], pinyin: 'wǒ zhǐshì kànkan.', english: 'I\'m just looking.', grammarPattern: 'Subject + 只是 + Verb', grammarNote: '只是 = just/only. 看看 = look around (reduplicated verb).' },
  { words: ['有', '别的', '颜色', '吗', '？'], pinyin: 'yǒu biéde yánsè ma?', english: 'Do you have other colors?', grammarPattern: '有 + 别的 + Noun + 吗', grammarNote: '别的 = other/different.' },
  { words: ['可以', '刷卡', '吗', '？'], pinyin: 'kěyǐ shuākǎ ma?', english: 'Can I pay by card?', grammarPattern: '可以 + Verb + 吗', grammarNote: '刷卡 = to swipe a card (pay by card).' },
  { words: ['可以', '用', '微信', '支付', '吗', '？'], pinyin: 'kěyǐ yòng Wēixìn zhīfù ma?', english: 'Can I pay with WeChat?', grammarPattern: '可以 + 用 + Tool + Verb + 吗', grammarNote: '用 = to use. Very common question in China!' },

  // 社交
  { words: ['你', '的', '微信', '号', '是', '多少', '？'], pinyin: 'nǐ de Wēixìn hào shì duōshǎo?', english: 'What\'s your WeChat ID?', grammarPattern: 'Possessive + Noun + 是 + 多少', grammarNote: 'The modern way of exchanging contact info in China.' },
  { words: ['我们', '加', '个', '微信', '吧', '。'], pinyin: 'wǒmen jiā gè Wēixìn ba.', english: 'Let\'s add each other on WeChat.', grammarPattern: 'Subject + Verb + 个 + Object + 吧', grammarNote: '加微信 = add on WeChat. 吧 makes it a suggestion.' },
  { words: ['周末', '一起', '出去', '玩', '吧', '！'], pinyin: 'zhōumò yīqǐ chūqù wán ba!', english: 'Let\'s go out together this weekend!', grammarPattern: 'Time + 一起 + Verb + 吧', grammarNote: '一起 = together. 出去玩 = go out and have fun.' },

  // 住宿
  { words: ['有', '空', '房间', '吗', '？'], pinyin: 'yǒu kòng fángjiān ma?', english: 'Do you have available rooms?', grammarPattern: '有 + Adj + Noun + 吗', grammarNote: '空 = empty/available.' },
  { words: ['WiFi', '密码', '是', '什么', '？'], pinyin: 'WiFi mìmǎ shì shénme?', english: 'What\'s the WiFi password?', grammarPattern: 'Noun + 是 + 什么', grammarNote: 'Very useful in hotels, cafes, etc.' },

  // 天气
  { words: ['今天', '好', '热', '啊', '！'], pinyin: 'jīntiān hǎo rè a!', english: 'It\'s so hot today!', grammarPattern: 'Time + 好 + Adj + 啊', grammarNote: '好 before adj = so/really (colloquial). 啊 adds exclamation.' },
  { words: ['明天', '会', '下雨', '吗', '？'], pinyin: 'míngtiān huì xiàyǔ ma?', english: 'Will it rain tomorrow?', grammarPattern: 'Time + 会 + Verb + 吗', grammarNote: '会 here means "will" (future prediction).' },

  // 感受与评价
  { words: ['中国', '菜', '真', '好吃', '！'], pinyin: 'Zhōngguó cài zhēn hǎochī!', english: 'Chinese food is really delicious!', grammarPattern: 'Subject + 真 + Adj', grammarNote: '真 = really/truly. 好吃 = delicious.' },
  { words: ['学', '中文', '很', '有趣', '。'], pinyin: 'xué zhōngwén hěn yǒuqù.', english: 'Learning Chinese is very interesting.', grammarPattern: 'Verb + Object + 很 + Adj', grammarNote: '有趣 = interesting/fun.' },
  { words: ['我', '听不懂', '。'], pinyin: 'wǒ tīng bù dǒng.', english: 'I don\'t understand (by listening).', grammarPattern: 'Subject + Verb不Result', grammarNote: '听不懂 = can\'t understand what\'s being said. Very useful!' },
  { words: ['请', '再', '说', '一遍', '。'], pinyin: 'qǐng zài shuō yī biàn.', english: 'Please say it again.', grammarPattern: '请 + 再 + Verb + 一遍', grammarNote: '再 = again, 一遍 = one time.' },
  { words: ['这个', '用', '中文', '怎么', '说', '？'], pinyin: 'zhège yòng zhōngwén zěnme shuō?', english: 'How do you say this in Chinese?', grammarPattern: 'Object + 用 + Language + 怎么说', grammarNote: 'Essential phrase for language learners!' },

  // 时间相关
  { words: ['现在', '几点', '了', '？'], pinyin: 'xiànzài jǐ diǎn le?', english: 'What time is it now?', grammarPattern: '现在 + 几点 + 了', grammarNote: '几点 = what time.' },
  { words: ['我', '快', '要', '迟到', '了', '！'], pinyin: 'wǒ kuài yào chídào le!', english: 'I\'m about to be late!', grammarPattern: 'Subject + 快要 + Verb + 了', grammarNote: '快要...了 = about to... (imminent).' },

  // 紧急情况
  { words: ['请', '帮帮', '我', '！'], pinyin: 'qǐng bāngbang wǒ!', english: 'Please help me!', grammarPattern: '请 + Verb + Object', grammarNote: '帮帮 = help (reduplicated for emphasis/softer tone).' },
  { words: ['我', '不', '舒服', '。'], pinyin: 'wǒ bù shūfu.', english: 'I don\'t feel well.', grammarPattern: 'Subject + 不 + Adj', grammarNote: '舒服 = comfortable. 不舒服 = unwell.' },
]
