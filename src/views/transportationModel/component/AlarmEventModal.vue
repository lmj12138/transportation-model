<template>
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
        :width="'53%'" custom-class="v-dialog" @close="close" center>
        <template slot="title">
            <p class="title">{{ title }}</p>
        </template>
        <div class="label-line">
            <el-row :gutter="10" style="color: #fff;">
                <el-col :span="5">
                    <span class="label-style">筛选监控搜索</span>
                    <el-select class="dialog-select" v-model="searchInfo.monitorFilter" placeholder="请选择监控筛选"
                        @change="searchChange" style="width: 100%">
                        <!-- 这里需要根据实际监控筛选条件动态生成选项 -->
                        <el-option label="监控1" value="1"></el-option>
                        <el-option label="监控2" value="2"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <span class="label-style">日期搜索</span>
                    <el-date-picker class="dialog-select" v-model="searchInfo.dateSearch" type="date" placeholder="选择日期"
                        @change="searchChange" style="width: 100%">
                    </el-date-picker>
                </el-col>
                <el-col :span="9">
                    <span class="label-style">时间段搜索</span>
                    <el-time-picker class="dialog-select" is-range v-model="searchInfo.timeRange" range-separator="~"
                        start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                        style="width: 100%;border-color: #191243">
                    </el-time-picker>
                </el-col>
                <el-col :span="5">
                    <span class="label-style">报警类型搜索</span>
                    <el-select class="dialog-select" v-model="searchInfo.alarmType" placeholder="请选择报警类型"
                        @change="searchChange" style="width: 100%">
                        <!-- 这里需要根据实际报警类型动态生成选项 -->
                        <el-option label="类型1" value="1"></el-option>
                        <el-option label="类型2" value="2"></el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <el-table ref="singleTable" size="small" :data="alarmEventList" style="width: 100%" v-loading="tableLoading">
            <el-table-column property="code" label="事件编号" align="center" />
            <el-table-column property="date" label="日期" align="center">
            </el-table-column>
            <el-table-column property="time" label="时间" align="center">
            </el-table-column>
            <el-table-column property="type" label="类型" align="center">
            </el-table-column>
        </el-table>
        <div class="page-block">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pageInfo.current"
                :page-sizes="pageInfo.sizes" :page-size="pageInfo.size" background
                layout="total, sizes, prev, pager, next" :total="pageInfo.total">
            </el-pagination>
        </div>
        <div slot="footer">
            <div class="dialog-footer">
                <el-button class="cancel" @click="close">取 消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            tableLoading: false,
            pageInfo: {
                current: 1,
                size: 100,
                sizes: [10, 20, 30, 50, 100],
                total: null,
            },
            searchInfo: {
                dateSearch: null, // 日期搜索
                timeRange: [], // 时间段搜索
                alarmType: '', // 报警类型搜索
                monitorFilter: '', // 筛选监控搜索
            },
            // 容器列表
            alarmEventList: [],
        }
    },
    computed: {},
    methods: {
        changePage(val) {
            this.pageInfo.current = val;
            this.getAlarmEventList();
        },
        changePageSize(val) {
            this.pageInfo.current = 1;
            this.pageInfo.size = val;
            this.getAlarmEventList();
        },
        close() {
            this.$emit("closeDialog");
        },
        // 搜索容器
        searchChange() {
            this.pageInfo.current = 1;
            this.getAlarmEventList();
        },
        // 请求容器列
        getAlarmEventList() {
            // this.tableLoading = true;
            // 请求容器列
            const data = {
                // code: this.containerCode,
                // page: this.pageInfo.current - 1,
                // size: this.pageInfo.size,
            };
            this.alarmEventList = [
                { code: '1', date: '2024-06-01', time: '10:00:00', type: '类型1' },
                { code: '2', date: '2024-06-02', time: '11:30:00', type: '类型2' },
            ];
            // this.$api
            //     .getAlarmEventListApi(data)
            //     .then((res) => {
            //         const { code, message, result, count } = res;
            //         if (code == 0) {
            //             this. alarmEventList = result;
            //             this.pageInfo.total = count;
            //         }
            //     })
            //     .finally(() => {
            //         this.tableLoading = false;
            //     });
        },
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: "",
        },
        loading: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        visible: function (val) {
            if (val) this.getAlarmEventList()
        }
    }
}
</script>

<style scoped lang="scss">
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    ::v-deep(.el-button) {
        width: 113px;
        border-radius: 0;
    }

    ::v-deep(.cancel) {
        background: rgba(255, 255, 255, 0.24);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.24);

        &:hover {
            border-color: #dce1e9;
        }
    }
}
</style>