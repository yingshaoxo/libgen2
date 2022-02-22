import { ElLoading } from "element-plus";
import { reactive } from "vue";
import Gun from "gun";

import * as types from "/@/store/models";

export const globalDict = reactive({
    gun: Gun(['http://localhost:8765/gun']),
    loadingInstance: null as unknown as typeof ElLoading,
    books: [] as types.BookModel[],
})