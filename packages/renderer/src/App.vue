<script setup lang="ts">
import Gun from 'gun/gun'

import { onMounted, reactive, ref } from 'vue';
import { ElLoading } from 'element-plus'
import type { ElForm } from 'element-plus'

import UploadWidget from '/@/components/UploadWidget.vue';

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const dict = reactive({
  gun: Gun(['http://localhost:8765/gun']),
  tempData: {
    keywords: "",
    tableData: [
      {
        author: '',
        title: '',
        year: '',
        language: '',
        size: '',
        extension: ''
      }
    ],
    showUploadBookWindow: false,
  },
  forms: {
    uploadingFile: {
      title: '',
      author: '',
      file: null as File | null,
    },
  },
  rules:
  {
    uploadingFile: {
      title: [
        { required: true, message: 'Please input the title of the book', trigger: 'blur' },
      ],
      author: [
        { required: true, message: 'Please input the author of the book', trigger: 'blur' },
      ],
      file: [
        { required: true, message: 'Please upload the book', trigger: 'change' },
      ],
    },
  },
  functions: {
    test: async () => {
      console.log('test')
    },
    handleFileUploadSubmit: async () => {
      if (!ruleFormRef.value) return

      ruleFormRef.value.validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!')
        }
      })
    }
  }
});

onMounted(async () => {
  // dict.functions.loadingStart()
  // dict.functions.loadingStop()
})

</script>

<template>
  <div class="LibraryGenesisTitle">
    Library Genesis
    <span @dblclick="
      dict.tempData.showUploadBookWindow = true
    ">2</span>
  </div>

  <div class="searchRow">
    <input v-model="dict.tempData.keywords" />
    <button class="searchButton" @click="dict.functions.test">Search!</button>
  </div>

  <div class="resultList">
    <el-table :data="dict.tempData.tableData" style="width: 100%">
      <el-table-column prop="author" label="Author" min-width="100" />
      <el-table-column prop="title" label="Title" min-width="400" />
      <el-table-column prop="year" label="Year" />
      <el-table-column prop="language" label="Language" />
      <el-table-column prop="size" label="Size" />
      <el-table-column prop="extension" label="Extension" />
    </el-table>
  </div>

  <el-dialog v-model="dict.tempData.showUploadBookWindow" title="Epub/PDF Uploader" width="70%">
    <el-form
      ref="ruleFormRef"
      label-position="top"
      :model="dict.forms.uploadingFile"
      :rules="dict.rules.uploadingFile"
    >
      <el-form-item label="Name" prop="title">
        <el-input
          :style="{ width: 80 }"
          v-model="dict.forms.uploadingFile.title"
          type="text"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="Author" prop="author">
        <el-input
          :style="{ width: 80 }"
          v-model="dict.forms.uploadingFile.author"
          type="text"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="File" prop="file">
        <div class="Center FullSize">
          <UploadWidget v-model:file="dict.forms.uploadingFile.file"></UploadWidget>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <div class="flexCenter">
          <el-button type="primary" @click="dict.functions.handleFileUploadSubmit">Confirm Upload</el-button>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.LibraryGenesisTitle {
  font-family: Georgia, "Times New Roman", Times, serif;
  line-height: 21px;
  border-spacing: 1px 1px;
  text-decoration: none;
  color: #a00000;
  font-size: 40px;
  margin-top: 40px;
}

.searchRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;

  margin-top: 50px;
  padding-left: 20px;
  input {
    width: 300px;
  }
  .searchButton {
    margin-left: 4px;
  }
}

.resultList {
  margin-top: 60px;
}

.flexCenter {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

@mixin _center() {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
}

.Center {
  @include _center();
}

@mixin _fullSize {
  width: 100%;
  height: 100%;
}

.FullSize {
  @include _fullSize();
}
</style>
