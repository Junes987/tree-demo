import React, { Children, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import styles from './Tree01.module.css'

const rootData = [
    {
        id: '1-0', 
        title: '1-0', 
        children: [
            {
                id: '1-0-0', 
                title: '1-0-0', 
                children: [
                    { 
                        id: '1-0-0-0', 
                        title: '1-0-0-0' 
                    },
                    { 
                        id: '1-0-0-1', 
                        title: '1-0-0-1' 
                    },
                    { 
                        id: '1-0-0-2', 
                        title: '1-0-0-2' 
                    },
                    {
                        id: '1-0-0-3',
                        title: '1-0-0-3',
                        children:[
                            { id: '1-0-0-3-0', title: '1-0-0-3-0' },
                            { id: '1-0-0-3-1', title: '1-0-0-3-1' },
                            { id: '1-0-0-3-2', title: '1-0-0-3-2' }, 
                        ]
                    }
                ]
            },
            {
                id: '1-0-1', 
                title: '1-0-1', 
                children: [
                    { id: '1-0-1-0', title: '1-0-1-0' },
                    { id: '1-0-1-1', title: '1-0-1-1' },
                    { id: '1-0-1-2', title: '1-0-1-2' }
                ]
            },
            { 
                id: '1-0-2', 
                title: '1-0-2' 
            }
        ]
    },
    {
        id: '1-1', 
        title: '1-1', 
        children: [
            { id: '1-1-0', title: '1-1-0' },
            { id: '1-1-1', title: '1-1-1' },
            { id: '1-1-2', title: '1-1-2' }
        ]
    },
    { id: '1-2', title: '1-2' },
    { id: '1-3', title: '1-3' },
    { id: '1-4', title: '1-4' }
]


const Tree01 = (props) => {
    const { onChange } = props
    const [list, setList] = useState([])
    const result = useRef([])

    // 创建一个有结构的树结构
    const createNode = (data, parent) => {
        const newData = [...data]
        newData.forEach((item) => {
            if (item.children && item.children.length > 0) {
                item.opened = 'close'
                createNode(item.children, item)
            } else {
                item.opened = ''
            }
            item.parent = parent // 子节点指向父节点
            item.checked = ''
        })
        setList(newData)
    }

    useEffect(() => {
        createNode(rootData, null)
    }, [])

    // 展开或关闭
    const handleChangeOpen = (current) => {
        if (!current.opened) {
            return
        }
        const opened = current.opened === 'open' ? 'close' : 'open'
        current.opened = opened
        setList([...list])
    }

    const getChecked = (item) => {
        /**
         * '','','' ==> ''
         * 'checked','checked','checked' ==> 'checked'
         * '','checked',''  ==> 'half'
         */
        const hasUnChecked = item.children.every(item => item.checked === '')
        const hasChecked = item.children.every(item => item.checked === 'checked')
        const hasHalf = item.children.every(item => item.checked === 'half')
        if (hasUnChecked && !hasChecked && !hasHalf) {
            return ''
        }
        if (!hasUnChecked && hasChecked && !hasHalf) {
            return 'checked'
        }
        return 'half'
    }

    // 调整父级，向上
    const adjustParentCheck = (current) => {
        let parent = current.parent
        if (parent) {
            parent.checked = getChecked(parent)
            adjustParentCheck(parent)
        }
        // while (parent) {
        //     parent.checked = getChecked(parent)
        //     parent = parent.parent
        // }
    }

    // 调整子级，向下
    const adjustChildCheck = (current, checked) => {
        if (current.children && current.children.length > 0) {
            current.children.forEach(item => {
                item.checked = checked
                adjustChildCheck(item, checked)
            })
        }
    }

    // 只选择子节点
    const handleResultByChild = (data) => {
        const searchChild = (data,callback) => {
            data.forEach((item) => {
                if(item.children){
                    searchChild(item.children,callback)
                }else{
                    if(item.checked === 'checked'){
                        callback(item)
                    }
                }
            })
        }
        const result = []
        searchChild(data, (item) => {
            result.push(item)
        })
        console.log(result)
    }

    // 向上折叠父节点
    const handleResultByParent = (data) => {
        const searchParent = (data,callback) => {
            data.forEach((item) => {
                if(item.checked === 'checked'){
                    callback(item)
                }else if(item.checked === 'half'){
                    searchParent(item.children,callback)
                }
            })
        }
        const result = []
        searchParent(data, (item) => {
            result.push(item)
        })
        console.log(result)
    }

    // 根据用户选择的先后顺序收集节点——项上收集
    const handleResultBySelectedOrder = (checkedNode,newChecked) => {
        if(checkedNode.checked === 'checked'){
            let current = checkedNode
            while(current.parent && current.parent.checked === 'checked'){
                current = current.parent
            }
            const deleteChild = (rootNode) => {
                if(rootNode.children){
                    rootNode.children.forEach((item) => {
                        let thisIndex = result.current.findIndex((v) => v.id === item.id)
                        if(thisIndex >= 0){
                            result.current.splice(thisIndex,1)
                        }
                        if(item.children){
                            deleteChild(item)
                        }
                    })
                }
            }
            deleteChild(current)
            result.current.push(current)
        }else{
            let current = checkedNode
            while(current.parent && current.parent.checked === 'half'){
                current = current.parent
            }
            const deleteParent = (rootNode) => {
                if(rootNode.children){
                    rootNode.children.forEach((item) => {
                        let thisIndex = result.current.findIndex((v) => v.id === item.id)
                        if(thisIndex >= 0){
                            result.current.splice(thisIndex,1)
                        }
                        if(item.checked === 'half' && item.children){
                            deleteParent(item)
                        }
                        if(item.checked === 'checked'){
                            let thisIndex = result.current.findIndex((v) => v.id === item.id)
                            if(thisIndex === -1){
                                result.current.push(item)
                            }
                        }
                    })
                }
            }
            let rootIndex = result.current.findIndex((node) => node.id === current.id)
            if(rootIndex >= 0){
                result.current.splice(rootIndex,1)
            }
            deleteParent(current)
        }
        console.log(result.current)
    }

    // 选中节点
    const handleChangeCheck = (current) => {
        if (current.checked === '' || current.checked === 'half') {
            current.checked = 'checked'
        } else {
            current.checked = ''
        }

        adjustParentCheck(current)
        adjustChildCheck(current, current.checked)
        setList([...list])
        // handleResultByChild([...list])
        // handleResultByParent([...list])
        handleResultBySelectedOrder(current,current.checked)
    }

    const renderTree = (data) => {
        return (
            <ul className={styles.tree}>
                {
                    data.map((item) => {
                        return (
                            <li
                                className={classNames(
                                    styles.treeItem,
                                    styles[item.opened]
                                )}
                                key={item.id}
                            >
                                <div className={styles.treeTitle}>
                                    <div
                                        className={classNames(
                                            styles.folder,
                                            styles[item.opened]
                                        )}
                                        onClick={() => handleChangeOpen(item)}
                                    >
                                    </div>
                                    <div
                                        className={classNames(
                                            styles.checkbox,
                                            styles[item.checked]
                                        )}
                                        onClick={() => handleChangeCheck(item)}
                                    >
                                    </div>
                                    <div className={styles.item}>{item.title}</div>
                                </div>
                                {item.children ? renderTree(item.children) : null}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    return (
        <div className={styles.container}>
            {
                renderTree(list)
            }
        </div>
    )
}


export default Tree01