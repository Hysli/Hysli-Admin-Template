<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="操作日期">
        <n-date-picker v-model:value="state.queryParams.rechargeRange" type="daterange" clearable />
      </n-form-item>
      <n-form-item label="操作类型">
        <n-select v-model:value="state.queryParams.type" :options="state.typeOptions" class="w180" clearable></n-select>
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable">查询</n-button>
        <!-- <n-button @click="resetQuery">重置</n-button> -->
      </n-space>
    </n-form>

    <BasicTableCustom :columns="columns" :request="loadDataTable" :row-key="row => row._id" ref="actionRef"
      :scroll-x="1360" @update:checked-row-keys="onCheckedRow">
      <!-- <template #toolbar>
          <n-button type="primary" @click="reloadTable">刷新数据</n-button>
        </template> -->
    </BasicTableCustom>
  </n-card>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom } from '@/components/Table'
import { getOperateLogList } from '@/api/maintenance/operate_log'
import { NButton, NTag } from 'naive-ui'
import { formatToDateTime, addDaysByNow } from '@/utils/dateUtil'

const actionRef = ref()
// 定义全局变量
const state = reactive({
  queryParams: {
    rechargeRange: [
      new Date(addDaysByNow(-30) + ' 00:00:00').valueOf(),
      new Date(addDaysByNow(0) + ' 23:59:59').valueOf()
    ],
    type: undefined
  },
  tableData: [] as any,
  typeOptions: [
    {
      label: '查询',
      value: 'get'
    },
    {
      label: '添加',
      value: 'add'
    },
    {
      label: '更新',
      value: 'update'
    }, {
      label: '删除',
      value: 'delete'
    }
  ]
})

onMounted(async () => { })

// 查询
const loadDataTable = async res => {
  // 判断rechargeRange[1]存在且不是23:59:59
  if (!state?.queryParams?.rechargeRange?.[1].toString().endsWith('99000')) {
    state.queryParams.rechargeRange[1] += 86400000 - 1
  }
  const params = { ...state.queryParams, ...res }
  const result = await getOperateLogList(params)
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
  state.queryParams.rechargeRange = [
    new Date(addDaysByNow(-30) + ' 00:00:00').valueOf(),
    new Date(addDaysByNow(0) + ' 23:59:59').valueOf()
  ]
  state.queryParams.type = undefined
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
    title: '操作用户',
    key: 'user',
    width: 100,
    render(row: any) {
      let msg = ''
      if (row.user?.nickname) msg += row.user.nickname
      else if (row.user?.username) msg += (msg ? '-' : '') + row.user.username
      else if (row.user?.phone) msg = row.user.phone
      else if (row.user?.email) msg = row.user.email
      return msg
    }
  },
  {
    title: '操作类型',
    key: 'type',
    width: 80,
    render(row) {
      if (!row?.type) return ''
      // return state.typeOptions.find(x => x.value == row.type)?.label
      let typeStr = 'default'
      if (row.type == 'add') {
        typeStr = 'success'
      }
      if (row.type == 'update') {
        typeStr = 'primary'
      }
      if (row.type == 'delete') {
        typeStr = 'error'
      }
      return h(
        NTag,
        {
          type: typeStr,
        },
        {
          default: () => state.typeOptions.find(x => x.value == row.type)?.label,
        }
      )
    },
  },
  {
    title: '访问IP',
    key: 'ip',
    width: 100
  },
  {
    title: '云函数地址',
    key: 'path',
    width: 150
  },
  {
    title: '数据内容',
    key: 'content',
    width: 240
  },
  {
    title: '操作时间',
    key: 'create_time',
    width: 120,
    render(row) {
      return formatToDateTime(new Date(row.create_time))
    }
  }
]

const onCheckedRow = rowKeys => {
  console.log(rowKeys)
}

// 刷新数据
const reloadTable = () => {
  actionRef.value.reload()
}
</script>
<style lang="less" scoped></style>
