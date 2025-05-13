<template>
    <div class="home">
      <div class="nav">
        <div class="model-title">
          <div class="title">交通大模型</div>
          <div>Transportation Model V{{ version }}</div>
        </div>
        <div class="info">
          <p class="time">{{ nowTime }}</p>
          <p class="map-enter">
            <el-select v-model="mapCenetr" placeholder="请选择" class="transparent-select">
              <el-option v-for="item in mapCenetrList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </p>
        </div>
      </div>
      <router-view :mqData="mqData" />
    </div>
  </template>
  
  <script>
  import Stomp from "stompjs";
  import pack from '../../../package.json';
  export default {
    data() {
      return {
        nowTime: "",//当前的时间
        client: null,
        isConnecting: false,
        mqData: null,
        version: pack.version,
        mapCenetr: '请选择区域',
        mapCenetrList: [
          { value: '请选择区域', label: '请选择区域' },
        ],
      };
    },
    components: {},
    methods: {
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
      // 获取年月日
      getCurrentDateAndWeek() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const week = weekList[date.getDay()];
        this.nowTime = `${year}年${month}月${day}日 ${week}`;
      },
    },
    created() {
      // 初始化链接mq
      this.init();
      this.getCurrentDateAndWeek();
    },
  };
  </script>
  <style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
  
    .nav {
      width: 100%;
      height: 73px;
      background-color: #291F65;
      position: relative;
  
      .model-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 19px;
        color: #fff;
        position: absolute;
        height: 73px;
        width: 485px;
        /* 添加从左往右的渐变背景色 */
        background: linear-gradient(to right, rgba(202, 11, 251, 0.38), rgba(68, 38, 255, 0.38));
        z-index: 10;
        padding-left: 28px;
        text-align: left;
        clip-path: polygon(0 0, 100% 0, 100% calc(100% - 101px), calc(100% - 101px) 100%, 0 100%);
  
        .title {
          font-size: 32px;
          line-height: 32px;
          font-weight: bold;
          margin-top: 10px;
          margin-bottom: 5px;
        }
      }
  
      .info {
        height: 100%;
        margin-left: 485px;
        font-size: 19px;
        color: #fff;
        display: flex;
        align-items: center;
  
        .time {
          display: flex;
          align-items: center;
          margin-left: 30px;
          height: 32px;
          width: 240px;
          font-size: 20px;
          border-right: 4px solid rgba(255, 255, 255, 0.18);
        }
  
        .map-enter {
          display: flex;
          align-items: center;
          height: 32px;
          width: 240px;
          border-right: 4px solid rgba(255, 255, 255, 0.18);
        }
      }
    }
  }
  </style>
  