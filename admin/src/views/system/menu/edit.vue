<template>
    <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog" style="width: 800px;">
        <template #header>
            <div>{{ props.title }}</div>
        </template>

        <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
            :label-width="100" class="py-4">
            <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="12" label="上级菜单" path="parent_id">
                    <n-tree-select placeholder="请选择上级菜单" :options="props.menuData" :default-value="state.ruleForm.parent_id"
                    :on-update:value="changeMenu" key-field="_id" label-field="title" show-path clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="菜单类型" path="type" :rule="[{ required: true, message: '菜单类型不能为空' }]">
                    <n-radio-group v-model:value="state.ruleForm.type" name="type" @update-value="checkMenuType">
                        <n-space>
                            <n-radio :value="1">目录</n-radio>
                            <n-radio :value="2">菜单</n-radio>
                            <n-radio :value="3">按钮</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="菜单名称" path="title"
                    :rule="[{ required: true, message: '菜单名称不能为空', trigger: 'blur' }]">
                    <n-input v-model:value="state.ruleForm.title" placeholder="请输入菜单名称" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="路由名称" path="name">
                    <n-input v-model:value="state.ruleForm.name" placeholder="请输入路由名称" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="路由路径" path="path">
                    <n-input v-model:value="state.ruleForm.path" placeholder="请输入路由路径" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="组件路径" path="component">
                    <n-select v-if="state.ruleForm.type == 1" v-model:value="state.ruleForm.component"
                        :options="state.componentOptions" placeholder="请选择组件路径" clearable></n-select>
                    <n-input v-else v-model:value="state.ruleForm.component" placeholder="请输入组件路径" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="菜单图标" path="icon">
                    <e-icon-picker ref="iconPicker" v-model="state.ruleForm.icon" :options="state.menuOptions"
                        default-icon="component EditPen" placeholder="请选择" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="重定向地址" path="redirect">
                    <n-input v-model:value="state.ruleForm.redirect" placeholder="重定向地址" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="链接地址" path="out_link">
                    <n-input v-model:value="state.ruleForm.out_link" placeholder="请输入链接地址" clearable />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type == 3" :span="12" label="权限标识" path="permission">
                    <n-input v-model:value="state.ruleForm.permission" placeholder="请输入权限标识" clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="菜单排序" path="sort">
                    <n-input-number v-model:value="state.ruleForm.sort" :min="0" :max="999999" style="width: 260px;" />
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="是否隐藏" path="is_hide">
                    <n-radio-group v-model:value="state.ruleForm.is_hide" name="is_hide">
                        <n-space>
                            <n-radio :value="true">隐藏</n-radio>
                            <n-radio :value="false">不隐藏</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="是否缓存" path="is_keep_alive">
                    <n-radio-group v-model:value="state.ruleForm.is_keep_alive" name="is_keep_alive">
                        <n-space>
                            <n-radio :value="true">缓存</n-radio>
                            <n-radio :value="false">不缓存</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="是否固定" path="is_affix">
                    <n-radio-group v-model:value="state.ruleForm.is_affix" name="is_affix">
                        <n-space>
                            <n-radio :value="true">固定</n-radio>
                            <n-radio :value="false">不固定</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi v-if="state.ruleForm.type != 3" :span="12" label="是否内嵌" path="is_frame">
                    <n-radio-group v-model:value="state.ruleForm.is_frame" name="is_frame">
                        <n-space>
                            <n-radio :value="true">内嵌</n-radio>
                            <n-radio :value="false">不内嵌</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="状态" path="status">
                    <n-radio-group v-model:value="state.ruleForm.status" name="status">
                        <n-space>
                            <n-radio :value="1">启用</n-radio>
                            <n-radio :value="2">禁用</n-radio>
                        </n-space>
                    </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="备注" path="remark">
                    <n-input type="textarea" placeholder="请输入备注" v-model:value="state.ruleForm.remark" />
                </n-form-item-gi>
            </n-grid>
        </n-form>

        <template #action>
            <n-space>
                <n-button @click="() => (state.showModal = false)">取消</n-button>
                <n-button type="info" :loading="state.btnLoading" @click="confirmForm">确定</n-button>
            </n-space>
        </template>
    </n-modal>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { addMenu, updateMenu } from '@/api/system/menu'
// import elementList from 'e-icon-picker/icon/ele/element-plus.js'
import eIconList from 'e-icon-picker/icon/default-icon/eIconList.js'
import fontawesomeList from 'e-icon-picker/icon/fontawesome/font-awesome.v4.7.0'

const ruleFormRef = ref()
const props = defineProps({
    title: String,
    menuData: null
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
    showModal: false,
    btnLoading: false,
    ruleForm: {} as any,
    menuOptions: { addIconList: [...eIconList, ...fontawesomeList] },
    componentOptions: [
        {
            label: 'Layout',
            value: 'Layout'
        },
        {
            label: 'ParentLayout',
            value: 'ParentLayout'
        }
    ]
})

// 打开弹窗
const openModal = (record: any) => {
    // console.log('打开弹窗', record)
    if (Object.keys(record).length > 0) {
        state.ruleForm = JSON.parse(JSON.stringify(record))
    }
    else {
        state.ruleForm = {
            parent_id: '',
            type: 1,
            name: '',
            path: '',
            component: null,
            redirect: '',
            icon: '',
            permission: '',
            title: '',
            is_frame: false,
            out_link: '',
            is_hide: false,
            is_keep_alive: false,
            is_affix: false,
            remark: '',
            status: 1,
            sort: 0
        }
    }
    state.showModal = true
}

// 关闭弹窗
const closModal = () => {
    emits('handleQuery')
    state.showModal = false
}

const changeMenu = (value) => {
    state.ruleForm.parent_id = value
}

// 确认
const confirmForm = () => {
    state.btnLoading = true
    ruleFormRef.value.validate(async (errors) => {
        if (!errors) {
            try {
                if (state.ruleForm._id) {
                    const params = state.ruleForm
                    await updateMenu(params)
                    closModal()
                } else {
                    const params = state.ruleForm
                    await addMenu(params)
                    closModal()
                }
            } catch (e) { }
        }
        state.btnLoading = false
    })
}

const checkMenuType = (value: number) => {
    if (value == 1) {
        state.ruleForm.component = null
    } else {
        state.ruleForm.component = ''
    }
}

// 导出对象
defineExpose({ openModal })
</script>
<style lang="less" scoped>
.e-icon-picker {
    width: 260px;
}

:deep(.popper) {
    width: auto !important;
}
</style>