<template>
  <div id="map-container" style="width: 100%; height: 100%;"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import Hls from '../hls.js';
export default {
  name: 'AMapComponent',
  data() {
    return {
      map: null, // 地图实例
      markers: [], // 存储标记实例
      infoWindow: null, // 信息窗口实例
    };
  },
  props: {
    markerList: {
      type: Array,
      required: true
    },
    mqData: {
      type: Object,
      required: false
    },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      AMapLoader.load({
        // key: '2ec1538196c064f589303062e8a980d3', // 替换为你的高德地图API密钥
        key: window._config.key, // 替换为你的高德地图API密钥
        version: '2.0', // 指定要加载的 JSAPI 的版本
        plugins: ['AMap.Marker', 'AMap.InfoWindow'], // 需要使用的插件列表
      })
        .then((AMap) => {
          // 初始化地图
          this.map = new AMap.Map('map-container', {
            zoom: 16.5, // 地图缩放级别
            center: [121.404473, 31.226732], // 地图中心点坐标（华东师范大学）
            mapStyle: "amap://styles/blue",
            features: ['bg', 'road']
          });
          // 遍历数组，添加多个标记
          this.markerList.forEach((item, index) => {
            const content = `
                  <div style="position: relative; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                  <span 
                    style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px; color: #999;"
                    onclick="document.getElementById('info-window-close-btn').click()"
                  >×</span>
                  <h3 style="margin: 0 0 10px; font-size: 18px; color: #333;">${item.name}（${item.description}）</h3>
                  <p style="margin: 0 0 15px; font-size: 14px; color: #666;" id="processed_at"></p>
                  <video id="video" width="100%" height="200" controls controlsList="nodownload"></video>
                  <button id="info-window-close-btn" style="display: none;"></button>
                </div>
                `;
            const marker = new AMap.Marker({
              position: [item.location.latitude, item.location.longitude], // 标记的位置
              title: item.name,
              // content: item.content,
              icon: 'https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png', // 默认蓝色图标
              offset: new AMap.Pixel(10, 10),  // 设置锚点（根据图标尺寸调整）,
              extData: {  // 使用extData存储自定义属性
                id: item.id,
                src: "",
                name: item.name,
                description: item.description
              }
            });

            // 将标记添加到地图
            this.map.add(marker);
            this.markers.push(marker);

            // 绑定点击事件
            marker.on('click', () => {
              // this.showInfoWindow(content, [item.location.latitude, item.location.longitude], marker);
              // 点击气泡弹出回放视频弹框
              this.$emit("showViewReplay")
            });
          });

          // 初始化信息窗口
          this.infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -10), // 信息窗口的偏移量
            isCustom: true, // 使用自定义内容
            size: new AMap.Size(420, 300), // 设置信息窗口大小
          });
        })
        .catch((e) => {
          console.error('高德地图加载失败', e);
        });
    },

    // 显示信息窗口
    showInfoWindow(content, position, marker) {
      if (!marker.getExtData().src) return;
      // 重置所有标记的图标为蓝色
      this.markers.forEach((m) => {
        m.setIcon('https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png');
      });

      // 将当前点击的标记图标设置为红色
      marker.setIcon('https://webapi.amap.com/theme/v1.3/markers/b/mark_r.png');

      // 显示信息窗口
      this.infoWindow.setContent(content); // 设置信息窗口内容
      this.infoWindow.open(this.map, position); // 打开信息窗口

      // 绑定关闭按钮事件
      setTimeout(() => {
        const closeBtn = document.getElementById('info-window-close-btn');
        if (closeBtn) {
          closeBtn.onclick = () => {
            this.infoWindow.close();
          };
        }
      }, 0);

      // 渲染出数据
      const time = document.getElementById('processed_at');
      console.log("time",time);
      
      time.innerHTML = marker.getExtData().processed_at;
      // 打开之后渲染实时视频
      // setTimeout(() => {
      const video = document.getElementById('video');
      video.src = marker.getExtData().src;
      video.play();
      // const hls = new Hls();
      // hls.loadSource(marker.getExtData().src);
      // hls.attachMedia(video);
      // hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
      // }, 1000)
    },
  },
  watch: {
    mqData(newVal, oldVal) {
      if (newVal) {
        if (newVal.type == 'traffic_alert') {
          // 交通报警的时候
          this.markers = this.markers.map((item) => {
            if (item.getExtData().id == newVal.stream_id) {
              item.setIcon('https://webapi.amap.com/theme/v1.3/markers/b/mark_r.png');
              item.setExtData({
                ...item.getExtData(),
                src: newVal.url, // 假设mqData中包含新的视频流地址
                processed_at: newVal.processed_at // 假设mqData中包含新的视频流地址
              });
            } else {
              item.setIcon('https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png');
            }
            return item;
          })
        }
      }
    },
  },
  beforeDestroy() {
    // 销毁地图实例
    if (this.map) {
      this.map.destroy();
    }
  },
};
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
<style>
.amap-icon img {
  left: 0;
}
</style>