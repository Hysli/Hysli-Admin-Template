<template>
  <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog" :mask-closable="false" style="width: 506px"
    @close="closeDialog">
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <div>
      <n-grid :x-gap="15" :y-gap="15" :cols="3">
        <n-grid-item v-for="(item, index) in state.rechargeTemplateData">
          <div :class="index == state.selectedIndex ? 'item curr' : 'item'" @click="clickEvent(item, index)">
            <div class="price">¥{{ item.sales_price / 100 }}</div>
            <div class="points">充{{ item.recharge_points }}点 赠{{ item.gift_points }}点</div>
          </div>
        </n-grid-item>
      </n-grid>
      <div class="btn">
        <n-button type="primary" :loading="state.btnLoading" class="btn" @click="handleRecharge">确认充值</n-button>
      </div>
      <div class="info" v-if="state.orderInfo">
        <p class="p1">微信扫码支付</p>
        <div>
          <n-image width="180" :src="state.orderInfo.qrCode" />
        </div>
        <p class="p2">订单号：{{ state.orderInfo.orderNo }}</p>
        <p class="p3">支付状态：{{ state.orderInfo.status }}</p>
      </div>
    </div>
  </n-modal>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { getRechargeTemplateList } from '@/api/business/recharge'
import { addRechargeOrder, getRechargeOrderInfo } from '@/api/business/recharge'

const props = defineProps({
  title: String
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  ruleForm: {} as any,
  selectedIndex: -1,
  rechargeInfo: {
    template_id: '',
    pay_method: 10
  },
  orderInfo: null as any,
  orderDetail: null as any,
  timer: null as any,
  rechargeTemplateData: [] as any
})

// 模板选项卡点击事件
const clickEvent = (item: any, index: number) => {
  state.selectedIndex = index
  state.rechargeInfo.template_id = item._id
}

// 打开弹窗
const openModal = () => {
  state.selectedIndex = -1
  state.rechargeTemplateData = []
  getRechargeTemplate()
  state.btnLoading = false
  state.orderInfo = null
  state.orderDetail = null
  state.showModal = true
}

// 获取充值模板列表
const getRechargeTemplate = async () => {
  const params = { page: 1, pageSize: 9 }
  const result = await getRechargeTemplateList(params)
  // console.log(result)
  state.rechargeTemplateData = result.data?.rows ?? []
}

// 关闭弹窗
const closModal = () => {
  emits('handleQuery')
  state.showModal = false
}

// 确认充值
const handleRecharge = async () => {
  state.btnLoading = true
  const params = state.rechargeInfo
  try {
    const result = await addRechargeOrder(params)
    console.log('result', result)
    state.orderInfo = result.data ?? null
    if (state.orderInfo && state.orderInfo.orderNo) {
      state.timer = setInterval(async () => {
        const res = await getRechargeOrderInfo({
          _id: state.orderInfo.orderNo
        })
        console.log('res', res)
        if (res && res.code == 100) {
          clearInterval(state.timer)
          state.btnLoading = false
          closModal()
        }
      }, 3000)
    }
  } catch (e) {
    console.log('e', e)
    clearInterval(state.timer)
    state.btnLoading = false
    closModal()
  }
}

const closeDialog = e => {
  console.log('e', e, state.timer)
  clearInterval(state.timer)
}

// 导出对象
defineExpose({ openModal })
</script>
<style lang="less" scoped>
.pTxt {
  font-size: 14px;
  margin-bottom: 12px;
}

.item {
  width: 140px;
  height: 100px;
  background-color: #f3f4f6;
  cursor: pointer;
  text-align: center;
  padding: 0 10px;
  border-radius: 5px;

  .price {
    font-size: 22px;
    padding-top: 20px;
  }

  .points {
    color: #aa63cd;
    line-height: 22px;
    font-size: 12px;
  }
}

.curr {
  color: #2d8cf0;
  border: 1px solid #2d8cf0;
}

.item:hover {
  background-color: #edf2f7;
}

.btn {
  margin-top: 12px;
  margin-bottom: 5px;

  .n-button {
    width: 100%;
  }
}

.info {
  text-align: center;

  .p1 {
    font-size: 17px;
  }

  .p2 {
    font-size: 12px;
    margin-top: 5px;
  }

  .p3 {
    font-size: 12px;
  }
}
</style>
