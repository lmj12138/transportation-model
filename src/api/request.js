//request.js
import axios from "axios";
import Vue from 'vue';

let v = new Vue();
const baseUrl = window._config.baseUrlMaps;
/****** 创建axios实例 ******/

// axios.defaults.withCredentials = true
const service = axios.create({
    // baseURL: window._config.baseUrl,  // api的base_url
    baseURL: "/",
    timeout: 600000, // 请求超时时间
    withCredentials: true,
    headers: {

    }
});


/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
    if (config && config.url === `${baseUrl}/auth/oauth/token`) {
        config.headers["Authorization"] = 'Basic bWFwczoxMjM0NTY=';
    } else if (config && config.url.includes("hqit-api")) {  // 判断是否是获取hqit官网后台数据的（去除token）
    } else if (sessionStorage.getItem("token")) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${sessionStorage.getItem("token")}`;
    }
    return config;
}, error => { //请求错误处理
    v.$Message.warning(error);
    Promise.reject(error)
});

/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
    response => {
        if (response.request.responseType === "blob") {
            let flag = true
            let fileReader = new FileReader();
            fileReader.onload = function () {
                try {
                    let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
                    if (jsonData.code !== 0) {

                        v.$Modal.warning({
                            title: "提示",
                            content: jsonData.message,

                        });
                        v.$Spin.hide()
                        flag = true
                    }
                } catch (err) {   // 解析成对象失败，说明是正常的文件流
                    flag = true
                }
            };
            fileReader.readAsText(response.data)
            if (flag) {
                v.$Spin.hide()
                return response;

            }

        } else {
            return response.data;
            // if (response.data.code === -1 || response.data.code === -40001 || response.data.code === -40002 || response.data.code === 200 || response.data.code === 0 || response.data.code === 2 || response.data.message === 'invalid challenge code!') {
            //     return response.data;
            // } else if(response.data.code === 401){
            //     // 返回 401 清除token信息并跳转到登录页面
            //     sessionStorage.clear();
            //     v.$message({
            //         message: "请登录",
            //         type: 'warning'
            //     });
            //     // 跳转到后台的统一登录
            //     window.location.href = window._config.loginUrl;
            // }else{
            //     v.$Modal.warning({
            //         title: "提示",
            //         content: response.data.message,
            //     })
            //     if (response.config.url !== '/auth/oauth/challenge') {
            //         v.$Modal.warning({
            //             title: "提示",
            //             content: response.data.message,
            //         })

            //     }
            //     return response.data;
            // }
        }
    },
    error => { //响应错误处理
        console.log(error.response, '拦截到错误');
        v.$message({
            message: error,
            type: 'warning'
        });

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    sessionStorage.clear();
                    v.$message({
                        message: "请登录",
                        type: 'warning'
                    });
                    // 跳转到后台的统一登录
                    window.location.href = window._config.loginUrl;
                    break;
            }
        }
        return Promise.reject(error)
    }
);

export default service;
