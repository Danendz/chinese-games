import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '中文游戏 | Chinese Learning Games' }
  },
  {
    path: '/memory',
    name: 'memory',
    component: () => import('../views/MemoryGameView.vue'),
    meta: { title: '汉字配对翻牌 | Character Matching' }
  },
  {
    path: '/radicals',
    name: 'radicals',
    component: () => import('../views/RadicalGameView.vue'),
    meta: { title: '偏旁组字 | Radical Puzzle' }
  },
  {
    path: '/sentences',
    name: 'sentences',
    component: () => import('../views/SentenceGameView.vue'),
    meta: { title: '句子排序 | Sentence Ordering' }
  },
  {
    path: '/listening',
    name: 'listening',
    component: () => import('../views/ListeningGameView.vue'),
    meta: { title: '听力挑战 | Listening Quiz' }
  },
  {
    path: '/idioms',
    name: 'idioms',
    component: () => import('../views/IdiomGameView.vue'),
    meta: { title: '成语填空 | Idiom Fill' }
  },
  {
    path: '/pictures',
    name: 'pictures',
    component: () => import('../views/PictureGameView.vue'),
    meta: { title: '看图猜词 | Picture Quiz' }
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../views/StatsView.vue'),
    meta: { title: '学习统计 | My Stats' }
  },
  {
    path: '/my-words',
    name: 'myWords',
    component: () => import('../views/MyWordsView.vue'),
    meta: { title: '我的词库 | My Words' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title || '中文游戏'
})

export default router
