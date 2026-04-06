// Idiom Fill (成语填空) data organized by HSK difficulty level
// Beginner level uses common words/phrases (not 成语) with one missing character
// HSK levels use proper 4-character 成语

export const idioms = {
  Beginner: [
    {
      id: 'ib_01',
      idiom: '朋友',
      pinyin: 'péng yǒu',
      english: 'friend',
      explanation: 'A very common word meaning "friend".',
      missingIndex: 1,
      distractors: ['有', '及', '又']
    },
    {
      id: 'ib_02',
      idiom: '老师',
      pinyin: 'lǎo shī',
      english: 'teacher',
      explanation: 'Literally "old master" — a respectful term for teacher.',
      missingIndex: 1,
      distractors: ['是', '十', '时']
    },
    {
      id: 'ib_03',
      idiom: '学生',
      pinyin: 'xué shēng',
      english: 'student',
      explanation: 'A person who studies — "study" + "born/life".',
      missingIndex: 0,
      distractors: ['雪', '血', '穴']
    },
    {
      id: 'ib_04',
      idiom: '中国',
      pinyin: 'zhōng guó',
      english: 'China',
      explanation: 'The Middle Kingdom — "middle" + "country".',
      missingIndex: 1,
      distractors: ['过', '果', '锅']
    },
    {
      id: 'ib_05',
      idiom: '你好',
      pinyin: 'nǐ hǎo',
      english: 'hello',
      explanation: 'The most common Chinese greeting — "you" + "good".',
      missingIndex: 1,
      distractors: ['号', '毫', '耗']
    },
    {
      id: 'ib_06',
      idiom: '谢谢',
      pinyin: 'xiè xie',
      english: 'thank you',
      explanation: 'The standard way to say "thank you" in Chinese.',
      missingIndex: 0,
      distractors: ['写', '些', '鞋']
    },
    {
      id: 'ib_07',
      idiom: '再见',
      pinyin: 'zài jiàn',
      english: 'goodbye',
      explanation: '"Again" + "see" — meaning "see you again".',
      missingIndex: 0,
      distractors: ['在', '才', '载']
    },
    {
      id: 'ib_08',
      idiom: '大家',
      pinyin: 'dà jiā',
      english: 'everyone',
      explanation: '"Big" + "family" — meaning everyone or everybody.',
      missingIndex: 0,
      distractors: ['打', '达', '答']
    }
  ],

  'HSK1-3': [
    {
      id: 'i13_01',
      idiom: '一心一意',
      pinyin: 'yī xīn yī yì',
      english: 'wholeheartedly; single-minded',
      explanation: 'One heart, one mind — to focus with total devotion.',
      missingIndex: 1,
      distractors: ['新', '信', '星']
    },
    {
      id: 'i13_02',
      idiom: '自言自语',
      pinyin: 'zì yán zì yǔ',
      english: 'to talk to oneself',
      explanation: 'Self-speak, self-talk — muttering to yourself.',
      missingIndex: 3,
      distractors: ['雨', '与', '鱼']
    },
    {
      id: 'i13_03',
      idiom: '马马虎虎',
      pinyin: 'mǎ ma hū hū',
      english: 'so-so; careless',
      explanation: '"Horse horse tiger tiger" — meaning sloppy or just okay.',
      missingIndex: 2,
      distractors: ['乎', '呼', '忽']
    },
    {
      id: 'i13_04',
      idiom: '半途而废',
      pinyin: 'bàn tú ér fèi',
      english: 'give up halfway',
      explanation: 'To abandon something before finishing — half the road, then stop.',
      missingIndex: 0,
      distractors: ['办', '伴', '班']
    },
    {
      id: 'i13_05',
      idiom: '一举两得',
      pinyin: 'yī jǔ liǎng dé',
      english: 'kill two birds with one stone',
      explanation: 'One action, two gains — achieving two goals at once.',
      missingIndex: 2,
      distractors: ['亮', '量', '良']
    },
    {
      id: 'i13_06',
      idiom: '三心二意',
      pinyin: 'sān xīn èr yì',
      english: 'half-hearted; indecisive',
      explanation: 'Three hearts, two minds — unable to focus on one thing.',
      missingIndex: 0,
      distractors: ['山', '散', '伞']
    },
    {
      id: 'i13_07',
      idiom: '千方百计',
      pinyin: 'qiān fāng bǎi jì',
      english: 'by every possible means',
      explanation: 'A thousand methods, a hundred plans — trying everything.',
      missingIndex: 2,
      distractors: ['白', '拜', '摆']
    },
    {
      id: 'i13_08',
      idiom: '五颜六色',
      pinyin: 'wǔ yán liù sè',
      english: 'colorful; multicolored',
      explanation: 'Five colors, six hues — a vivid variety of colors.',
      missingIndex: 3,
      distractors: ['涩', '瑟', '塞']
    },
    {
      id: 'i13_09',
      idiom: '人山人海',
      pinyin: 'rén shān rén hǎi',
      english: 'huge crowds; a sea of people',
      explanation: 'People like mountains, people like seas — very crowded.',
      missingIndex: 1,
      distractors: ['三', '衫', '删']
    },
    {
      id: 'i13_10',
      idiom: '自由自在',
      pinyin: 'zì yóu zì zài',
      english: 'carefree; free and easy',
      explanation: 'Free in oneself — living without restraint or worry.',
      missingIndex: 1,
      distractors: ['游', '油', '优']
    },
    {
      id: 'i13_11',
      idiom: '一模一样',
      pinyin: 'yī mó yī yàng',
      english: 'exactly the same',
      explanation: 'One mold, one shape — identical in every way.',
      missingIndex: 3,
      distractors: ['洋', '养', '阳']
    },
    {
      id: 'i13_12',
      idiom: '东张西望',
      pinyin: 'dōng zhāng xī wàng',
      english: 'to look around in all directions',
      explanation: 'Look east, gaze west — glancing around nervously or curiously.',
      missingIndex: 0,
      distractors: ['冬', '动', '懂']
    }
  ],

  'HSK4-6': [
    {
      id: 'i46_01',
      idiom: '画蛇添足',
      pinyin: 'huà shé tiān zú',
      english: 'to ruin something by overdoing it',
      explanation: 'Drawing legs on a snake — adding unnecessary detail that spoils the result.',
      missingIndex: 1,
      distractors: ['舍', '设', '社']
    },
    {
      id: 'i46_02',
      idiom: '守株待兔',
      pinyin: 'shǒu zhū dài tù',
      english: 'to wait for a windfall',
      explanation: 'Guarding a tree stump waiting for a rabbit — hoping for luck without effort.',
      missingIndex: 3,
      distractors: ['图', '土', '途']
    },
    {
      id: 'i46_03',
      idiom: '对牛弹琴',
      pinyin: 'duì niú tán qín',
      english: 'to cast pearls before swine',
      explanation: 'Playing the lute to a cow — wasting effort on an unappreciative audience.',
      missingIndex: 2,
      distractors: ['谈', '坛', '探']
    },
    {
      id: 'i46_04',
      idiom: '入乡随俗',
      pinyin: 'rù xiāng suí sú',
      english: 'when in Rome, do as the Romans do',
      explanation: 'Enter a village, follow its customs — adapt to local ways.',
      missingIndex: 0,
      distractors: ['如', '乳', '辱']
    },
    {
      id: 'i46_05',
      idiom: '亡羊补牢',
      pinyin: 'wáng yáng bǔ láo',
      english: 'better late than never',
      explanation: 'Mend the pen after losing a sheep — fixing a problem after damage is done.',
      missingIndex: 1,
      distractors: ['阳', '洋', '扬']
    },
    {
      id: 'i46_06',
      idiom: '掩耳盗铃',
      pinyin: 'yǎn ěr dào líng',
      english: 'to deceive oneself',
      explanation: 'Covering ears to steal a bell — fooling only yourself.',
      missingIndex: 3,
      distractors: ['灵', '零', '领']
    },
    {
      id: 'i46_07',
      idiom: '刻舟求剑',
      pinyin: 'kè zhōu qiú jiàn',
      english: 'to cling stubbornly to old ways',
      explanation: 'Marking the boat to find a dropped sword — refusing to adapt to change.',
      missingIndex: 2,
      distractors: ['球', '秋', '丘']
    },
    {
      id: 'i46_08',
      idiom: '井底之蛙',
      pinyin: 'jǐng dǐ zhī wā',
      english: 'a person with a narrow view',
      explanation: 'A frog at the bottom of a well — seeing only a small piece of the sky.',
      missingIndex: 3,
      distractors: ['哇', '挖', '瓦']
    },
    {
      id: 'i46_09',
      idiom: '狐假虎威',
      pinyin: 'hú jiǎ hǔ wēi',
      english: 'to bully others by flaunting authority',
      explanation: 'The fox borrows the tiger\'s power — using someone else\'s influence.',
      missingIndex: 0,
      distractors: ['胡', '湖', '壶']
    },
    {
      id: 'i46_10',
      idiom: '杯弓蛇影',
      pinyin: 'bēi gōng shé yǐng',
      english: 'to be overly suspicious',
      explanation: 'Mistaking a bow\'s reflection in a cup for a snake — imagining danger.',
      missingIndex: 1,
      distractors: ['公', '功', '宫']
    }
  ],

  'HSK7-9': [
    {
      id: 'i79_01',
      idiom: '卧薪尝胆',
      pinyin: 'wò xīn cháng dǎn',
      english: 'to endure hardship for future revenge',
      explanation: 'Sleeping on brushwood and tasting gall — extreme perseverance for a goal.',
      missingIndex: 2,
      distractors: ['常', '场', '长']
    },
    {
      id: 'i79_02',
      idiom: '破釜沉舟',
      pinyin: 'pò fǔ chén zhōu',
      english: 'to burn one\'s bridges; go all in',
      explanation: 'Smashing the pots and sinking the boats — fighting with no retreat.',
      missingIndex: 1,
      distractors: ['斧', '府', '腐']
    },
    {
      id: 'i79_03',
      idiom: '鹤立鸡群',
      pinyin: 'hè lì jī qún',
      english: 'to stand out from the crowd',
      explanation: 'A crane standing among chickens — towering above the ordinary.',
      missingIndex: 0,
      distractors: ['喝', '合', '何']
    },
    {
      id: 'i79_04',
      idiom: '沧海桑田',
      pinyin: 'cāng hǎi sāng tián',
      english: 'great changes over time',
      explanation: 'The sea becomes mulberry fields — the world changes dramatically.',
      missingIndex: 2,
      distractors: ['丧', '嗓', '搡']
    },
    {
      id: 'i79_05',
      idiom: '胸有成竹',
      pinyin: 'xiōng yǒu chéng zhú',
      english: 'to have a well-thought-out plan',
      explanation: 'Having a bamboo painting already in mind — being fully prepared.',
      missingIndex: 3,
      distractors: ['猪', '逐', '烛']
    },
    {
      id: 'i79_06',
      idiom: '班门弄斧',
      pinyin: 'bān mén nòng fǔ',
      english: 'to show off before an expert',
      explanation: 'Wielding an axe at the door of Lu Ban (master carpenter) — overestimating oneself.',
      missingIndex: 2,
      distractors: ['农', '浓', '弄']
    },
    {
      id: 'i79_07',
      idiom: '叶公好龙',
      pinyin: 'yè gōng hào lóng',
      english: 'to profess love for what one fears',
      explanation: 'Lord Ye loved dragons — until a real one appeared and he fled in terror.',
      missingIndex: 3,
      distractors: ['笼', '隆', '聋']
    },
    {
      id: 'i79_08',
      idiom: '望梅止渴',
      pinyin: 'wàng méi zhǐ kě',
      english: 'to console oneself with false hopes',
      explanation: 'Gazing at plums to quench thirst — using imagination to satisfy real needs.',
      missingIndex: 1,
      distractors: ['没', '美', '每']
    }
  ]
}
