<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="充值日期">
        <n-date-picker v-model:value="state.queryParams.rechargeRange" type="daterange" clearable />
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
import { getRechargeRecordList } from '@/api/business/recharge_record'
import { NButton } from 'naive-ui'
import { formatToDateTime, addDaysByNow } from '@/utils/dateUtil'

const actionRef = ref()
// 定义全局变量
const state = reactive({
  queryParams: {
    rechargeRange: [
      new Date(addDaysByNow(-30) + ' 00:00:00').valueOf(),
      new Date(addDaysByNow(0) + ' 23:59:59').valueOf()
    ]
  },
  tableData: [] as any
})

onMounted(async () => { })

// 查询
const loadDataTable = async res => {
  // 判断rechargeRange[1]存在且不是23:59:59
  if (!state?.queryParams?.rechargeRange?.[1].toString().endsWith('99000')) {
    state.queryParams.rechargeRange[1] += 86400000 - 1
  }
  const params = { ...state.queryParams, ...res }
  const result = await getRechargeRecordList(params)
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
    title: '用户',
    key: 'user',
    width: 100,
    render(row: any) {
      if (row.user?.phone) return row.user.phone
      if (row.user?.email) return row.user.email
      return ''
    }
  },
  {
    title: '充值金额（元）',
    key: 'recharge_amount',
    width: 80,
    render(row: any) {
      if (row.recharge_amount == 0) return 0
      return row.recharge_amount ? Number(row.recharge_amount / 1000) : ''
    }
  },
  {
    title: '赠送金额（元）',
    key: 'gift_amount',
    width: 80,
    render(row: any) {
      if (row.gift_amount == 0) return 0
      return row.gift_amount ? Number(row.gift_amount / 1000) : ''
    }
  },
  {
    title: '支付金额（元）',
    key: 'pay_amount',
    width: 80,
    render(row: any) {
      if (row.pay_amount == 0) return 0
      return row.pay_amount ? Number(row.pay_amount / 1000) : ''
    }
  },
  {
    title: '订单号',
    key: 'rechargeOrder',
    width: 100,
    render(row: any) {
      if (row.rechargeOrder?._id) return row.rechargeOrder._id
      return ''
    }
  },
  {
    title: '密钥',
    key: 'cdkeyManage',
    width: 100,
    render(row: any) {
      if (row.cdkeyManage?._id) return row.cdkeyManage.secret_key
      return ''
    }
  },
  {
    title: '充值时间',
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
