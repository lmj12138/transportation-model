<template>
    <div class="video-item">
        <video :id="'video_' + videoId" controls></video>
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
            isVideoOpen: true,
        };
    },
    props: {
        videoSrc: {
            type: String,
            required: true
        },
        videoId: {
            type: String,
            required: true
        },
        videoInfo: {
            type: Object,
            required: true
        },
        videoIndex: {
            type: Number,
            required: true
        }
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
        }
    },
    mounted() {
        if (this.videoId && this.videoIndex == 0) {
            const video = document.getElementById('video_' + this.videoId);
            const hls = new Hls();
            hls.loadSource(this.videoSrc + '/index.m3u8');
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
            this.isVideoOpen = false;
        }
        if (!this.videoSrc) {
            this.isVideoOpen = false;
        }
    },
    watch: {},
};
</script>

<style lang="scss" scoped>
.video-item {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    width: calc(50% - 20px);
    max-height: 400px;
    min-height: 240px;
    /* 确保每个视频组件宽度不超过 50% */
    position: relative;
}

video {
    width: 360px;
    height: 240px;
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