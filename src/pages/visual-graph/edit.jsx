import { useState, useEffect, useMemo } from 'react'
import { Link } from 'umi'
import { AppstoreTwoTone, PlusSquareTwoTone, MinusSquareTwoTone, EditTwoTone, ApiTwoTone } from '@ant-design/icons'
import { createForm } from '@formily/core'
import { v4 } from 'uuid'
import { Iframe } from '@/mobile_components'
import { Button, Select, Modal, notification, Popover } from 'antd'
import _, { find, map, get } from 'lodash'
import QRCode from 'qrcode.react'
import AceEditor from 'react-ace';
import { CompPropSetting } from '@/components'
import { geVisualPageById, updateVisualPageData } from '@/local_service'
import { randomGraphData, randomColor, nodeSchema } from './_config'
import styles from './edit.less'


let propFormIns
export default (props) => {

  // 完整图数据
  const [counter, setCounter] = useState(0)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  // 选中的节点数据
  const [activeNodes, setActiveNodes] = useState([])
  // 选中的边数据
  const [activeEdges, setActiveEdges] = useState([])
  // 选择准备连接
  const [isLinking, setIsLinking] = useState(false)
  // 选择编辑节点
  const [isSetting, setIsSetting] = useState(false)
  // 正在拖拽
  const [showDrop, setShowDrop] = useState(false)
  // 根据选中的node返回id
  const activeCompId = useMemo(() => {
    if (activeNodes[0]) {
      return activeNodes[0].id
    }
    return undefined
  }, [activeNodes])
  // 当选中编辑状态，才将nodeSchema赋值
  const schema = useMemo(() => {
    if (isSetting) {
      return nodeSchema
    }
    return ''
  }, [isSetting])

  useEffect(() => {
    const getByPageId = async (pageId) => {
      if (pageId) {
        const res = await geVisualPageById(pageId)
        document.title = res.name
        setCounter(res.graphData.counter)
        setNodes(res.graphData.graph.nodes || [])
        setEdges(res.graphData.graph.edges || [])
      }
    }
    const pageId = props.location.query.pageId
    getByPageId(pageId)
  }, [props.location.query.pageId])

  // 随机初始化
  const setRandomData = async () => {
    await updateVisualPageData({ id: props.location.query.pageId, graphData: { ...randomGraphData } })
    notification.success({
      message: '保存成功',
      duration: 2,
    })
    // setGraphData(randomGraphData)
    setCounter(randomGraphData.counter)
    setNodes([...randomGraphData.graph.nodes])
    setEdges([...randomGraphData.graph.edges])
  }

  // 保存图数据到后台
  const handleSaveBtnClick = async (inCounter = null, inNodes = null, inEdges = null) => {
    const postCounter = inCounter || counter;
    const postNodes = inNodes || nodes;
    const postEdges = inEdges || edges;
    await updateVisualPageData({ id: props.location.query.pageId, graphData: { counter: postCounter, graph: { nodes: postNodes, edges: postEdges } } })
    notification.success({
      message: '保存成功',
      duration: 2,
    })
  }

  // 右侧修改后保存数据并显示到中间
  const handleApplySetting = async () => {
    const data = await propFormIns.submit()
    const node = find(nodes, { id: activeNodes[0].id })
    node.label = data.label
    setNodes([...nodes])
    handleSaveBtnClick(null, [...nodes], null)
  }

  // 进入编辑node状态
  const preSetting = ({ label }) => {
    // 当propFormIns无则新建，有则直接setValues
    // 由于propFormIns定义在全局中，如果每次都createForm()
    // 则propFormIn指向每次变化，但下面视图获取的值不是及时更新，导致右端显示前一个propFormIns
    if (!propFormIns) {
      propFormIns = createForm()
    }
    propFormIns.setValues({ label })
    if (!isSetting) {
      setIsSetting(true)
    }
  }

  // 选中一个边或者一个节点
  const handleChooseItem = ({ itemId, chooseType }) => {
    if (chooseType === 'node') {
      if (!!(activeNodes.length) && isLinking) {
        // 之前已经选了一个node，且选择了连接选项 ==> 建立连接edge
        const nowChooseNode = find(nodes, { id: itemId })
        const preChooseNode = activeNodes[0]
        const addEdge = { id: v4(), from: preChooseNode.id, to: nowChooseNode.id }
        edges.push(addEdge)
        setEdges([...edges])
        setActiveNodes([{ ...nowChooseNode }])
        setIsLinking(false)
        preSetting({ ...nowChooseNode })
      } else {
        // 之前没选node，或选了edge
        const chooseNode = find(nodes, { id: itemId })
        setActiveNodes([{ ...chooseNode }])
        setActiveEdges([])
        preSetting({ ...chooseNode })
      }
    } else {
      // 选择edge
      const chooseEdge = find(edges, { id: itemId })
      setActiveEdges([{ ...chooseEdge }])
      setActiveNodes([])
    }
  }

  // 清空选择项
  const handleClearItem = () => {
    setActiveNodes([])
    setActiveEdges([])
  }

  // 删除选中的node或edge
  const removeChoose = () => {
    if (activeNodes.length === 1 && !isLinking) {
      // 删除node及其edges
      const nodeIndex = _.findIndex(nodes, item => item.id === activeNodes[0].id)
      setCounter(count => count - 1)
      nodes.splice(nodeIndex, 1)
      setNodes([...nodes])
      const newEdges = _.remove(edges, item => ((item.from !== activeNodes[0].id) && (item.to !== activeNodes[0].id)))
      setEdges([...newEdges])
      setActiveNodes([])
      handleSaveBtnClick(counter - 1, [...nodes], [...newEdges])
    } else {
      // 删除edge即可
      const edgeIndex = _.findIndex(edges, item => item.id === activeEdges[0].id)
      edges.splice(edgeIndex, 1)
      setEdges([...edges])
      setActiveEdges([])
      handleSaveBtnClick(null, null, [...edges])
    }
  }

  // 随机新增node
  const addRandomNode = () => {
    const addNode = { id: v4(), label: "new Node", color: randomColor() }
    setCounter(count => count + 1)
    nodes.push({ ...addNode })
    setNodes([...nodes])
    handleSaveBtnClick(counter - 1, [...nodes], null)
  }

  // 处理show-graph视图传来的事件
  const onReceiveMessage = e => {
    try {
      if (e.data.toString() !== '[object Object]') {
        const data = JSON.parse(e.data)
        switch (data.func) {
          case 'handleChooseItem':
            handleChooseItem(data.params)
            break;
          case 'handleClearItem':
            handleClearItem()
            break;
          case 'handleDrop':
            addRandomNode()
            break
          default:
            break
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 拖拽开始
  const handleDragStart = e => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('data', JSON.stringify('add new node through drag'))
    setShowDrop(true)
  }

  // 拖拽结束
  const handleDragEnd = e => {
    e.dataTransfer.clearData()
    setShowDrop(false)
  }

  // JSON Schema 美化
  const syntaxHighlight = json => {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    const classToColor = {
      string: 'green',
      number: 'darkorange',
      boolean: 'blue',
      null: 'magenta',
      key: 'red'
    }
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span style="color:${classToColor[cls]}">${match}</span>`;
    });
  }

  return (
    <div className={styles.page}>
      <section className={styles.head}>
        <div className={styles.title}>react 可视化设计</div>
        <div className={styles['operate-region']}>
          <Button type="primary" onClick={e => handleSaveBtnClick()}>
            保存
          </Button>
          <Popover
            content={
              <QRCode value={`${qrcodeUrlPrefix}/visual-page/preview?pageId=${props.location.query.pageId}`} />
            }
            title="保存后可以扫码预览"
          >
            <Button>扫码预览</Button>
          </Popover>
          <Link to="/visual-page">返回</Link>
        </div>
        <div>
          <a
            href="https://github.com/react-visual-design/react-visual-design"
            className={styles['github-link']}
            target="_blank"
          />
        </div>
      </section>
      <div className={styles.left}>
        <div className={styles.comp}>
          <p className={styles['comp-title']}>基础操作</p>
          <Button icon={<AppstoreTwoTone />}
            disabled={!!(counter)}
            onClick={setRandomData}
          >随机初始化</Button>
          <Button icon={<PlusSquareTwoTone />}
            onClick={addRandomNode}>
            添加</Button>
          <Button icon={<MinusSquareTwoTone />}
            disabled={(!(activeNodes.length || activeEdges.length))}
            onClick={removeChoose}>
            删除</Button>
          {/* <Button icon={<EditTwoTone />}
            disabled={!(activeNodes.length)}
            onClick={preSetting}>
            编辑</Button> */}
          <Button icon={<ApiTwoTone />}
            disabled={!(activeNodes.length === 1)}
            onClick={() => { setIsLinking(true) }}>
            连接</Button>
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <PlusSquareTwoTone />
            拖拽
          </div>
        </div>

        <div>
          <div className={styles.title}>JSON Schema</div>
          <pre className={styles.listBody}>
            <div dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify({ nodes, edges }, null, 2)) }} ></div>
          </pre>
        </div>

      </div>

      <div className={styles.center}>
        <Iframe
          attributes={{
            src: '/visual-graph/show-graph',
            width: '100%',
            height: '100%',
            frameBorder: 0,
          }}
          postMessageData={{ counter, nodes, edges, showDrop }}
          handleReceiveMessage={onReceiveMessage}
        />

      </div>
      <div className={styles.right}>
        <div className={styles.title}>
          <span>属性设置</span>
          {(!!(activeNodes.length || activeEdges.length)) && (
            <Button type="primary" onClick={handleApplySetting}>
              应用
            </Button>
          )}
        </div>
        <div className={styles.content}>
          {(!!(activeNodes.length)) && (
            <CompPropSetting
              propFormIns={propFormIns}
              schema={schema}
              key={activeCompId}
              id={activeCompId}
            />)
          }
        </div>
      </div>
    </div>
  )

}
