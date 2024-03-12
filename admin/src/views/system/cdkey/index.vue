<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="密钥">
        <n-input v-model:value="state.queryParams.secret_key" class="w180" placeholder="输入密钥" clearable />
      </n-form-item>
      <n-form-item label="状态">
        <n-select v-model:value="state.queryParams.status" :options="state.statueOptions" class="w180"
          clearable></n-select>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable"
          v-if="hasPermission(['service/cdkey/auth/getCdkeyList'])">查询</n-button>
        <!-- <n-button @click="resetQuery">重置</n-button> -->
        <n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/cdkey/auth/addCdkey'])">
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
				<n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/cdkey/auth/addCdkey'])">
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

  <CdkeyAdd ref="cdkeyAddRef" :title="state.editTitle" @handleQuery="reloadTable">
  </CdkeyAdd>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getCdkeyList, deleteCdkey, updateCdkey } from '@/api/system/cdkey'
import { useDialog, useMessage, NTag, NButton } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime } from '@/utils/dateUtil'
import CdkeyAdd from '@/views/system/cdkey/add.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const message = useMessage()
const dialog = useDialog()
const actionRef = ref()
const cdkeyAddRef = ref<InstanceType<typeof CdkeyAdd>>()
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
    secret_key: undefined,
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
  const result = await getCdkeyList(params)
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
  state.queryParams.secret_key = undefined
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
    title: '前缀',
    key: 'prefix',
    width: 100,
  },
  {
    title: '密钥',
    key: 'secret_key',
    width: 180,
    render(row) {
      return h('div', [
        h('span', { style: 'margin-right:8px;', innerHTML: row.secret_key }),
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            onClick() {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(row.secret_key)
                  .then(() => {
                    message.success('复制成功')
                  })
                  .catch((error: any) => {
                    message.error('复制失败：' + error)
                  })
              } else {
                const textarea = document.createElement('textarea')
                textarea.value = row.secret_key
                textarea.setAttribute('readonly', '')
                textarea.style.position = 'absolute'
                textarea.style.left = '-9999px'
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
                message.success('复制成功')
              }
            }
          },
          { default: () => '点击复制' }
        )
      ])
    }
  },
  {
    title: '点数',
    key: 'points',
    width: 80
  },
  {
    title: '过期时间',
    key: 'expires_time',
    width: 120,
    render(row: any) {
      return formatToDateTime(new Date(row.expires_time))
    }
  },
  {
    title: '是否计入赠送',
    key: 'is_gift',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.is_gift ? 'success' : 'error',
        },
        {
          default: () => (row.is_gift ? '是' : '否'),
        }
      )
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
    key: 'create_time',
    width: 120,
    render(row) {
      return formatToDateTime(new Date(row.create_time))
    }
  },
  {
    title: '使用时间',
    key: 'use_time',
    width: 120,
    render(row) {
      if (!row.use_time) return
      return formatToDateTime(new Date(row.use_time))
    }
  },
]

const authWidth = () => {
  if (hasPermission(['service/cdkey/auth/updateCdkey']) && hasPermission(['service/cdkey/auth/deleteCdkey'])) {
    return 105
  }
  if (hasPermission(['service/cdkey/auth/updateCdkey']) || hasPermission(['service/cdkey/auth/deleteCdkey'])) {
    return 60
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
      label: record.status == 1 ? '禁用' : '启用',
      type: record.status == 1 ? 'primary' : 'success',
      icon: EditOutlined,
      onClick: handleEdit.bind(null, record),
      ifShow: () => {
        return !record.use_time && !record.uid
      },
      auth: ['service/cdkey/auth/updateCdkey'],
    },
    {
      label: '删除',
      type: 'error',
      color: 'red',
      icon: DeleteOutlined,
      onClick: handleDelete.bind(null, record),
      ifShow: () => {
        return !record.use_time && !record.uid
      },
      auth: ['service/cdkey/auth/deleteCdkey'],
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
  state.editTitle = '添加卡密'
  cdkeyAddRef.value?.openModal({})
}

// 编辑
const handleEdit = (record) => {
  dialog.info({
    title: '提示',
    content: `您想${record.status == 1 ? '禁用' : '启用'}卡密：【${record.secret_key}】？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialog.destroyAll()
      const params = {
        _id: record._id,
        status: record.status == 1 ? 2 : 1
      }
      await updateCdkey(params)
      reloadTable()
    },
    onNegativeClick: () => {
      // message.success('取消')
    },
  })
}

// 删除
const handleDelete = (record) => {
  dialog.info({
    title: '提示',
    content: `您想删除卡密：【${record.secret_key}】？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialog.destroyAll()
      const params = {
        _id: record._id
      }
      await deleteCdkey(params)
      reloadTable()
    },
    onNegativeClick: () => {
      // message.success('取消')
    },
  })
}
</script>
<style lang="less" scoped></style>
