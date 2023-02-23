// 实现h函数
const h = (tag, props, children) => {
    return {
        tag,
        props,
        children
    }
}
// 实现mount函数
const mount = (vnode, container) => {
    // 通过tag创建html标签，并挂载到el属性
    vnode.el = document.createElement(vnode.tag)
    const el = vnode.el
    // 判断props
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]
            // 判断是否为监听事件
            if (key.startsWith("on")) {
                // 添加事件监听
                // el[vnode.props] = value
                el.addEventListener = (key.slice(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }
    // 判断childern
    if (vnode.children) {
        const children = vnode.children
        if (typeof children === "string") {
            el.textContent = children
        } else {
            children.forEach(item => {
                mount(item, el)
            })
        }
    }
    // 将标签挂载到页面
    container.appendChild(el)

}
const patch = (n1, n2) => {
    // 判断两个节点是否属于同类型
    if (n1.tag != n2.tag) {
        // 相等，直接替换
        // 找到父节点
        const Felement = n1.el.parentElement
        // 将旧的节点删除
        Felement.removeChild(n1.el)
        // 将新节点挂载
        mount(n2, Felement)
    } else {
        // 同类
        // 保存el
        const el = n2.el = n1.el
        // 将新的props全部挂载
        const newProps = n1.props || {}
        const oldProps = n2.props || {}
        for (let key in newProps) {
            newValue = newProps[key]
            oldValue = oldProps[key]
            // 不变的属性，不用重新挂载
            if (newValue != oldValue) {
                // 判断是否为监听事件
                if (key.startsWith("on")) {
                    // 添加事件监听
                    // el[vnode.props] = value
                    el.addEventListener = (key.slice(2).toLowerCase(), newValue)
                } else {
                    el.setAttribute(key, newValue)
                }
            }
        }
        // 将旧的props全部删除
        for(let key in oldProps){
            newValue = newProps[key]
            oldValue = oldProps[key]
            // 不变的属性不用删除
            if(oldValue != newValue){
                // 判断是否为监听事件
                if (key.startsWith("on")) {
                    // 添加事件监听
                    // el[vnode.props] = value
                    el.removeEventListener = (key.slice(2).toLowerCase(), oldValue)
                } else {
                    el.removeAttribute(key, newValue)
                }
            }
        }
        // 处理child
        newChild = n2.childern || []
        oldChild = n1.childern || []
        if(typeof newChild === 'string'){
            // 是字符串
            if(typeof oldChild == 'string'){
                el.textContent = newChild
            }else {
                el.innerHtml = newChild
            }
        }else {
            // 是数组
            // 判断旧节点子元素是否为数组
            if(typeof oldChild === 'string'){
                el.innerHtml = ''
                // 将新节点一个一个挂载上去
                newChild.forEach(item=>{
                    mount(item,el)
                })
            }else{
                // 旧节点子元素也为数组
                // 比较新旧数组，对对应位置的节点进行pathch操作
                minlength = Math.min(newChild.length,oldChild.length)
                for(let i = 0;i<minlength;i++){
                    patch(newChild[i],oldChild[i])
                }
                //
                if(newChild.length>oldChild.length){
                    // 将剩余的节点挂载
                    newChild.slice(oldChild).forEach(item=>{
                        mount(item,el)
                    })
                }else {
                    // 将多余的节点删除
                    oldChild.slic(newChild).forEach(item=>{
                        el.removeChild(item.el)
                    })
                }
            }
        }
    }

}