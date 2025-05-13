<template>
  <div class="transportationModel">
    <div class="body" v-loading="videoLoading">
      <div class="map" v-if="!videoLoading">
        <AMapComponent :markerList="markerList" :mqData="mqData"></AMapComponent>
      </div>
      <div class="right">
        <VideoComponent :videoList="videoList" @videoClick="handleVideoClick" @showViewReplay="showViewReplay" />
        <AlarmEvent @showAlarmEventModal="showAlarmEventModal" />
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="50%" :title="dialogTitle" :before-close="handleClose">
      <div class="dialog-body">
        <video id="videoDialog1" controls controlsList="nodownload"></video>
      </div>
    </el-dialog>
    <ViewReplayModal :visible="viewReplayVisible" :title="viewReplayTitle" @closeDialog="closeDialog"></ViewReplayModal>
    <AlarmEventModal :visible="alarmEventVisible" :title="alarmEventTitle" @closeDialog="closeDialog">
    </AlarmEventModal>
  </div>
</template>

<script>
import Hls from './hls.js';
import AMapComponent from './component/AMapComponent';
import VideoComponent from './component/VideoComponent';
import AlarmEvent from './component/AlarmEvent';
import AlarmEventModal from './component/AlarmEventModal.vue';
import ViewReplayModal from './component/ViewReplayModal.vue';
import { getStreamsListApi } from "../../api/api.js";
export default {
  data() {
    return {
      nowTime: "",//当前的时间
      videoLoading: false,
      markerList: [],//地图标记数据
      videoList: [],//视频数据数据
      dialogVisible: false,
      dialogTitle: '',
      currentVideo: '',
      currentLineInfo: null,//当前线路的信息
      /* 回看视频弹框 开始*/
      viewReplayVisible: false,//会看视频弹框
      viewReplayTitle: "",//会看视频弹框
      /* 回看视频弹框 结束*/
      /* 回看视频弹框 开始*/
      alarmEventVisible: false,//会看视频弹框
      alarmEventTitle: "",//会看视频弹框
      /* 回看视频弹框 结束*/
    };
  },
  props: ["mqData"],
  components: {
    AMapComponent,
    VideoComponent,
    AlarmEvent,
    AlarmEventModal,
    ViewReplayModal,
  },
  methods: {
    handleVideoClick(videoInfo) {
      this.dialogTitle = videoInfo.name + '(' + videoInfo.description + ')';
      this.currentVideo = videoInfo.url;;
      this.dialogVisible = true;
      const video = document.getElementById('videoDialog1');
      const hls = new Hls();
      hls.loadSource(this.currentVideo + '/index.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    },
    handleClose() {
      this.dialogTitle = '';
      this.currentVideo = '';
      this.dialogVisible = false;
    },
    getStreamsList() {
      // this.videoLoading = true;
      // getStreamsListApi().then((res) => {
      //   this.videoList = res;
      //   this.markerList = res;
      //   // const videoVirtualData = window._config.videoVirtualData ? window._config.videoVirtualData : [];
      //   // this.videoList = this.videoList.concat(videoVirtualData);
      //   this.videoLoading = false;
      // }).catch((error) => {
      //   console.log("获取视频错误", error);
      //   this.videoLoading = false;
      // })
    },
    // 点击查看更多
    showViewReplay() {
      this.viewReplayVisible = true;
      this.viewReplayTitle = "回放查看";
    },
    // 点击查看更多
    showAlarmEventModal() {
      this.alarmEventVisible = true;
      this.alarmEventTitle = "警报事件";
    },
    // 点击关闭弹框
    closeDialog() {
      this.viewReplayVisible = false;
      this.viewReplayTitle = "";
      this.alarmEventVisible = false;
      this.alarmEventTitle = ""
    }
  },
  created() {
    // 获取视频相关信息
    this.getStreamsList();
    // 获取当前时间
    this.getCurrentDateAndWeek();
  },
};
</script>
<style lang="scss" scoped>
.transportationModel {
  width: 100%;
  height: calc(100% - 73px);
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
