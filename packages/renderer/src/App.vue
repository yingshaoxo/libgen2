<script setup lang="ts">
import { reactive } from 'vue';

let dict = reactive({
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
    ]
  },
});
</script>

<template>
  <div class="LibraryGenesisTitle">Library Genesis 2</div>

  <div class="searchRow">
    <input v-model="dict.tempData.keywords" />
    <button class="searchButton">Search!</button>
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
</style>
