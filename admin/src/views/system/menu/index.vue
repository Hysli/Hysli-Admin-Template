<template>
	<n-card :bordered="false" class="proCard">
		<n-form label-placement="left" inline>
			<n-form-item label="名称">
				<n-input v-model:value="state.queryParams.name" class="w180" placeholder="输入菜单名称" clearable />
			</n-form-item>
			<n-form-item label="状态">
				<n-select v-model:value="state.queryParams.status" :options="state.statueOptions" class="w180"
					clearable></n-select>
			</n-form-item>
			<n-space>
				<n-button type="primary" @click="reloadTable" v-if="hasPermission(['service/menu/sys/getMenuList'])">查询</n-button>
				<!-- <n-button @click="resetQuery">重置</n-button> -->
				<n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/menu/sys/addMenu'])">
					<template #icon>
						<n-icon>
							<PlusOutlined />
						</n-icon>
					</template>
					新建
				</n-button>
			</n-space>

		</n-form>

		<BasicTableCustom :columns="columns" :request="loadDataTable" :row-key="(row) => row._id" ref="actionRef"
			:actionColumn="actionColumn" 
			:pagination="false" 
			:scroll-x="1360" 
			default-expand-all
			@update:checked-row-keys="onCheckedRow">
			<!-- <template #tableTitle>
				<n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/menu/sys/addMenu'])">
					<template #icon>
						<n-icon>
							<PlusOutlined />
						</n-icon>
					</template>
					新建
				</n-button>
			</template> -->
			<!-- <template #toolbar>
        <n-button type="primary" @click="reloadTable">刷新数据</n-button>
      </template> -->
		</BasicTableCustom>
	</n-card>

	<MenuEdit ref="menuEditRef" :title="state.editTitle" :menuData="state.menuData" @handleQuery="reloadTable"></MenuEdit>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getMenuList, deleteMenu } from '@/api/system/menu'
import { useDialog, NTag, NIcon } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime } from '@/utils/dateUtil'
import MenuEdit from '@/views/system/menu/edit.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const dialog = useDialog()
const actionRef = ref()
const menuEditRef = ref<InstanceType<typeof MenuEdit>>()
// 定义全局变量
const state = reactive({
	statueOptions: [
		{
			label: '已启用',
			value: 1
		},
		{
			label: '已禁用',
			value: 2
		}
	],
	queryParams: {
		name: undefined,
		status: undefined
	},
	menuData: null,
	editTitle: ''
})

onMounted(async () => {

})

// 查询
const loadDataTable = async (res) => {
	const params = { ...state.queryParams, ...res }
	const result = await getMenuList(params)
	// console.log(result)
	const list = result?.data ?? []
	state.menuData = list
	// console.log('menuData', state.menuData)
	const total = result.data?.total ?? 0
	return {
		list,
		page: res.page,
		pageSize: res.pageSize,
		itemCount: total,
		pageCount: parseInt(total / res.pageSize)
	}
}

// 重置
const resetQuery = () => {
	state.queryParams.name = undefined
	state.queryParams.status = undefined
}

// 表格列
const columns = [
	{
		title: '菜单名称',
		key: 'title',
		width: 100,
	},
	{
		title: '类型',
		key: 'type',
		width: 80,
		render(row: any) {
			return h(
				NTag,
				{
					type: menuType(row.type),//row.status == 1 ? 'success' : 'error',
				},
				{
					default: () => {
						switch (row.type) {
							case 1:
								return '目录'
							case 2:
								return '菜单'
							case 3:
								return '按钮'
							default:
								return ''
						}
					},
				}
			)
		}
	},
	{
		title: '图标',
		key: 'icon',
		width: 100,
		render: (row: any) => {
			if (row.icon) {
				return h('span', { class: row.icon })
			}
			// let icon = 'http://www.w3.org/2000/svg'
			// return () =>
			//   h(NIcon, null, {
			//     default: () =>
			//       h('svg', { class: `icon`, 'aria-hidden': 'true' }, h('use', { 'xlink:href': `#${icon}` }))
			//   })
		}
	},
	{
		title: '路由路径',
		key: 'path',
		width: 120,
	},
	{
		title: '组件路径',
		key: 'component',
		width: 120,
	},
	{
		title: '权限标识',
		key: 'permission',
		width: 100,
	},
	{
		title: '排序',
		key: 'sort',
		width: 80,
	},
	{
		title: '状态',
		key: 'status',
		width: 80,
		render(row: any) {
			return h(
				NTag,
				{
					type: row.status == 1 ? 'success' : 'error',
				},
				{
					default: () => (row.status == 1 ? '已启用' : '已禁用'),
				}
			)
		},
	},
	{
		title: '修改时间',
		key: 'update_time',
		width: 120,
		render(row) {
			return formatToDateTime(new Date(row.update_time))
		}
	},
]

const menuType = (type: number) => {
	switch (type) {
		case 1:
			return 'warning'
		case 2:
			return 'error'
		case 3:
			return 'default'
		default:
			return 'default'
	}
}

const authWidth = () => {
	if (hasPermission(['service/menu/sys/updateMenu']) && hasPermission(['service/menu/sys/deleteMenu'])) {
		return 100
	}
	if (hasPermission(['service/menu/sys/updateMenu']) || hasPermission(['service/menu/sys/deleteMenu'])) {
		return 65
	}
	return 0
}

// 操作列
const actionColumn = reactive({
	width: authWidth(),
	title: '操作',
	key: 'action',
	fixed: 'right',
	align: 'center',
	render(record) {
		return h(TableAction as any, {
			style: 'text',
			actions: createActions(record),
		})
	},
})
// 操作列按钮
const createActions = (record) => {
	return [
		{
			label: '编辑',
			type: 'primary',
			icon: EditOutlined,
			onClick: handleEdit.bind(null, record),
			ifShow: () => {
				return true
			},
			auth: ['service/menu/sys/updateMenu'],
		},
		{
			label: '删除',
			type: 'error',
			color: 'red',
			icon: DeleteOutlined,
			onClick: handleDelete.bind(null, record),
			ifShow: () => {
				return true
			},
			auth: ['service/menu/sys/deleteMenu'],
		},
	]
}

const onCheckedRow = (rowKeys) => {
	console.log(rowKeys)
}

// 刷新数据
const reloadTable = () => {
	actionRef.value.reload()
}

// 新增
const handleAdd = () => {
	state.editTitle = '添加菜单'
	menuEditRef.value?.openModal({})
}

// 编辑
const handleEdit = (record) => {
	// console.log(record)
	state.editTitle = '编辑菜单'
	menuEditRef.value?.openModal(record)
}

// 删除
const handleDelete = (record) => {
	dialog.info({
		title: '提示',
		content: `您想删除菜单：【${record.title}】？`,
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: async () => {
			dialog.destroyAll()
			const params = {
				_id: record._id
			}
			await deleteMenu(params)
			reloadTable()
		},
		onNegativeClick: () => {
			// message.success('取消')
		},
	})
}
</script>
<style lang="less" scoped></style>