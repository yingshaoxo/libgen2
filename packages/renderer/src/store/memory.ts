import { ElLoading } from "element-plus";
import { reactive } from "vue";

export const globalDict = reactive({
    loadingInstance: null as unknown as typeof ElLoading,
})