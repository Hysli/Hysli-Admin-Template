<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="邮箱/手机号">
        <n-input v-model:value="state.queryParams.emailOrPhone" class="w180" placeholder="输入邮箱或手机号" clearable />
      </n-form-item>
      <n-form-item label="状态">
        <n-select v-model:value="state.queryParams.status" :options="state.statueOptions" class="w180"
          clearable></n-select>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable" v-if="hasPermission(['service/user/auth/getUserList'])">查询</n-button>
        <n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/user/auth/addUser'])">
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
      :actionColumn="actionColumn" :scroll-x="1360" @update:checked-row-keys="onCheckedRow">
      <!-- <template #tableTitle>
        <n-button type="primary" @click="handleAdd">
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

  <UserEdit ref="userEditRef" :title="state.editTitle" @handleQuery="reloadTable"></UserEdit>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getUserList, deleteUser } from '@/api/system/user'
import { useDialog, NTag,NImage } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime } from '@/utils/dateUtil'
import UserEdit from '@/views/system/user/edit.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const dialog = useDialog()
const actionRef = ref()
const userEditRef = ref<InstanceType<typeof UserEdit>>()
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
    emailOrPhone: undefined,
    status: undefined
  },
  tableData: [] as any,
  editTitle: ''
})

onMounted(async () => {

})

// 查询
const loadDataTable = async (res) => {
  const params = { ...state.queryParams, ...res }
  const result = await getUserList(params)
  // console.log(result)
  const list = result.data?.rows ?? []
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
  state.queryParams.emailOrPhone = undefined
  state.queryParams.status = undefined
}

// 表格列
const columns = [
  {
    title: '序号',
    key: 'row',
    width: 50,
    render(row: any, index: number) {
      return h('span', index + 1)
    }
  },
  {
    title: '头像',
    key: 'avatar',
    width: 70,
    render(row: any) {
      if (row.avatar) {
        return h('div', { class: 'cPic' }, h(NImage, { src: row.avatar, 'object-fit': 'fill' }))
      }
    }
  },
  {
    title: '用户名',
    key: 'username',
    width: 80,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 80
  },
  {
    title: '邮箱',
    key: 'email',
    width: 100,
  },
  {
    title: '手机号',
    key: 'phone',
    width: 90
  },
  {
    title: '角色',
    key: 'roles',
    width: 80,
    render(row) {
      return row.roleList?.map((item) => item.name).join('，')
    }
  },
	{
		title: '可提现余额（元）',
		key: 'balance',
		width: 100,
		render(row: any) {
			if (row.balance == 0) return 0
			return row.balance ? Number(row.balance / 1000) : '--'
		}
	},
	{
		title: '可用点数',
		key: 'points',
		width: 80,
		render(row: any) {
			if (row.points == 0) return 0
			return row.points ? Number(row.points) : '--'
		}
	},
	{
		title: '赠送点数',
		key: 'gift_points',
		width: 80,
		render(row: any) {
			if (row.gift_points == 0) return 0
			return row.gift_points ? Number(row.gift_points) : '--'
		}
	},
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(row) {
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
    title: '创建时间',
    key: 'create_time',
    width: 120,
    render(row) {
      return formatToDateTime(new Date(row.create_time))
    }
  },
]

const authWidth = () => {
  if (hasPermission(['service/user/auth/updateUser']) && hasPermission(['service/user/auth/deleteUser'])) {
    return 120
  }
  if (hasPermission(['service/user/auth/updateUser']) || hasPermission(['service/user/auth/deleteUser'])) {
    return 80
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
      auth: ['service/user/auth/updateUser'],
    },
    {
      label: '删除',
      type: 'error',
      // 配置 color 会覆盖 type
      color: 'red',
      icon: DeleteOutlined,
      onClick: handleDelete.bind(null, record),
      // 根据业务控制是否显示 isShow 和 auth 是并且关系
      ifShow: () => {
        return true
      },
      // 根据权限控制是否显示: 有权限，会显示，支持多个
      auth: ['service/user/auth/deleteUser'],
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
  state.editTitle = '添加用户'
  userEditRef.value?.openModal({})
}

// 编辑
const handleEdit = (record) => {
  // console.log(record)
  state.editTitle = '编辑用户'
  userEditRef.value?.openModal(record)
}

// 删除
const handleDelete = (record) => {
  dialog.info({
    title: '提示',
    content: `您想删除用户：【${(record.username ?? record.nickname) ?? record.phone}】？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const params = {
        _id: record._id
      }
      await deleteUser(params)
      reloadTable()
    },
    onNegativeClick: () => {
      // message.success('取消')
    },
  })
}
</script>
<style lang="less" scoped>
:deep(.cPic) {
  width: 42px;
  height: 42px;
}

:deep(.n-image) {
  height: 42px;
}
</style>
