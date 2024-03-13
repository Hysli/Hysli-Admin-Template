<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="标题">
        <n-input v-model:value="state.queryParams.title" class="w180" placeholder="输入标题" clearable />
      </n-form-item>
      <n-form-item label="分类">
        <n-select v-model:value="state.queryParams.category_id" :options="state.categoryData" label-field="name"
          value-field="_id" class="w180" clearable></n-select>
      </n-form-item>
      <n-form-item label="状态">
        <n-select v-model:value="state.queryParams.status" :options="state.statueOptions" class="w180"
          clearable></n-select>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable"
          v-if="hasPermission(['service/content/article/auth/getArticleList'])">查询</n-button>
        <n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/content/article/auth/addArticle'])">
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

  <ArticleEdit ref="articleEditRef" :title="state.editTitle" :categoryData="state.categoryData"
    @handleQuery="reloadTable">
  </ArticleEdit>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getArticleCategoryList } from '@/api/content/article_category'
import { getArticleList, deleteArticle } from '@/api/content/article'
import { useDialog, NTag, NImage } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime, formatToDate } from '@/utils/dateUtil'
import ArticleEdit from '@/views/content/article/edit.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const dialog = useDialog()
const actionRef = ref()
const articleEditRef = ref<InstanceType<typeof ArticleEdit>>()
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
    title: undefined,
    category_id: undefined,
    status: undefined
  },
  tableData: [] as any,
  editTitle: '',
  // 分类
  categoryData: [] as any
})

onMounted(async () => {
  await getCategoryList()
})

// 获取分类列表
const getCategoryList = async () => {
  const params = { page: 1, pageSize: 50 }
  const result = await getArticleCategoryList(params)
  state.categoryData = result.data?.rows ?? []
  // console.log(state.categoryData)
}

// 查询
const loadDataTable = async (res) => {
  const params = { ...state.queryParams, ...res }
  const result = await getArticleList(params)
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
  state.queryParams.title = undefined
  state.queryParams.category_id = undefined
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
    title: '标题',
    key: 'title',
    width: 120,
  },
  {
    title: '图片',
    key: 'picture',
    width: 90,
    render(row: any) {
      if (row.picture) {
        return h('div', { class: 'cPic' }, h(NImage, { src: row.picture, 'object-fit': 'fill' }))
      }
    }
  },
  {
    title: '所属分类',
    key: 'articleCategory',
    width: 150,
    render(row: any) {
      if (!row.articleCategory) return ''
      return row.articleCategory.name
    }
  },
  {
    title: '简介',
    key: 'introduction',
    width: 120,
  },
  {
    title: '发布日期',
    key: 'release_date',
    width: 100,
    render(row) {
      return formatToDate(new Date(row.release_date))
    }
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
  if (hasPermission(['service/content/article/auth/updateArticle']) && hasPermission(['service/content/article/auth/deleteArticle'])) {
    return 110
  }
  if (hasPermission(['service/content/article/auth/updateArticle']) || hasPermission(['service/content/article/auth/deleteArticle'])) {
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
      auth: ['service/content/article/auth/updateArticle'],
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
      auth: ['service/content/article/auth/deleteArticle'],
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
  state.editTitle = '添加内容'
  articleEditRef.value?.openModal({})
}

// 编辑
const handleEdit = (record) => {
  // console.log(record)
  state.editTitle = '编辑内容'
  articleEditRef.value?.openModal(record)
}

// 删除
const handleDelete = (record) => {
  dialog.info({
    title: '提示',
    content: `您想删除内容：【${record.title}】？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialog.destroyAll()
      const params = {
        _id: record._id
      }
      await deleteArticle(params)
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
  width: 48px;
  height: 42px;
}
</style>
