<template>
    <div class="video-body">
        <div class="top">
            <el-select v-model="currentVideo" placeholder="请选择" class="vidio-select" @change="handelChange">
                <el-option v-for="item in videoList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <div class="back-button" @click="showViewReplay">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20">
                    <path id="rect2020"
                        d="M12.523,6a1,1,0,0,0-.986,1v3H10a8,8,0,1,0,0,16H22a8,8,0,0,0,0-16H19.734l-6.7-3.867A.979.979,0,0,0,12.523,6Zm1.012,2.73L17.465,11l-3.93,2.268ZM10,12h1.537v3a1,1,0,0,0,1.5.865L19.73,12H22a6,6,0,1,1,0,12H10a6,6,0,0,1,0-12Z"
                        transform="translate(-2 -6)" fill="#fff" />
                </svg>
                查看回放
            </div>
        </div>
        <video id="videoRef" controls></video>
        <el-button v-if="isVideoOpen" class="open-button" icon="el-icon-video-play" type="primary"
            @click.once="videoClick"></el-button>
        <el-button class="amplify-button" icon="el-icon-search" type="primary" @click.stop="handleClick"></el-button>
    </div>
</template>

<script>
import Hls from '../hls.js';
export default {
    data() {
        return {
            currentVideo: "",
            currentVideoInfo: {},
            isVideoOpen: true,
        };
    },
    props: {
        videoList: {
            type: Array,
            required: true
        },
    },
    methods: {
        // 点击播放器
        videoClick() {
            console.log("点击播放器");
            if (this.videoIndex != 0 && this.videoSrc) {
                this.isVideoOpen = false;
                const video = document.getElementById('video_' + this.videoId);
                const hls = new Hls();
                hls.loadSource(this.videoSrc + '/index.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
            }
        },
        handleClick() {
            this.$emit('videoClick', this.videoInfo);
        },
        // 下拉框的数据变化时
        handelChange() {
            const videoItem = this.videoList.filter(item => item.id === this.currentVideo);
            this.currentVideoInfo = videoItem[0];
            const video = document.getElementById('videoRef');
            const hls = new Hls();
            hls.loadSource(this.currentVideoInfo.url + '/index.m3u8');
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
            this.isVideoOpen = false;
        },
        // 点击查看回放
        showViewReplay() {
            this.$emit('showViewReplay', this.currentVideoInfo);
        },
    },
    mounted() { },
    watch: {
        videoList: {
            handler(newList) {
                if (newList && newList.length > 0) {
                    this.currentVideo = newList[0].id;
                    this.handelChange();
                }
            },
            // 立即执行监听器
            immediate: true,
            // 深度监听数组变化
            deep: true
        }
    },
};
</script>

<style lang="scss" scoped>
.video-body {
    padding: 0px 10px;
    width: 100%;

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .top-left {
            background-color: rgba(255, 255, 255, 0.54);
        }
    }

    .back-button {
        padding: 0px 10px;
        min-width: 136px;
        height: 40px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.24);
        cursor: pointer;
        font-size: 16px;

        svg {
            margin-right: 10px;
            font-size: 20px;
        }
    }

    .vidio-select {
        height: 40px;
        width: 334px;
    }
}

video {
    width: 100%;
    height: 452px;
    border: none;
    cursor: pointer;
}

.video-item:hover {
    .amplify-button {
        // right: 20px;
        display: inline-block;
    }

    .open-button {
        // right: 152px;
        display: inline-block;
    }
}


.amplify-button {
    display: none;
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.5);
    color: #fff;
}

.open-button {
    display: none;
    position: absolute;
    top: 100px;
    font-size: 20px;
    right: 152px;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.5);
    color: #fff;
}
</style>