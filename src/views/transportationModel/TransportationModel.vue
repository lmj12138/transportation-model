<template>
  <div class="body" v-loading="videoLoading">
    <div class="map" v-if="!videoLoading">
      <AMapComponent :markerList="markerList" :mqData="mqData"></AMapComponent>
    </div>
    <div class="audio">
      <VideoComponent v-for="(video, index) in videoList" :key="index" :videoSrc="video.url" :videoId="video.id"
        :videoInfo="video" :videoIndex="index" @videoClick="handleVideoClick" />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="50%" :title="dialogTitle" :before-close="handleClose">
      <div class="dialog-body">
        <video id="videoDialog1" controls controlsList="nodownload"></video>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Stomp from "stompjs";
import Hls from './hls.js';
import AMapComponent from './component/AMapComponent';
import VideoComponent from './component/VideoComponent';
import { getStreamsListApi } from "../../api/api.js";
export default {
  data() {
    return {
      videoLoading: false,
      markerList: [],//地图标记数据
      videoList: [],//视频数据数据
      dialogVisible: false,
      dialogTitle: '',
      currentVideo: '',
      client: null,
      isConnecting: false,
      mqData: null,
    };
  },
  components: {
    AMapComponent,
    VideoComponent,
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
    // 初始化链接mq
    init() {
      if (this.client || this.isConnecting) return;
      this.isConnectin = true;
      this.client = Stomp.client(window._config.baseMqUrl);
      this.client.debug = () => { };
      this.client.connect({},
        (frame) => {// 链接队列并获取消息
          console.log('Connected:', frame)
          this.client.subscribe("/topic/trafficai.events", (message) => {
            // 获取mq链接的消息
            console.log('收到消息:', message.body);
            const data = JSON.parse(message.body);
            this.mqData = Object.assign({}, data)
            this.isConnecting = false;
            // 成功链接上队列之后收获消息
          });

        }, (error) => {
          // 链接失败或者端口链接时 尝试从新链接
          setTimeout(() => {
            this.isConnecting = false;
            this.init();
          }, 3000);
          console.error('Connection failed: ', error);
        });
    },
    getStreamsList() {
      this.videoList = [];
      this.videoLoading = true;
      getStreamsListApi().then((res) => {
        this.videoList = res;
        this.markerList = res;
        const videoVirtualData = window._config.videoVirtualData ? window._config.videoVirtualData : [];
        this.videoList = this.videoList.concat(videoVirtualData);
        this.videoLoading = false;
      }).catch((error) => {
        console.log("获取视频错误", error);
        this.videoLoading = false;
      })
    },
  },
  created() {
    // 初始化链接mq
    this.init();
    // 获取视频相关信息
    this.getStreamsList();
  },
};
</script>
<style lang="scss" scoped>
.body {
  background-color: rgb(3, 52, 71);
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

  .audio {
    overflow: auto;
    width: 40%;
    height: calc(100% - 40px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    padding: 20px;
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
