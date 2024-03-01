<template>
  <div class="logo" @click="toIndex">
    <!-- 非白色主题 -->
    <img v-show="!collapsed && settingStore.navTheme !== 'light'" :src="websiteConfig.logo" :alt="websiteConfig.title" :class="{ 'mr-2': !collapsed }" />
    <!-- <h2 v-show="!collapsed" class="title">{{ websiteConfig.title }}</h2> -->
    <img v-show="collapsed && settingStore.navTheme !== 'light'" :src="websiteConfig.logo_collapsed" :alt="websiteConfig.title" :class="{ 'mr-2': collapsed }" />
    <!-- 白色主题 -->
    <img v-show="!collapsed && settingStore.navTheme === 'light'" :src="websiteConfig.logo_blue" :alt="websiteConfig.title" />
    <img v-show="collapsed && settingStore.navTheme === 'light'" :src="websiteConfig.logo_blue_collapsed" :alt="websiteConfig.title" />
  </div>

</template>

<script lang="ts">
import { websiteConfig } from '@/config/website.config'
import { useProjectSettingStore } from '@/store/modules/projectSetting'
import { useGo } from '@/hooks/web/usePage'
const settingStore = useProjectSettingStore()
import { PageEnum } from '@/enums/pageEnum'
  
export default {
	name: 'Index',
	props: {
		collapsed: {
			type: Boolean,
		},
	},
	data() {
		return {
			websiteConfig,
			settingStore
		}
	},
	setup(){
		const go = useGo()
		const toIndex = () => {
			go(PageEnum.BASE_HOME_REDIRECT,true)
		}
		return {
			toIndex
		}
	},
}
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 44px;
      margin: 12px 0 0 0;
    }
  }
</style>
