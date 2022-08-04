import React, { useState, useEffect } from 'react';
import Graph from "react-graph-vis";

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
    // 选中的节点数据
    // const [activeNodes, setActiveNodes] = useState([])
    // 选中的边数据
    // const [activeEdges, setActiveEdges] = useState([])

    useEffect(() => {
        const eventListener = e => {
            const data = JSON.parse(e.data)
            setCounter(data.counter)
            setNodes([...data.nodes])
            setEdges([...data.edges])
            // console.log(data.counter, data.nodes, data.edges)
            // setActiveNodes(data.activeNodes)
            // setActiveEdges(data.activeEdges)
        }
        window.addEventListener('message', eventListener)

        return () => {
            window.removeEventListener('message', eventListener)
        }
    }, [])

    const createNode = (x, y) => {
        return false
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
        <div>
            {!!(counter) && (<Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />)}
        </div>
    );
}

export default ShowGraph;
