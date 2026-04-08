// Pinyin spelling exercises
// Types:
// 1. 'full' — see character, type full pinyin with tone (e.g. 你 → nǐ)
// 2. 'initial' — given final, type initial (e.g. ___ǐ → n)
// 3. 'final' — given initial, type final (e.g. n___ → ǐ)
// 4. 'tone' — given pinyin without tone, add correct tone mark (e.g. ni → nǐ)

export const pinyinExercises = {
  Beginner: [
    // Full pinyin
    { character: '你', answer: 'nǐ', type: 'full', english: 'you', russian: 'ты' },
    { character: '好', answer: 'hǎo', type: 'full', english: 'good', russian: 'хороший' },
    { character: '我', answer: 'wǒ', type: 'full', english: 'I', russian: 'я' },
    { character: '他', answer: 'tā', type: 'full', english: 'he', russian: 'он' },
    { character: '大', answer: 'dà', type: 'full', english: 'big', russian: 'большой' },
    { character: '小', answer: 'xiǎo', type: 'full', english: 'small', russian: 'маленький' },
    { character: '水', answer: 'shuǐ', type: 'full', english: 'water', russian: 'вода' },
    { character: '人', answer: 'rén', type: 'full', english: 'person', russian: 'человек' },
    { character: '猫', answer: 'māo', type: 'full', english: 'cat', russian: 'кот' },
    { character: '狗', answer: 'gǒu', type: 'full', english: 'dog', russian: 'собака' },
    { character: '书', answer: 'shū', type: 'full', english: 'book', russian: 'книга' },
    { character: '鱼', answer: 'yú', type: 'full', english: 'fish', russian: 'рыба' },
    { character: '吃', answer: 'chī', type: 'full', english: 'eat', russian: 'есть' },
    { character: '喝', answer: 'hē', type: 'full', english: 'drink', russian: 'пить' },
    { character: '看', answer: 'kàn', type: 'full', english: 'look', russian: 'смотреть' },
    { character: '是', answer: 'shì', type: 'full', english: 'to be', russian: 'быть' },
    { character: '有', answer: 'yǒu', type: 'full', english: 'have', russian: 'иметь' },
    { character: '爱', answer: 'ài', type: 'full', english: 'love', russian: 'любовь' },
    // Initials practice
    { character: '___ā', answer: 'm', type: 'initial', hint: '妈', english: 'mother', russian: 'мать' },
    { character: '___ǐ', answer: 'n', type: 'initial', hint: '你', english: 'you', russian: 'ты' },
    { character: '___à', answer: 'd', type: 'initial', hint: '大', english: 'big', russian: 'большой' },
    { character: '___ǎo', answer: 'h', type: 'initial', hint: '好', english: 'good', russian: 'хороший' },
    { character: '___ī', answer: 'ch', type: 'initial', hint: '吃', english: 'eat', russian: 'есть' },
    { character: '___ē', answer: 'h', type: 'initial', hint: '喝', english: 'drink', russian: 'пить' },
    // Finals practice
    { character: 'sh___', answer: 'uǐ', type: 'final', hint: '水', english: 'water', russian: 'вода' },
    { character: 'g___', answer: 'ǒu', type: 'final', hint: '狗', english: 'dog', russian: 'собака' },
    { character: 'm___', answer: 'āo', type: 'final', hint: '猫', english: 'cat', russian: 'кот' },
    { character: 'r___', answer: 'én', type: 'final', hint: '人', english: 'person', russian: 'человек' },
    { character: 'sh___', answer: 'ū', type: 'final', hint: '书', english: 'book', russian: 'книга' },
  ],
  'HSK1-3': [
    { character: '老师', answer: 'lǎoshī', type: 'full', english: 'teacher', russian: 'учитель' },
    { character: '学生', answer: 'xuéshēng', type: 'full', english: 'student', russian: 'ученик' },
    { character: '朋友', answer: 'péngyǒu', type: 'full', english: 'friend', russian: 'друг' },
    { character: '医生', answer: 'yīshēng', type: 'full', english: 'doctor', russian: 'врач' },
    { character: '学校', answer: 'xuéxiào', type: 'full', english: 'school', russian: 'школа' },
    { character: '电脑', answer: 'diànnǎo', type: 'full', english: 'computer', russian: 'компьютер' },
    { character: '飞机', answer: 'fēijī', type: 'full', english: 'airplane', russian: 'самолёт' },
    { character: '苹果', answer: 'píngguǒ', type: 'full', english: 'apple', russian: 'яблоко' },
    { character: '咖啡', answer: 'kāfēi', type: 'full', english: 'coffee', russian: 'кофе' },
    { character: '漂亮', answer: 'piàoliang', type: 'full', english: 'beautiful', russian: 'красивый' },
    { character: '高兴', answer: 'gāoxìng', type: 'full', english: 'happy', russian: 'счастливый' },
    { character: '便宜', answer: 'piányi', type: 'full', english: 'cheap', russian: 'дешёвый' },
    { character: '饺子', answer: 'jiǎozi', type: 'full', english: 'dumplings', russian: 'пельмени' },
    { character: '春天', answer: 'chūntiān', type: 'full', english: 'spring', russian: 'весна' },
    { character: '游泳', answer: 'yóuyǒng', type: 'full', english: 'swim', russian: 'плавать' },
    { character: '准备', answer: 'zhǔnbèi', type: 'full', english: 'prepare', russian: 'готовить' },
    { character: '选择', answer: 'xuǎnzé', type: 'full', english: 'choose', russian: 'выбирать' },
    // Initials
    { character: '___uéxiào', answer: 'x', type: 'initial', hint: '学校', english: 'school', russian: 'школа' },
    { character: '___ēijī', answer: 'f', type: 'initial', hint: '飞机', english: 'airplane', russian: 'самолёт' },
    { character: '___ǎoshī', answer: 'l', type: 'initial', hint: '老师', english: 'teacher', russian: 'учитель' },
    // Finals
    { character: 'p___', answer: 'éng', type: 'final', hint: '朋(友)', english: 'friend', russian: 'друг' },
    { character: 'j___', answer: 'iǎo', type: 'final', hint: '饺(子)', english: 'dumpling', russian: 'пельмень' },
  ],
  'HSK4-6': [
    { character: '经济', answer: 'jīngjì', type: 'full', english: 'economy', russian: 'экономика' },
    { character: '环境', answer: 'huánjìng', type: 'full', english: 'environment', russian: 'среда' },
    { character: '竞争', answer: 'jìngzhēng', type: 'full', english: 'competition', russian: 'конкуренция' },
    { character: '责任', answer: 'zérèn', type: 'full', english: 'responsibility', russian: 'ответственность' },
    { character: '传统', answer: 'chuántǒng', type: 'full', english: 'tradition', russian: 'традиция' },
    { character: '人工智能', answer: 'réngōng zhìnéng', type: 'full', english: 'AI', russian: 'ИИ' },
    { character: '社交媒体', answer: 'shèjiāo méitǐ', type: 'full', english: 'social media', russian: 'соцсети' },
    { character: '维生素', answer: 'wéishēngsù', type: 'full', english: 'vitamin', russian: 'витамин' },
    { character: '纪念品', answer: 'jìniànpǐn', type: 'full', english: 'souvenir', russian: 'сувенир' },
    { character: '信用卡', answer: 'xìnyòngkǎ', type: 'full', english: 'credit card', russian: 'кредитная карта' },
  ],
  'HSK7-9': [
    { character: '佛系', answer: 'fóxì', type: 'full', english: 'zen-like', russian: 'расслабленный' },
    { character: '内卷', answer: 'nèijuǎn', type: 'full', english: 'rat race', russian: 'гонка' },
    { character: '躺平', answer: 'tǎngpíng', type: 'full', english: 'lying flat', russian: 'лечь плашмя' },
    { character: '凡尔赛', answer: 'fáněrsài', type: 'full', english: 'humble brag', russian: 'скромное хвастовство' },
    { character: '莫名其妙', answer: 'mò míng qí miào', type: 'full', english: 'inexplicable', russian: 'непонятно' },
    { character: '恍然大悟', answer: 'huǎng rán dà wù', type: 'full', english: 'sudden realization', russian: 'вдруг осознать' },
    { character: '不可思议', answer: 'bù kě sī yì', type: 'full', english: 'incredible', russian: 'невероятно' },
    { character: '一言难尽', answer: 'yī yán nán jìn', type: 'full', english: 'long story', russian: 'долгая история' },
  ]
}
