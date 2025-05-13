<template>
    <div class="alarm-event">
        <div class="top">
            <p class="title">警报事件</p>
            <div class="more-button" @click="showAlarmEventModal">
                查看更多
            </div>
        </div>
        <div class="alarm-bidy">
            <div class="alarm-event-item" v-for="(item, index) in alarmEventList" :key="index">
                <div class="left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27.671" height="24.953" viewBox="0 0 27.671 24.953">
                        <path id="减去_8" data-name="减去 8"
                            d="M24.665,24.953H3A3,3,0,0,1,.4,20.465L11.23,1.512a3,3,0,0,1,5.209,0L27.27,20.465a3,3,0,0,1-2.6,4.488Zm-10.831-5a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,13.835,19.954Zm0-15a1.5,1.5,0,0,0-1.5,1.5v10a1.5,1.5,0,0,0,3,0v-10A1.5,1.5,0,0,0,13.835,4.954Z"
                            transform="translate(0)" fill="#f07" />
                    </svg>
                    <span>{{ item.id }}</span>
                    <span class="name">{{ item.name }}</span>
                </div>
                <span>{{ item.begingTime }}~{{ item.endTime }}</span>
            </div>
            <div class="page-block">
                <el-pagination @size-change="changePageSize" @current-change="changePage"
                    :current-page="pageInfo.current" :page-sizes="pageInfo.sizes" :page-size="pageInfo.size" background
                    layout="prev, pager, next" :total="pageInfo.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isVideoOpen: true,
            alarmEventList: [],//警告事件
            pageInfo: {
                current: 1,
                size: 100,
                sizes: [10, 20, 30, 50, 100],
                total: null,
            },
        };
    },
    props: {},
    methods: {
        // 获取警报事件
        getAlarmEventList() {
            this.alarmEventList = [
                { id: "NO.0001", name: "人民路中华路", begingTime: "10:00:00", endTime: "12:00:00", },
                { id: "NO.0002", name: "人民路中华路", begingTime: "10:00:00", endTime: "12:00:00", },
                { id: "NO.0003", name: "人民路中华路", begingTime: "10:00:00", endTime: "12:00:00", },
                { id: "NO.0004", name: "人民路中华路", begingTime: "10:00:00", endTime: "12:00:00", },
                { id: "NO.0005", name: "人民路中华路", begingTime: "10:00:00", endTime: "12:00:00", },
            ];
            this.pageInfo.total = 15;
            // this.$api.getAlarmEventList().then((res) => {
            //     const { code, message, result } = res;
            //     if (code == 0) {
            //         this.alarmEventList = result;
            // this.pageInfo.total = count;
            //     }
            // });
        },
        changePage(val) {
            this.pageInfo.current = val;
            this.getAlarmEventList();
        },
        changePageSize(val) {
            this.pageInfo.current = 1;
            this.pageInfo.size = val;
            this.getAlarmEventList();
        },
        // 点击查看更多
        showAlarmEventModal() {
            // 使用 window.open 方法在新窗口打开路由
            const routeUrl = this.$router.resolve({ path: '/alarmEvent' }).href;
            window.open(routeUrl, '_blank');
        }
    },
    mounted() {
        this.getAlarmEventList();
    },
    watch: {},
};
</script>

<style lang="scss" scoped>
.alarm-event {
    margin-top: 8 px;
    border-top: 1px solid rgba(255, 255, 255, 0.34);
    padding-top: 8px;
    padding-left: 10px;
    height: 431px;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            font-size: 16px;
            color: #fff;
            font-weight: bold;
        }

        .more-button {
            padding: 0px 10px;
            min-width: 136px;
            height: 50px;
            line-height: 50px;
            color: #fff;
            background-color: rgba(255, 255, 255, 0.24);
            cursor: pointer;
            font-size: 16px;
        }
    }

    .alarm-bidy {
        width: 100%;
        height: 314px;

        .alarm-event-item {
            margin-top: 10px;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            background-color: rgba(255, 0, 119, 0.23);
            color: #fff;
            font-size: 13px;
            padding: 0px 10px;
            cursor: pointer;

            .left {
                display: flex;
                align-items: center;

                .name {
                    margin-left: 20px;
                }

                svg {
                    margin-right: 10px;
                }
            }

        }
    }

}
</style>