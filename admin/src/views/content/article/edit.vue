<template>
  <n-modal v-model:show="state.showModal" :show-icon="false" preset="dialog" style="width: 840px">
    <template #header>
      <div>{{ props.title }}</div>
    </template>

    <n-spin :show="state.uploading">
      <template #description> 图片上传中... </template>
      <n-form :model="state.ruleForm" ref="ruleFormRef" label-placement="left" require-mark-placement="left"
        :label-width="80" class="py-4">
        <n-form-item label="标题" path="title" :rule="[{ required: true, message: '标题不能为空', trigger: 'blur' }]">
          <n-input placeholder="请输入标题" v-model:value="state.ruleForm.title" clearable />
        </n-form-item>
        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item label="所属分类" path="category_id"
              :rule="[{ required: true, message: '所属分类不能为空', trigger: ['blur', 'change'] }]">
              <n-select placeholder="请选择所属分类" v-model:value="state.ruleForm.category_id" :options="props.categoryData"
                label-field="name" value-field="_id" clearable />
            </n-form-item>
            <n-form-item label="发布日期" path="release_date" :rule="[{ required: true, message: '不能为空' }]">
              <n-date-picker v-model:value="state.ruleForm.release_date" value-format="yyyy-MM-dd" input-readonly
                clearable type="date" style="width: 100%" /></n-form-item>
            <n-form-item label="排序" path="sort">
              <n-input-number v-model:value="state.ruleForm.sort" :min="0" :max="999999" style="width: 100%" />
            </n-form-item>
            <n-form-item label="状态" path="status">
              <n-radio-group v-model:value="state.ruleForm.status" name="status">
                <n-space>
                  <n-radio :value="1">启用</n-radio>
                  <n-radio :value="2">禁用</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item label="图片">
              <n-upload accept="image/png,image/jpeg" :default-file-list="state.pictureList" :max="1"
                :on-change="uploadPicture" list-type="image-card" />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-form-item label="简介" path="introduction">
          <n-input type="textarea" placeholder="请输入简介" v-model:value="state.ruleForm.introduction" />
        </n-form-item>
        <n-form-item label="内容" path="content">
          <div>
            <QuillEditor ref="quillEditorRef" :options="options" style="min-height: 180px" />
          </div>
        </n-form-item>
      </n-form>
    </n-spin>

    <template #action>
      <n-space>
        <n-button @click="() => (state.showModal = false)" :disabled="state.uploading">取消</n-button>
        <n-button type="info" :loading="state.btnLoading" @click="confirmForm" :disabled="state.uploading">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw } from 'vue'
import { addArticle, updateArticle } from '@/api/content/article'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'
import { commonUploadFile } from '@/api/common/index'

Quill.register('modules/imageUploader', ImageUploader)
Quill.register('modules/blotFormatter', BlotFormatter)

const quillEditorRef = ref()
const ruleFormRef = ref()
const props = defineProps({
  title: String,
  categoryData: Array<any>
})
const emits = defineEmits(['handleQuery'])
// 定义全局变量
const state = reactive({
  showModal: false,
  btnLoading: false,
  ruleForm: {} as any,
  menuData: [] as any,
  pictureList: [] as any,
  uploading: false
})

const options = reactive({
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image']
    ],
    // 上传图片
    imageUploader: {
      upload: async (file: any) => {
        try {
          // console.log('上传图片', file)
          state.uploading = true
          const params = {
            file: file
          }
          const result = await commonUploadFile(params)
          // console.log('上传结果', result)
          return result.data?.fileUrl
        } catch (error) {
          console.error('上传图像时出错：', error)
          return ''
        } finally {
          state.uploading = false
        }
      }
    },
    // 图片缩放
    blotFormatter: {
      overlay: {
        style: {
          border: '2px solid red'
        }
      },
      toolbar: {
        mainClassName: 'blot-formatter__toolbar'
      }
    }
  },
  theme: 'snow',
  placeholder: '输入您喜欢的内容吧！'
})

// 打开弹窗
const openModal = (record: any) => {
  // console.log('打开弹窗', record)
  state.pictureList = []
  state.uploading = false
  if (Object.keys(record).length > 0) {
    state.ruleForm = JSON.parse(JSON.stringify(record))
    delete state.ruleForm.articleCategory
    if (state.ruleForm.picture) {
      state.pictureList = [
        {
          id: state.ruleForm._id,
          name: '',
          status: 'finished',
          url: state.ruleForm.picture
        }
      ]
    }
  } else {
    state.ruleForm = {
      category_id: undefined,
      title: '',
      introduction: '',
      picture: '',
      release_date: undefined,
      content: '',
      status: 1,
      sort: 0
    }
  }
  setTimeout(() => {
    toRaw(quillEditorRef.value).setHTML(state.ruleForm.content)
  }, 100)
  state.showModal = true
}

// 关闭弹窗
const closModal = () => {
  emits('handleQuery')
  state.showModal = false
}

// 图片上传
const uploadPicture = async (file: any) => {
  // console.log('上传文件', file)
  if (file.fileList && file.fileList.length > 0) {
    const params = {
      file: file.fileList[0].file
    }
    const result = await commonUploadFile(params)
    // console.log(result)
    state.ruleForm.picture = result.data?.fileUrl
  } else {
    state.ruleForm.image_url = ''
  }
}

// 确认
const confirmForm = () => {
  state.ruleForm.content = quillEditorRef.value.getHTML()
  state.btnLoading = true
  ruleFormRef.value.validate(async errors => {
    if (!errors) {
      try {
        if (state.ruleForm._id) {
          const params = state.ruleForm
          await updateArticle(params)
          closModal()
        } else {
          const params = state.ruleForm
          await addArticle(params)
          closModal()
        }
      } catch (e) { }
    }
    state.btnLoading = false
  })
}

// 导出对象
defineExpose({ openModal })
</script>
<style lang="less" scoped>
:deep(.n-upload-trigger) {
  width: 270px !important;
  height: 210px !important;
}

:deep(.n-upload-file) {
  width: 270px !important;
  height: 210px !important;
}

:deep(.n-upload-file-info__thumbnail img) {
  object-fit: cover !important;
}
</style>
