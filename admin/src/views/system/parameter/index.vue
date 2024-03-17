<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="名称">
        <n-input v-model:value="state.queryParams.name" class="w180" placeholder="输入参数名称" clearable />
      </n-form-item>
      <n-form-item label="Key值">
        <n-input v-model:value="state.queryParams.key" class="w180" placeholder="输入Key值" clearable />
      </n-form-item>
      <n-form-item label="分组">
        <n-select v-model:value="state.queryParams.group" :options="state.groupOptions" class="w180"
          clearable></n-select>
      </n-form-item>
      <n-form-item label="状态">
        <n-select v-model:value="state.queryParams.status" :options="state.statueOptions" class="w180"
          clearable></n-select>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable"
          v-if="hasPermission(['service/parameter/auth/getParameterList'])">查询</n-button>
        <n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/parameter/auth/addParameter'])">
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

  <SystemParamterEdit ref="systemParamterEditRef" :title="state.editTitle" :groupOptions="state.groupOptions"
    @handleQuery="reloadTable">
  </SystemParamterEdit>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getParameterList, deleteParameter } from '@/api/system/parameter'
import { useDialog, NTag } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime } from '@/utils/dateUtil'
import SystemParamterEdit from '@/views/system/parameter/edit.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const dialog = useDialog()
const actionRef = ref()
const systemParamterEditRef = ref<InstanceType<typeof SystemParamterEdit>>()

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
    key: undefined,
    group: undefined,
    status: undefined
  },
  tableData: [] as any,
  editTitle: '',
  groupOptions: [
    {
      label: '短信',
      value: 'sms'
    },
    {
      label: '邮件',
      value: 'emai'
    }, {
      label: '存储',
      value: 'storage'
    }
  ]
})

onMounted(async () => {

})

// 查询
const loadDataTable = async (res) => {
  const params = { ...state.queryParams, ...res }
  const result = await getParameterList(params)
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
  state.queryParams.name = undefined
  state.queryParams.key = undefined
  state.queryParams.group = undefined
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
    title: '参数名称',
    key: 'name',
    width: 120,
  },
  {
    title: 'Key值',
    key: 'key',
    width: 120
  },
  {
    title: 'Value值',
    key: 'value',
    width: 150
  },
  {
    title: '分组',
    key: 'group',
    width: 80,
    render(row) {
      if (!row?.group) return ''
      return state.groupOptions.find(x => x.value == row.group)?.label
    },
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
  if (hasPermission(['service/parameter/auth/updateParameter']) && hasPermission(['service/parameter/auth/deleteParameter'])) {
    return 95
  }
  if (hasPermission(['service/parameter/auth/updateParameter']) || hasPermission(['service/parameter/auth/deleteParameter'])) {
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
      auth: ['service/parameter/auth/updateParameter'],
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
      auth: ['service/parameter/auth/deleteParameter'],
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
  state.editTitle = '添加参数'
  systemParamterEditRef.value?.openModal({})
}

// 编辑
const handleEdit = (record) => {
  // console.log(record)
  state.editTitle = '编辑参数'
  systemParamterEditRef.value?.openModal(record)
}

// 删除
const handleDelete = (record) => {
  dialog.info({
    title: '提示',
    content: `您想删除参数：【${record.name}】？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialog.destroyAll()
      const params = {
        _id: record._id
      }
      await deleteParameter(params)
      reloadTable()
    },
    onNegativeClick: () => {
      // message.success('取消')
    },
  })
}
</script>
<style lang="less" scoped></style>
