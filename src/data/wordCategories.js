// Word sorting/categorization game data
export const wordCategories = {
  Beginner: [
    {
      categories: [{ en: 'Animals 动物', ru: 'Животные 动物' }, { en: 'Colors 颜色', ru: 'Цвета 颜色' }],
      words: [
        { word: '猫', pinyin: 'māo', category: 0 },
        { word: '狗', pinyin: 'gǒu', category: 0 },
        { word: '鱼', pinyin: 'yú', category: 0 },
        { word: '红色', pinyin: 'hóngsè', category: 1 },
        { word: '蓝色', pinyin: 'lánsè', category: 1 },
        { word: '绿色', pinyin: 'lǜsè', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Family 家人', ru: 'Семья 家人' }, { en: 'Numbers 数字', ru: 'Числа 数字' }],
      words: [
        { word: '爸爸', pinyin: 'bàba', category: 0 },
        { word: '妈妈', pinyin: 'māma', category: 0 },
        { word: '哥哥', pinyin: 'gēge', category: 0 },
        { word: '一', pinyin: 'yī', category: 1 },
        { word: '三', pinyin: 'sān', category: 1 },
        { word: '十', pinyin: 'shí', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Food 食物', ru: 'Еда 食物' }, { en: 'Body 身体', ru: 'Тело 身体' }],
      words: [
        { word: '水', pinyin: 'shuǐ', category: 0 },
        { word: '饭', pinyin: 'fàn', category: 0 },
        { word: '鱼', pinyin: 'yú', category: 0 },
        { word: '手', pinyin: 'shǒu', category: 1 },
        { word: '头', pinyin: 'tóu', category: 1 },
        { word: '脚', pinyin: 'jiǎo', category: 1 },
      ]
    },
  ],
  'HSK1-3': [
    {
      categories: [{ en: 'Food 食物', ru: 'Еда 食物' }, { en: 'Transport 交通', ru: 'Транспорт 交通' }],
      words: [
        { word: '米饭', pinyin: 'mǐfàn', category: 0 },
        { word: '苹果', pinyin: 'píngguǒ', category: 0 },
        { word: '茶', pinyin: 'chá', category: 0 },
        { word: '咖啡', pinyin: 'kāfēi', category: 0 },
        { word: '飞机', pinyin: 'fēijī', category: 1 },
        { word: '地铁', pinyin: 'dìtiě', category: 1 },
        { word: '出租车', pinyin: 'chūzūchē', category: 1 },
        { word: '公交车', pinyin: 'gōngjiāochē', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Places 地点', ru: 'Места 地点' }, { en: 'Time 时间', ru: 'Время 时间' }],
      words: [
        { word: '学校', pinyin: 'xuéxiào', category: 0 },
        { word: '医院', pinyin: 'yīyuàn', category: 0 },
        { word: '商店', pinyin: 'shāngdiàn', category: 0 },
        { word: '银行', pinyin: 'yínháng', category: 0 },
        { word: '今天', pinyin: 'jīntiān', category: 1 },
        { word: '明天', pinyin: 'míngtiān', category: 1 },
        { word: '昨天', pinyin: 'zuótiān', category: 1 },
        { word: '现在', pinyin: 'xiànzài', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Seasons 季节', ru: 'Времена года 季节' }, { en: 'Adjectives 形容词', ru: 'Прилагательные 形容词' }],
      words: [
        { word: '春天', pinyin: 'chūntiān', category: 0 },
        { word: '夏天', pinyin: 'xiàtiān', category: 0 },
        { word: '秋天', pinyin: 'qiūtiān', category: 0 },
        { word: '冬天', pinyin: 'dōngtiān', category: 0 },
        { word: '快', pinyin: 'kuài', category: 1 },
        { word: '慢', pinyin: 'màn', category: 1 },
        { word: '贵', pinyin: 'guì', category: 1 },
        { word: '便宜', pinyin: 'piányi', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Action 动作', ru: 'Действие 动作' }, { en: 'Hobby 爱好', ru: 'Хобби 爱好' }],
      words: [
        { word: '吃', pinyin: 'chī', category: 0 },
        { word: '喝', pinyin: 'hē', category: 0 },
        { word: '写', pinyin: 'xiě', category: 0 },
        { word: '跑', pinyin: 'pǎo', category: 0 },
        { word: '唱歌', pinyin: 'chànggē', category: 1 },
        { word: '跳舞', pinyin: 'tiàowǔ', category: 1 },
        { word: '游泳', pinyin: 'yóuyǒng', category: 1 },
        { word: '看电影', pinyin: 'kàn diànyǐng', category: 1 },
      ]
    },
  ],
  'HSK4-6': [
    {
      categories: [{ en: 'Emotions 情绪', ru: 'Эмоции 情绪' }, { en: 'Work 工作', ru: 'Работа 工作' }],
      words: [
        { word: '紧张', pinyin: 'jǐnzhāng', category: 0 },
        { word: '失望', pinyin: 'shīwàng', category: 0 },
        { word: '骄傲', pinyin: 'jiāoào', category: 0 },
        { word: '寂寞', pinyin: 'jìmò', category: 0 },
        { word: '工资', pinyin: 'gōngzī', category: 1 },
        { word: '面试', pinyin: 'miànshì', category: 1 },
        { word: '加班', pinyin: 'jiābān', category: 1 },
        { word: '辞职', pinyin: 'cízhí', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Tech 科技', ru: 'Технологии 科技' }, { en: 'Culture 文化', ru: 'Культура 文化' }],
      words: [
        { word: '网络', pinyin: 'wǎngluò', category: 0 },
        { word: '软件', pinyin: 'ruǎnjiàn', category: 0 },
        { word: '数据', pinyin: 'shùjù', category: 0 },
        { word: '充电', pinyin: 'chōngdiàn', category: 0 },
        { word: '传统', pinyin: 'chuántǒng', category: 1 },
        { word: '艺术', pinyin: 'yìshù', category: 1 },
        { word: '历史', pinyin: 'lìshǐ', category: 1 },
        { word: '文化', pinyin: 'wénhuà', category: 1 },
      ]
    },
  ],
  'HSK7-9': [
    {
      categories: [{ en: 'Social 社交', ru: 'Общение 社交' }, { en: 'Business 商务', ru: 'Бизнес 商务' }],
      words: [
        { word: '八卦', pinyin: 'bāguà', category: 0 },
        { word: '面子', pinyin: 'miànzi', category: 0 },
        { word: '默契', pinyin: 'mòqì', category: 0 },
        { word: '人脉', pinyin: 'rénmài', category: 0 },
        { word: '创业', pinyin: 'chuàngyè', category: 1 },
        { word: '投资', pinyin: 'tóuzī', category: 1 },
        { word: '谈判', pinyin: 'tánpàn', category: 1 },
        { word: '效率', pinyin: 'xiàolǜ', category: 1 },
      ]
    },
    {
      categories: [{ en: 'Internet 网络', ru: 'Интернет 网络' }, { en: 'Lifestyle 生活', ru: 'Образ жизни 生活' }],
      words: [
        { word: '网红', pinyin: 'wǎnghóng', category: 0 },
        { word: '直播', pinyin: 'zhíbō', category: 0 },
        { word: '点赞', pinyin: 'diǎnzàn', category: 0 },
        { word: '粉丝', pinyin: 'fěnsī', category: 0 },
        { word: '健身', pinyin: 'jiànshēn', category: 1 },
        { word: '养生', pinyin: 'yǎngshēng', category: 1 },
        { word: '减肥', pinyin: 'jiǎnféi', category: 1 },
        { word: '熬夜', pinyin: 'áoyè', category: 1 },
      ]
    },
  ]
}
