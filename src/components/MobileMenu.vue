<template>
  <!-- 移动端菜单组件 -->
  <div class="md:hidden">
    <!-- 菜单按钮 -->
    <button
      type="button"
      class="p-2 text-gray-600 dark:text-gray-400"
      @click="toggleMenu"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- 菜单内容 -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isMenuOpen"
        class="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50"
      >
        <div class="px-4 py-2 space-y-1">
          <nav-link
            v-for="item in menuItems"
            :key="item.path"
            :href="item.path"
            :label="item.label"
            @click="closeMenu"
          />
          
          <!-- 主题选择 -->
          <div class="pt-3 border-t border-gray-200 dark:border-gray-800">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-3">主题</p>
            <select
              :value="currentTheme"
              class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              @change="handleThemeChange"
            >
              <option
                v-for="theme in themes"
                :key="theme.value"
                :value="theme.value"
              >
                {{ theme.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'

// 使用主题组合式函数
const { currentTheme, themes, setTheme } = useTheme()

// 响应式状态
const isMenuOpen = ref(false)

// 菜单项配置
const menuItems = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '博客' },
  { path: '/shuo-shuo', label: '说说' }
]

// 方法定义
/**
 * 切换菜单状态
 */
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

/**
 * 关闭菜单
 */
const closeMenu = () => {
  isMenuOpen.value = false
}

/**
 * 处理主题变更
 */
const handleThemeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setTheme(target.value as 'light' | 'dark' | 'eye-care')
  closeMenu()
}

/**
 * 处理点击外部关闭菜单
 */
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const button = document.querySelector('button[stroke-linecap="round"]')
  
  if (isMenuOpen.value && 
      !target.closest('.mobile-menu-container') && 
      !button?.contains(target)) {
    closeMenu()
  }
}

/**
 * 处理窗口大小变化
 */
const handleResize = () => {
  if (window.innerWidth >= 768) {
    closeMenu()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<script lang="ts">
// 导航链接组件
const NavLink = {
  props: {
    href: String,
    label: String
  },
  template: `
    <a 
      :href="href" 
      class="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
    >
      {{ label }}
    </a>
  `
}
</script>