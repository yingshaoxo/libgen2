<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElLoading } from 'element-plus'
import type { ElForm } from 'element-plus'

import * as types from "/@/store/models";
import { functions } from "/@/store/functions";

import UploadWidget from '/@/components/UploadWidget.vue';

type FormInstance = InstanceType<typeof ElForm>
const ruleFormRef = ref<FormInstance>()

const tableDataOneItemTemplate = {
  author: '',
  title: '',
  year: '',
  language: '',
  size: '',
  extension: '',
  link: ''
}

const dict = reactive({
  tempData: {
    keywords: "",
    tableData: [
      tableDataOneItemTemplate
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
    pushNewBookToViewDataList: async (book: types.BookModel) => {
      dict.tempData.tableData.push(
        {
          ...tableDataOneItemTemplate,
          ...book
        }
      )
    },
    replaceOldViewDataList: async (books: types.BookModel[]) => {
      dict.tempData.tableData = books.map((item: types.BookModel) => {
        return {
          ...tableDataOneItemTemplate,
          ...item
        }
      })
    },
    uploadFile: async () => {
      functions.myGun.addABook({
        title: dict.forms.uploadingFile.title,
        author: dict.forms.uploadingFile.author,
        link: '',
      })
      dict.tempData.showUploadBookWindow = false
    },
    handleFileUploadSubmit: () => {
      if (!ruleFormRef.value) return

      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          dict.functions.uploadFile()
          console.log('submit!')
        } else {
          console.log('error submit!')
        }
      })
    },
    keepUpdateBookList: () => {
      functions.myGun.listenToTheTable(async (book: types.BookModel) => {
        console.log(book)

        let result = dict.tempData.tableData.filter((item: types.BookModel) => {
          return item?.id === book?.id
        })
        if (result.length == 0) {
          dict.functions.pushNewBookToViewDataList(book)
        }
      })
    },
    stopUpdateBookList: () => {
      functions.myGun.stopListening()
    },
    search: async () => {
      functions.myGun.getAllData(async (books) => {
        dict.functions.replaceOldViewDataList(books)
        console.log('get all data', books)
      })
    },
  }
});

onMounted(async () => {
  dict.functions.search()

  dict.functions.keepUpdateBookList()
})

</script>

<template>
  <div
    class="TopLeftPageHalfCircleButton verticalCenter"
    @click="functions.myGun.clearTheTable"
  >Reset</div>

  <div
    class="TopRightPageHalfCircleButton verticalCenter"
    @click="
      dict.tempData.showUploadBookWindow = true
    "
  >Upload</div>

  <div class="LibraryGenesisTitle">Library Genesis 2</div>

  <div class="searchRow">
    <input v-model="dict.tempData.keywords" />
    <button class="searchButton" @click="dict.functions.search">Search!</button>
    <!-- <button class="searchButton" @click="functions.myGun.addOneRandomData">Add data!</button>
    <button class="searchButton" @click="functions.myGun.getAllData">Get data!</button>
    <button class="searchButton" @click="functions.myGun.stopListening">Stop!</button>
    <button class="searchButton" @click="functions.myGun.clearTheTable">Clear!</button>-->
  </div>

  <div class="resultList">
    <el-table :data="dict.tempData.tableData" style="width: 100%">
      <el-table-column prop="author" label="Author" min-width="100" />
      <el-table-column prop="title" label="Title" min-width="200" />
      <el-table-column prop="year" label="Year" />
      <el-table-column prop="language" label="Language" />
      <el-table-column prop="size" label="Size" />
      <el-table-column prop="extension" label="Extension" />
    </el-table>
  </div>

  <el-dialog
    v-model="dict.tempData.showUploadBookWindow"
    title="Epub/PDF Uploader"
    width="70%"
    :destroy-on-close="true"
  >
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

.TopRightPageHalfCircleButton {
  position: fixed;
  top: 0;
  right: 0;
  width: 45px;
  height: 20px;
  background-color: #669e1d;
  color: #fff;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
  opacity: 0.7;
}

.verticalCenter {
  display: flex;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
}

.TopLeftPageHalfCircleButton {
  position: fixed;
  top: 0;
  left: 0;
  width: 45px;
  height: 20px;
  background-color: #c2c2c2;
  color: #fff;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
  opacity: 0.01;
}
</style>
