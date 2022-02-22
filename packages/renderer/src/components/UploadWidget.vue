<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { PropType } from 'vue'
import { globalDict } from "/@/store/memory"
import { functions } from "/@/store/functions"

defineProps({
    file: {
        type: Object as PropType<File | null>,
        required: false,
        default: null,
    }
})
const emit = defineEmits(['update:file'])
const dict = reactive({
    updateFile: (file: File) => {
        emit("update:file", file)
    },
})
const beforeUploadFunction = (file: { type: any; size: number; name: string }) => {
    const fileType = file.type,
        isEpub = file.name.endsWith('.epub') || file.name.endsWith('.pdf'),
        isThan30M = file.size / 1024 / 1024 < 30;

    console.log(file)

    if (!isEpub) {
        functions.basic.print("Only epub/pdf is allowed here!", 'error');
        return false;
    }

    return true
}
const uploadFileFunction = (params: { file: any; }) => {
    const file = params.file;
    dict.updateFile(file)
}
</script>

<template>
    <el-upload
        class="upload-demo"
        drag
        action="undefined"
        :multiple="false"
        :limit="1"
        :before-upload="beforeUploadFunction"
        :http-request="uploadFileFunction"
    >
        <el-icon class="el-icon--upload">
            <upload-filled />
        </el-icon>
        <div class="el-upload__text">
            Drop file here or
            <em>click to upload</em>
        </div>
    </el-upload>
</template>