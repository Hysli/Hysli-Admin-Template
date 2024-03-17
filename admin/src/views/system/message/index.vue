<template>
  <n-card :bordered="false" class="proCard">
    <n-form label-placement="left" inline>
      <n-form-item label="推送内容">
        <n-input v-model:value="state.queryParams.content" class="w180" placeholder="请输入推送内容" clearable />
      </n-form-item>
      <n-space>
        <n-button type="primary" @click="reloadTable" v-if="hasPermission(['service/message/auth/getList'])">查询</n-button>
        <n-button type="primary" @click="handleAdd" v-if="hasPermission(['service/message/auth/add'])">
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
     :scroll-x="1360" @update:checked-row-keys="onCheckedRow">
    </BasicTableCustom>
  </n-card>

  <MessageEdit ref="messageEditRef" :title="state.editTitle" @handleQuery="reloadTable"></MessageEdit>

  <!--发送列表弹框开始-->
  <n-modal v-model:show="state.showUserListModal" :show-icon="false" preset="dialog">
    <template #header>
      <div>推送列表</div>
    </template>

    <BasicTableCustom :columns="UserListColumns" :request="loadUserListDataTable" >
    </BasicTableCustom>

    <template #action>
      <n-space>
        <n-button type="info" @click="() => (state.showUserListModal = false)">确定</n-button>
      </n-space>
    </template>
  </n-modal>
  <!--发送列表弹框结束-->

  <!--发送状态弹框开始-->
  <n-modal v-model:show="state.showUserStatusModal" :show-icon="false" preset="dialog">
    <template #header>
      <div>推送状态列表</div>
    </template>

    <BasicTableCustom :columns="UserStatusListColumns" :request="loadUserStatusDataTable" >
    </BasicTableCustom>

    <template #action>
      <n-space>
        <n-button type="info" @click="() => (state.showUserStatusModal = false)">确定</n-button>
      </n-space>
    </template>
  </n-modal>
  <!--发送状态弹框结束-->
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, h } from 'vue'
import { BasicTableCustom, TableAction } from '@/components/Table'
import { getList } from '@/api/system/message'
import { NTag,NImage } from 'naive-ui'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd'
import { formatToDateTime } from '@/utils/dateUtil'
import MessageEdit from '@/views/system/message/edit.vue'

// 引入权限
import { usePermission } from '@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const dialog = window['$dialog']
const actionRef = ref()
const messageEditRef = ref<InstanceType<typeof MessageEdit>>()
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
    content: undefined
  },
  tableData: [] as any,
  editTitle: '',
  showUserListModal: false,
  showUserStatusModal: false,
  userList: [],
  userStatusList: []
})

onMounted(async () => {

})

// 查询
const loadDataTable = async (res) => {
  const params = { ...state.queryParams, ...res }
  const result = await getList(params)
  console.log(111111,result)
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

const loadUserListDataTable = async (res) => {
  return {
    list: state.userList,
    page: res.page,
    pageSize: res.pageSize,
    itemCount: state.userList.length,
    pageCount: parseInt(state.userList.length / res.pageSize)
  }
}

const loadUserStatusDataTable = async (res) => {
  return {
    list: state.userStatusList,
    page: res.page,
    pageSize: res.pageSize,
    itemCount: state.userStatusList.length,
    pageCount: parseInt(state.userStatusList.length / res.pageSize)
  }
}

// 重置
const resetQuery = () => {
  state.queryParams.content = undefined
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
    title: '发送列表',
    key: 'userList',
    width: 70,
    render(row: any) {
      console.log("发送列表", row.userList)
      let showText:string
      if (row.userList) {
        // return  "发送数量 " + row.userList.length
        if (row.userList[0] == "all") {
          showText = "全部推送"
          return h('span', showText)
        } else { 
          showText = "发送数量 " + row.userList.length
          return h('span', {
            onClick: () => {
              state.showUserListModal = true
              state.userList = row?.userList
              console.log("发送列表 222", state.userList)
            }, style: 'color: #2d8cf0; cursor: pointer;'
          }, showText)
        }
        
      }
    }
  },
  {
    title: '推送内容',
    key: 'content',
    width: 200,
  },
  {
    title: '推送类型',
    key: 'type',
    width: 80
  },
  {
    title: '创建时间',
    key: 'create_time',
    width: 80,
    render(row) {
      return formatToDateTime(new Date(row.create_time))
    }
  },
  {
    title: '发送状态',
    key: 'userStatusList',
    width: 70,
    render(row: any) {
      console.log("状态列表", row.userStatusList)
      return h('span', {
        onClick: () => {
          state.showUserStatusModal = true
          state.userStatusList = row?.userStatusList
        }, style: 'color: #2d8cf0; cursor: pointer;'
      }, "发送状态")
    }
  },
]

// 推送用户列表数据列
const UserListColumns = [
  {
    title: '序号',
    key: 'row',
    width: 20,
    render(row: any, index: number) {
      return h('span', index + 1)
    }
  },
  {
    title: '头像',
    key: 'avatar',
    width: 30,
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
]

// 推送用户列表数据列
const UserStatusListColumns = [
  {
    title: '序号',
    key: 'row',
    width: 20,
    render(row: any, index: number) {
      return h('span', index + 1)
    }
  },
  {
    title: '头像',
    key: 'avatar',
    width: 30,
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
    title: '状态',
    key: 'status',
    width: 100,
  }
]

const onCheckedRow = (rowKeys) => {
  console.log(rowKeys)
}

// 刷新数据
const reloadTable = () => {
  actionRef.value.reload()
}

// 新增
const handleAdd = () => {
  state.editTitle = '新增推送'
  messageEditRef.value?.openModal({})
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
