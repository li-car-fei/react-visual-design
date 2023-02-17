import { useState, useEffect, useMemo } from 'react'
import { Link } from 'umi'
import * as AntdIcons from '@ant-design/icons'
import { createForm } from '@formily/core'
import { v4 } from 'uuid'
// import * as VisualDesignComponents from 'react-visual-design-components'
// import { Iframe } from 'react-visual-design-components'
import * as VisualDesignComponents from '@/mobile_components'
import { Iframe } from '@/mobile_components'
import { Button, Select, Modal, notification, Popover } from 'antd'
import _, { find, map, get } from 'lodash'
import QRCode from 'qrcode.react'
import { Drag, CompPropSetting, Devices, NocodePost } from '@/components'
// import { geVisualPageById, updateVisualPageData } from '@/service'
import { geVisualPageById, updateVisualPageData } from '@/local_service'
import deviceList from '@/util/device'
import { arrayIndexForward, arrayIndexBackward } from '@/util/array'
import styles from './edit.less'

const { Option } = Select

const dragList = _(Object.values(VisualDesignComponents)).map(
  v => {
    const { compAttr } = v
    if (!compAttr) {
      return false
    }
    const IconComp = AntdIcons[compAttr.iconName || 'StarOutlined']
    return {
      ...compAttr,
      key: compAttr.name,
      icon: <IconComp />
    }
  }
).compact().value()

let propFormIns
export default (props) => {

  const [selectedList, setSelectedList] = useState([])
  const [showDrop, setShowDrop] = useState(false)
  const [activeCompId, SetActiveCompId] = useState('')
  const [selectedDevice, setSelectedDevice] = useState('iphone-8')

  const activeComp = useMemo(() => find(selectedList, { id: activeCompId }) || {}, [activeCompId, selectedList])
  const activeCompSchema = useMemo(() => get(VisualDesignComponents, `${activeComp.name}.propSchema`), [activeComp])

  useEffect(() => {
    const getByPageId = async (pageId) => {
      if (pageId) {
        const res = await geVisualPageById(pageId)
        document.title = res.name
        setSelectedList(res.data || [])
      }
    }
    const pageId = props.location.query.pageId
    getByPageId(pageId)
    console.log('effect')
  }, [props.location.query.pageId, selectedList])

  const handleSaveBtnClick = async (list = null) => {
    const updateList = list || selectedList
    await updateVisualPageData({ id: props.location.query.pageId, data: updateList })
    notification.success({
      message: '保存成功',
      duration: 2,
    })
  }

  const handleDragStart = () => {
    setShowDrop(true)
  }

  const handleDragEnd = () => {
    setShowDrop(false)
  }

  const handleApplySetting = async () => {
    const matchComp = find(selectedList, { id: activeCompId })
    if (!matchComp) {
      return false
    }
    try {
      matchComp.data = await propFormIns.submit()
      setSelectedList([...selectedList])
      return handleSaveBtnClick()
    } catch (err) {
      return console.error(err)
    }
  }

  const handleDeviceChange = val => {
    setSelectedDevice(val)
  }

  const handleOperateItem = ({ type, index }) => {
    if (type === 'delete') {
      Modal.confirm({
        title: '确定删除该组件?',
        icon: <AntdIcons.ExclamationCircleOutlined />,
        content: '删除之后,将不能恢复',
        onOk: () => {
          setSelectedList([...(selectedList.splice(index, 1))])
        },
      })
    } else if (type === 'up') {
      const newSelectedList = arrayIndexForward(selectedList, index)
      setSelectedList([...newSelectedList])
    } else if (type === 'down') {
      const newSelectedList = arrayIndexBackward(selectedList, index)
      setSelectedList([...newSelectedList])
    }

    handleSaveBtnClick()
  }

  const handleEditItemClick = ({ id, compDefaultData }) => {
    if (id !== activeCompId) {
      const matchComp = find(selectedList, { id })
      matchComp.data = matchComp.data || compDefaultData
      propFormIns = createForm()
      propFormIns.setValues(_.cloneDeep(matchComp.data), 'overwrite')
      // return this.setState() before
      SetActiveCompId(id)
      setSelectedList([...selectedList])
    }
  }

  const handleDrop = ({ index, name }) => {
    const id = v4()
    setSelectedList([...(selectedList.splice(index, 0, { name, id }))])
    handleSaveBtnClick()
  }

  const onReceiveMessage = e => {
    try {
      if (e.data.toString() !== '[object Object]') {
        const data = JSON.parse(e.data)
        switch (data.func) {
          case 'handleDrop':
            handleDrop(data.params)
            break;
          case 'handleEditItemClick':
            handleEditItemClick(data.params)
            break;
          case 'handleOperateItem':
            handleOperateItem(data.params)
            break;
          default:
            break
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ai识别结果同步
  const handleNodePost = async dataList => {
    setSelectedList([...dataList])
    handleSaveBtnClick([...dataList])
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
          <Button type="primary" onClick={handleSaveBtnClick}>
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
        <div className={styles.title}>ai识别</div>
        <NocodePost handleNodePost={handleNodePost} />
        <div className={styles.title}>组件库</div>
        <div className={styles.comp}>
          <p className={styles['comp-title']}>基础组件</p>
          <Drag
            data={dragList}
            renderChild={({ title, icon }) => (
              <div className={styles['comp-item']}>
                {icon}
                <span>{title}</span>
              </div>
            )}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          />
        </div>

        <div>
          <div className={styles.title}>JSON Schema</div>
          <pre className={styles.listBody}>
            <div dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(selectedList, null, 2)) }} ></div>
          </pre>
        </div>

      </div>
      <div className={styles.center}>
        <Select
          className={styles.deviceSelect}
          value={selectedDevice}
          style={{ width: 150 }}
          onChange={handleDeviceChange}
        >
          {map(deviceList, ({ title, value }) => (
            <Option key={value} value={value}>
              {title}
            </Option>
          ))}
        </Select>

        <Devices deviceName={selectedDevice}>
          <Iframe
            attributes={{
              src: '/visual-page/checked-comp',
              width: '100%',
              height: '100%',
              frameBorder: 0,
            }}
            postMessageData={{ selectedList, showDrop, activeCompId }}
            handleReceiveMessage={onReceiveMessage}
          />
        </Devices>
      </div>
      <div className={styles.right}>
        <div className={styles.title}>
          <span>属性设置</span>
          {activeComp.id && (
            <Button type="primary" onClick={handleApplySetting}>
              应用
            </Button>
          )}
        </div>
        <div className={styles.content}>
          <CompPropSetting
            schema={activeCompSchema}
            key={activeCompId}
            id={activeCompId}
            propFormIns={propFormIns}
          />
        </div>
      </div>
    </div>
  )

}
