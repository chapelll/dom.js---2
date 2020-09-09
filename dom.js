window.dom = {

    // 增

    // 1.创建节点
    create(string) {
        let container = document.createElement('template')
        container.innerHTML = string.trim()
        return container.content.firstChild
        // (传入字符串形式的标签便可以直接创建元素，比如传入 "<div>" 或者 "<li>")
    },

    // 2.追加节点(在一个节点后面新增一个节点)
    after(node, node2) {
        node.parentNode.insertBefore(node2, node.nextSibling)
        // 找到node的父亲，父亲会将node2插入到node的下一个节点的前面(node为最后一个节点也功能也正常)
    },

    // 3.前置节点(在一个节点前面新增一个节点)
    before(node, node2) {
        node.parentNode.insertBefore(node2, node)
        // 找到node的父亲，父亲使用insertBefore将node2插入到子元素node的前面
    },

    // 4.新增子节点
    append(parent, node) {
        parent.appendChild(node)
        // parent节点中增加孩子节点node
    },

    // 5.在子节点外包裹父节点
    wrap(node, parent) {
        dom.before(node, parent)
        dom.append(parent, node)
        // 先将parent放到node前面，再将node放到parent里面
    },

    // 删

    // 1.删除节点
    remove(node) {
        node.parentNode.removeChild(node)
        return node
        // 让node的父亲删除node这个孩子
    },

    // 2.置空节点
    empty(node) {
        let childNodes = node.childNodes
        let array = []
        let x = node.firstChild
        while (x) {
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
        // 利用while循环将node的所有子节点删除，首先将node的第一个孩子(如果有的话)赋给x，如果x存在就删除node第一个孩子，接着将x指向node最新的第一个孩子
        // 创建一个数组保存被删除的子节点并返回出去
    },

    // 改

    // 1.设置、读取属性
    attr(node, name, value) {
        if (arguments.length === 3) {
            return node.setAttribute(name, value)
        } else if (arguments.length === 2) {
            return node.getAttribute(name)
        }
        // 如果传入的参数个数为3，就设置node的新属性name，其值为value(写)。如果传入的参数个数为2，就读取node的属性name(读)。
    },


    // 2.设置新的文本
    text(node, string) {
        if (arguments.length === 2) {
            if ('textContent' in node) {
                node.textContent = string
            } else {
                node.innerText = string
            }
        } else if (arguments.length === 1) {
            if ('textContent' in node) {
                return node.textContent
            } else {
                return node.innerText
            }
        }
        // 在node节点中添加新的文本(string), 当前浏览器是IE时使用node.innerText ，不是则使用node.textContent
        // 如果传入的参数个数为2，就设置node的text为string(写)。如果传入的参数个数为1，就读取node的text(读)。
    },


    // 3.设置新的HTML
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string
        } else if (arguments.length === 1) {
            return node.innerHTML
        }
        // 与text方法几乎一致
    },

    // 4.设置、读取节点的style样式
    style(node, name, value) {
        if (arguments.length === 3) {
            // dom.style(div,'border','1px solid red')
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                // dom.style(div,'color')
                return node.style[name]
            } else if (name instanceof Object) {
                // dom.style(div, {color: 'red'})
                for (let key in name) {
                    node.style[key] = name[key]
                }
            }
        }
        // 如果传入的参数个数为3，将node节点的style样式中名字为name的值变更为value
        // 如果传入的参数个数为2且第二个参数为字符串类型，就返回node的style样式中名字为name的值(读)
        // 如果传入的参数个数为2且第二个参数为对象类型，就遍历这个对象并且将node的style样式名字为"key"的值修改为每个key在对象中对应的"value"
    },

    // 5.添加删除判断节点的class属性
    class: {
        add(node, className) {
            node.classList.add(className)
            // 在node上添加class类名，其值为className
        },
        remove(node, className) {
            node.classList.remove(className)
            // 在node上删除class类名，其值为className
        },
        has(node, className) {
            return node.classList.contains(className)
            // 在node上查询class类名，有返回true，无返回false
        }
    },

    // 6.添加事件
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
        // 在node上添加一个事件，eventName为事件名字，fn为事件处理函数
    },

    // 7.移除事件
    off(node, eventName, fn) {
        node.addEventListener(eventName, fn)
        // 在node上移除eventName的事件处理函数fn
    },

    // 查

    // 1.寻找节点
    find(selector, scoped) {
        return (scoped || document).querySelectorAll(selector)
        // 如果有scoped参数，就在scoped的范围里寻找选择器为selector的节点。没有就在全局寻找选择器为selector的节点(返回的都是一个数组)。scoped一般是一个标签元素，如 find(".name", div1): 在div1这个节点中寻找class为name的元素
    },

    // 2.寻找父节点
    parent(node) {
        return node.parentNode
        // 返回node节点的父节点
    },

    // 3.寻找子节点
    children(node) {
        return node.children
        // 返回node节点的子节点
    },

    // 4.寻找兄弟节点
    Sibling(node) {
        let arr = Array.from(node.parentNode.children)
        return arr.filter(n => n !== node)
        // 首先找到node节点的父节点的所有子节点，将其转换为一个数组，使用filter将node剔除出去只剩下兄弟
    },

    // 5.寻找弟弟节点(node的下一个节点)
    next(node) {
        let x = node.nextSibling
        while (x && x.nodeType === 3) {
            x = x.nextSibling
        }
        return x
        // 先让x等于node的下一个节点，如果x存在且是文本节点，那么x就再等于x的下一个节点(直到下一个节点不是文本节点或者不存在下一个节点就返回x)。x不存在就直接返回x
    },

    // 6.寻找哥哥节点(node的上一个节点)
    previous(node) {
        let x = node.previousSibling
        while (x && x.nodeType === 3) {
            x = x.previousSibling
        }
        return x
        // 先让x等于node的上一个节点，如果x存在且是文本节点，那么x就再等于x的上一个节点(直到上一个节点不是文本节点或者不存在上一个节点就返回x)。x不存在就直接返回x
    },

    // 7.遍历节点列表中的的所有节点并进行操作
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i])
        }
        // nodeList是节点列表，fn是传入的操作函数，对nodeList中的所有节点都执行fn函数
    },

    // 8.获取节点的排名
    index(node) {
        let list = dom.children(node.parentNode) 
        let i
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break
            }
        }
        return i
        // 找到节点的父亲，获取父亲中的所有孩子
        // 遍历所有孩子，并且每个孩子都与node做对比，如果相等就返回i，i就是node在所有孩子中的第几个
    }
























}



