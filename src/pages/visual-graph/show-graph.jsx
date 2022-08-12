import React, { useState, useEffect } from 'react';
import Graph from "react-graph-vis";
import { throttle } from 'lodash'

const options = {
    layout: {
        hierarchical: false
    },
    edges: {
        color: "#000000"
    }
};

function ShowGraph() {
    // 完整图数据
    const [counter, setCounter] = useState(0)
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])

    useEffect(() => {
        const eventListener = e => {
            const data = JSON.parse(e.data)
            setCounter(data.counter)
            setNodes([...data.nodes])
            setEdges([...data.edges])
        }
        window.addEventListener('message', eventListener)

        return () => {
            window.removeEventListener('message', eventListener)
        }
    }, [])


    const dragOverCallback = throttle(e => {
        e.dataTransfer.dropEffect = 'copy'
    }, 1000)

    const handleDragOver = e => {
        e.preventDefault()
        e.persist()
        dragOverCallback(e)
    }

    const handleDragLeave = e => {
        // e.currentTarget.classList.remove(styles['dropPlaceHolder-active'])
        console.log('handleDragLeave')
    }

    const handleDrop = e => {
        e.preventDefault()
        const dataStr = e.dataTransfer.getData('data')
        const data = JSON.parse(dataStr)
        console.log(data)
        window.parent.postMessage(
            JSON.stringify({ func: 'handleDrop' }),
            '*'
        )
    }

    // 向上层传递选中的edge或node信息
    const handleChooseItem = (itemId, chooseType) => {
        window.parent.postMessage(
            JSON.stringify({ func: 'handleChooseItem', params: { itemId, chooseType } }),
            '*',
        )
    }

    // 向上层传递清空选中
    const handleClearItem = () => {
        window.parent.postMessage(
            JSON.stringify({ func: 'handleClearItem' }),
            '*',
        )
    }

    // graph 组件的触发事件
    const events = {
        select: ({ nodes, edges }) => {
            if (nodes.length || edges.length) {
                // 限定每次只会选中一个edge或者一个node
                if (nodes.length) {
                    handleChooseItem(nodes[0], 'node')
                } else {
                    handleChooseItem(edges[0], 'edge')
                }
            } else {
                handleClearItem()
            }
        }
    }

    const graph = {
        nodes,
        edges
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {!!(counter) && (<Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />)}
        </div>
    );
}

export default ShowGraph;
