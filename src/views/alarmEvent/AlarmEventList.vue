<template>
    <div class="alarmEventList">
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
            <!-- 添加操作栏 -->
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-block">
            <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="pageInfo.current"
                :page-sizes="pageInfo.sizes" :page-size="pageInfo.size" background
                layout="total, sizes, prev, pager, next" :total="pageInfo.total">
            </el-pagination>
        </div>
      <ViewReplayModal :visible="viewReplayVisible" :title="viewReplayTitle" @closeDialog="closeDialog"></ViewReplayModal>
    </div>
  </template>
  
  <script>
  import ViewReplayModal from '../transportationModel/component/ViewReplayModal.vue';
  export default {
    data() {
      return {
        nowTime: "",//当前的时间
        videoLoading: false,
        dialogVisible: false,
        dialogTitle: '',
        currentVideo: '',
        currentLineInfo: null,//当前线路的信息
        /* 回看视频弹框 开始*/
        viewReplayVisible: false,//会看视频弹框
        viewReplayTitle: "",//会看视频弹框
        /* 回看视频弹框 结束*/
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
      };
    },
    props: ["mqData"],
    components: {
      ViewReplayModal,
    },
    methods: {
      // 点击查看更多
      showViewReplay() {
        this.viewReplayVisible = true;
        this.viewReplayTitle = "回放查看";
      },
      // 点击关闭弹框
      closeDialog() {
        this.viewReplayVisible = false;
        this.viewReplayTitle = "";
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
        // 新增查看详情方法
      viewDetail(row) {
        this.viewReplayVisible = true;
        this.viewReplayTitle = "回放查看";
      },
    },
    created() {
      // 获取视频相关信息
      this.getAlarmEventList();
      // 获取当前时间
    },
  };
  </script>
  <style lang="scss" scoped>
  .alarmEventList {
    width: 100%;
    height: calc(100% - 73px);
    display: flex;
    flex-direction: column;
    background-color: #4C476B;
    color: #fff;
  }
  
  .body {
    background-color: rgba(27, 20, 69, 1);
    padding: 18px 20px 10px;
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  
    .map {
      width: 60%;
      height: 100%;
    }
  
    .right {
      width: 40%;
      height: 100%;
      overflow-y: auto;
    }
  }
  
  .dialog-body {
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
  
    video {
      width: 100%;
      height: 100%;
    }
  }
  </style>
  