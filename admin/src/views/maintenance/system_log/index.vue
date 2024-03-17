<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="日期">
        <n-date-picker v-model:value="state.queryParams.rechargeRange" type="daterange" clearable />
      </n-form-item>
      <n-form-item label="类型">
        <n-select v-model:value="state.queryParams.method" :options="state.methodOptions" class="w180"
          clearable></n-select>
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
import { getSystemLogList } from '@/api/maintenance/system_log'
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
    method: undefined
  },
  tableData: [] as any,
  methodOptions: [
    {
      label: '调试',
      value: 'debug'
    },
    {
      label: '错误',
      value: 'error'
    },
    {
      label: '添加',
      value: 'add'
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
  const result = await getSystemLogList(params)
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
  state.queryParams.method = undefined
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
    title: '日志类型',
    key: 'method',
    width: 80,
    render(row) {
      if (!row?.method) return ''
      // return state.methodOptions.find(x => x.value == row.method)?.label
      let typeStr = 'default'
      if (row.method == 'add') {
        typeStr = 'success'
      }
      if (row.method == 'debug') {
        typeStr = 'warning'
      }
      if (row.method == 'error') {
        typeStr = 'error'
      }
      return h(
        NTag,
        {
          type: typeStr,
        },
        {
          default: () => state.methodOptions.find(x => x.value == row.method)?.label,
        }
      )
    },
  },
  {
    title: '参数(args)',
    key: 'args',
    width: 150,
    render(row) {
      if (!row?.args) return ''
      return JSON.stringify(row.args)
    }
  },
  {
    title: '内容(caller)',
    key: 'caller',
    width: 250
  },
  {
    title: '记录时间',
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
