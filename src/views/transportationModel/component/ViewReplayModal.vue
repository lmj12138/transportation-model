<template>
    <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
        :width="'73%'" custom-class="v-dialog" @close="close" center>
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
        <div class="body">
            <div class="left">
                <video id="video_dialog" controls controlsList="nodownload"></video>
            </div>
            <div class="right">
                <div class="title-name">
                    <p class="area-name">人民路中华路</p>
                    <p class="area-time">2025-01-02</p>
                </div>
                <p class="time" @click="handelClick(item)"
                    :style="item.id == currentVideo.id ? 'background-color: rgba(255, 255, 255, 0.18);' : ''"
                    v-for="item in currentTimeList" :key="item.id">{{ item.beginTime }}~{{ item.endTime }}
                </p>
            </div>
        </div>
        <div slot="footer">
            <div class="dialog-footer">
                <p>
                    <el-button class="cancel" @click="prevVideo" :disabled="isFirstVideo">上一个</el-button>
                    <el-button class="cancel" @click="nextVideo" :disabled="isLastVideo">下一个</el-button>
                </p>
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
            searchInfo: {
                dateSearch: null, // 日期搜索
                timeRange: [], // 时间段搜索
                alarmType: '', // 报警类型搜索
            },
            // 容器列表
            currentTimeList: [], // 筛选监控搜索
            currentVideo: {},

        }
    },
    computed: {
        // 计算是否是第一个视频
        isFirstVideo() {
            const index = this.currentTimeList.findIndex(item => item.id === this.currentVideo.id);
            return index === 0;
        },
        // 计算是否是最后一个视频
        isLastVideo() {
            const index = this.currentTimeList.findIndex(item => item.id === this.currentVideo.id);
            return index === this.currentTimeList.length - 1;
        }
    },
    methods: {
        close() {
            this.$emit("closeDialog");
        },
        // 搜索容器
        searchChange() {
            this.getViewReplayList();
        },
        // 请求容器列
        getViewReplayList() {
            // this.tableLoading = true;
            // 请求容器列
            const data = {
                // code: this.containerCode,
                // page: this.pageInfo.current - 1,
                // size: this.pageInfo.size,
            };
            this.currentTimeList = [
                { id: 0, beginTime: '10:00:00', endTime: "12:00:00", src: "" },
                { id: 1, beginTime: '10:00:00', endTime: "12:00:00", src: "" },
            ];
            this.currentVideo = Object.assign({}, this.currentTimeList[0]);
            // this.$api
            //     . getViewReplayListApi(data)
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
        handelClick(item) {
            this.currentVideo = Object.assign({}, item);
        },
        // 上一个视频方法
        prevVideo() {
            const index = this.currentTimeList.findIndex(item => item.id === this.currentVideo.id);
            if (index > 0) {
                this.currentVideo = Object.assign({}, this.currentTimeList[index - 1]);
            }
        },
        // 下一个视频方法
        nextVideo() {
            const index = this.currentTimeList.findIndex(item => item.id === this.currentVideo.id);
            if (index < this.currentTimeList.length - 1) {
                this.currentVideo = Object.assign({}, this.currentTimeList[index + 1]);
            }
        }
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
            if (val) this.getViewReplayList()
        }
    }
}
</script>

<style scoped lang="scss">
.dialog-footer {
    display: flex;
    justify-content: space-between;
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

.body {
    flex-grow: 1;
    width: 100%;
    display: flex;

    .left {
        width: calc(100% - 174px);
        height: 100%;

        video {
            width: 100%;
            height: 100%;
        }
    }

    .right {
        width: 174px;
        height: 100%;
        font-size: 14px;
        text-align: center;
        background-color: #09042A;

        .title-name {
            width: 100%;
            padding: 10px;
            height: 70px;
            color: #fff;

            .area-name {
                font-size: 20px;
                font-weight: bold;
                width: 90%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 8px;
            }

        }

        .time {
            cursor: pointer;
            width: 100%;
            height: 37px;
            line-height: 37px;
            border-top: 1px solid rgba(255, 255, 255, 0.18);
        }
    }
}
</style>