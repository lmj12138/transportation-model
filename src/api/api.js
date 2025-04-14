import service from './request'
const prefix = window._config.baseUrl;//链接柔性看板

export const getStreamsListApi=()=> {
    // 获取视频信息
    return service({
        url: `${prefix}/streams`,
        method: 'get',
    })
}
