/**
 * 
 * @param {状态、数据持久化} store 
 */
export default function (store) {
    // console.log(store);
    // 存
    const KEY = 'VUEX:STATE';
    //这里表示 页面关闭 或 刷新 时存储
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem(KEY, JSON.stringify(store.state))
    })
    // 取
    try {
        const state = JSON.parse(sessionStorage.getItem(KEY));
        if (state) {
            store.replaceState(state);
        }
    } catch (err) {
        console.log(err);
    }
}