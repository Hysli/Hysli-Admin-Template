<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="类型">
        <n-select v-model:value="state.queryParams.type" :options="state.typeOptions" class="w180" clearable></n-select>
      </n-form-item>
      <n-form-item label="状态">
        <n-select v-model:value="state.queryParams.status" :options="state.statueOptions" class="w180"
          clearable></n-select>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable"
          v-if="hasPermission(['service/pay_config/auth/getPayConfigList'])">查询</n-button>
        <n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/pay_config/auth/addPayConfig'])">
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
    </BasicTableCustom>
  </n-card>

  <PayConfigEdit ref="payConfigEditRef" :title="state.editTitle" @handleQuery="reloadTable">
  </PayConfigEdit>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getPayConfigList, deletePayConfig } from '@/api/system/pay_config'
import { useDialog, NTag } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime } from '@/utils/dateUtil'
import PayConfigEdit from '@/views/system/pay_config/edit.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const dialog = useDialog()
const actionRef = ref()
const payConfigEditRef = ref<InstanceType<typeof PayConfigEdit>>()
// 定义全局变量
const state = reactive({
  typeOptions: [
    {
      label: '微信公众号',
      value: 10
    },
    {
      label: '微信小程序',
      value: 11
    },
    {
      label: '支付宝',
      value: 20
    },
    {
      label: 'Paypal',
      value: 30
    },
    {
      label: 'Stripe',
      value: 40
    }
  ],
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
    type: undefined,
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
  const result = await getPayConfigList(params)
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
  state.queryParams.type = undefined
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
    title: '类型',
    key: 'type',
    width: 100,
    render(row) {
      return state.typeOptions.find(x => x.value == row.type)?.label
    }
  },
  {
    title: '应用ID',
    key: 'app_id',
    width: 120
  },
  {
    title: '应用密钥',
    key: 'app_secret',
    width: 120,
    render(row) {
      if (!row?.app_secret) return ''
      return '******'
    }
  },
  {
    title: '商户号',
    key: 'mch_id',
    width: 120,
  },
  {
    title: '商户Key',
    key: 'mch_key',
    width: 120,
    render(row) {
      if (!row?.app_secret) return ''
      return '******'
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
    title: '修改时间',
    key: 'update_time',
    width: 120,
    render(row) {
      return formatToDateTime(new Date(row.update_time))
    }
  },
]

const authWidth = () => {
  if (hasPermission(['service/pay_config/auth/updatePayConfig']) && hasPermission(['service/pay_config/auth/deletePayConfig'])) {
    return 100
  }
  if (hasPermission(['service/pay_config/auth/updatePayConfig']) || hasPermission(['service/pay_config/auth/deletePayConfig'])) {
    return 70
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
      auth: ['service/pay_config/auth/updatePayConfig'],
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
      auth: ['service/pay_config/auth/deletePayConfig'],
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
  state.editTitle = '添加支付配置'
  payConfigEditRef.value?.openModal({})
}

// 编辑
const handleEdit = (record) => {
  // console.log(record)
  state.editTitle = '编辑支付配置'
  payConfigEditRef.value?.openModal(record)
}

// 删除
const handleDelete = (record) => {
  dialog.info({
    title: '提示',
    content: `您想删支付配置：【${record.app_id}】？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialog.destroyAll()
      const params = {
        _id: record._id
      }
      await deletePayConfig(params)
      reloadTable()
    },
    onNegativeClick: () => {
      // message.success('取消')
    },
  })
}
</script>
<style lang="less" scoped></style>
