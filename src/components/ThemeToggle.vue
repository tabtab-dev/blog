<template>
  <!-- 主题切换组件 -->
  <div class="relative">
    <!-- 桌面端主题选择器 -->
    <div class="hidden md:block">
      <button
        type="button"
        class="theme-dropdown-btn flex items-center space-x-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-2.5 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click="toggleDropdown"
      >
        <span class="w-4 h-4">
          <component :is="currentThemeIcon" class="w-4 h-4" />
        </span>
        <span class="hidden sm:inline">主题</span>
      </button>
      
      <!-- 下拉菜单 -->
      <div
        v-show="isDropdownOpen"
        class="absolute right-0 mt-1.5 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-0.5 z-50"
      >
        <button
          v-for="theme in themes"
          :key="theme.value"
          class="theme-option w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          :class="{ 'active': currentTheme === theme.value }"
          @click="setTheme(theme.value)"
        >
          <component :is="theme.icon" class="w-4 h-4" />
          <span>{{ theme.label }}</span>
        </button>
      </div>
    </div>

    <!-- 移动端主题选择器 -->
    <div class="md:hidden">
      <select
        :value="currentTheme"
        class="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
        @change="handleMobileChange"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 主题类型定义
type Theme = 'light' | 'dark' | 'eye-care'

// 主题配置
const themes = [
  {
    value: 'light' as Theme,
    label: '浅色',
    icon: 'SunIcon'
  },
  {
    value: 'dark' as Theme,
    label: '暗黑',
    icon: 'MoonIcon'
  },
  {
    value: 'eye-care' as Theme,
    label: '护眼',
    icon: 'EyeIcon'
  }
]

// 响应式状态
const currentTheme = ref<Theme>('light')
const isDropdownOpen = ref(false)

// 图标组件
const SunIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `
}

const MoonIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  `
}

const EyeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  `
}

// 计算属性
const currentThemeIcon = computed(() => {
  const theme = themes.find(t => t.value === currentTheme.value)
  return theme ? theme.icon : 'SunIcon'
})

// 方法定义
/**
 * 获取系统主题偏好
 */
const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

/**
 * 设置主题
 */
const setTheme = (theme: Theme) => {
  const html = document.documentElement
  
  // 移除所有主题类
  themes.forEach(({ value }) => {
    html.classList.remove(value)
  })
  html.classList.remove('dark')
  
  // 添加新主题类
  html.classList.add(theme)
  if (theme === 'dark') {
    html.classList.add('dark')
  }
  
  // 保存到本地存储
  localStorage.setItem('theme', theme)
  currentTheme.value = theme
  
  // 关闭下拉菜单
  isDropdownOpen.value = false
}

/**
 * 切换下拉菜单状态
 */
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

/**
 * 处理移动端主题变更
 */
const handleMobileChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setTheme(target.value as Theme)
}

/**
 * 点击外部关闭下拉菜单
 */
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-dropdown-btn') && !target.closest('#theme-menu')) {
    isDropdownOpen.value = false
  }
}

/**
 * 监听系统主题变化
 */
const handleSystemThemeChange = (event: MediaQueryListEvent) => {
  if (!localStorage.getItem('theme')) {
    setTheme(event.matches ? 'dark' : 'light')
  }
}

// 生命周期
onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme') as Theme || getSystemTheme()
  setTheme(savedTheme)
  
  // 添加事件监听
  document.addEventListener('click', handleClickOutside)
  
  // 监听系统主题变化
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('click', handleClickOutside)
  
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})
</script>

<style scoped>
.theme-option.active {
  background-color: rgb(243 244 246);
  color: rgb(17 24 39);
  font-weight: 500;
}

.dark .theme-option.active {
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
}

.theme-option.active svg {
  color: rgb(59 130 246);
}

.dark .theme-option.active svg {
  color: rgb(59 130 246);
}
</style>