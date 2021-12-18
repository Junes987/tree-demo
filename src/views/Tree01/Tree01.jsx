import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import styles from './Tree01.module.css'

const rootData = [
    {
        id: '1', title: '笔记本电脑', children: [
            {
                id: '1-1', title: '华硕', children: [
                    { id: '1-1-1', title: 'a-1' },
                    { id: '1-1-2', title: 'a-2' },
                    { id: '1-1-3', title: 'a-3' }
                ]
            },
            {
                id: '1-2', title: '戴尔', children: [
                    { id: '1-2-1', title: 'b-1' },
                    { id: '1-2-2', title: 'b-2' },
                    { id: '1-2-3', title: 'b-3' }
                ]
            },
            { id: '1-3', title: 'sony' }
        ]
    },
    {
        id: '2', title: '冰箱', children: [
            { id: '2-1-1', title: '冰箱-1' },
            { id: '2-1-2', title: '冰箱-2' },
            { id: '2-1-3', title: '冰箱-3' }
        ]
    },
    { id: '3', title: '洗衣机' },
    { id: '4', title: '鼠标' },
    { id: '5', title: '手机' }
]


const Tree01 = (props) => {
    const { onChange } = props
    const [list, setList] = useState([])
    const checkedList = useRef([])

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