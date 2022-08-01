import { useState, useEffect } from 'react'
import { Alert } from 'antd'
// import * as VisualDesignComponents from 'react-visual-design-components'
import * as VisualDesignComponents from '@/mobile_components'
import { map, isEmpty } from 'lodash'
import { Drop, Icon } from '@/components'

import styles from './checked-comp.less'

export default () => {

  const [selectedList, setSelectedList] = useState([])
  const [showDrop, setShowDrop] = useState(false)
  const [activeCompId, setActiveCompId] = useState('')


  useEffect(() => {
    const eventListener = e => {
      const data = JSON.parse(e.data)
      setSelectedList(data.selectedList)
      setShowDrop(data.showDrop)
      setActiveCompId(data.activeCompId)
    }
    window.addEventListener('message', eventListener)

    return () => {
      window.removeEventListener('message', eventListener)
    }
  }, [])

  const handleEditItemClick = (id, comp) => {
    window.parent.postMessage(
      JSON.stringify({
        func: 'handleEditItemClick',
        params: { id, compDefaultData: comp.defaultProps.data },
      }),
      '*',
    )
  }

  const handleOperateItem = ({ type, index }, e) => {
    e.stopPropagation()
    window.parent.postMessage(
      JSON.stringify({ func: 'handleOperateItem', params: { type, index } }),
      '*',
    )
  }

  const handleDrop = (index, { name }) => {
    window.parent.postMessage(JSON.stringify({ func: 'handleDrop', params: { index, name } }), '*')
  }

  return (
    <>
      {map(selectedList, ({ name, id, data }, index) => {
        const Comp = VisualDesignComponents[name]
        const showUp = index > 0
        const showDown = index < selectedList.length - 1 && selectedList.length > 1
        if (Comp) {
          return (
            <div
              className={`${styles['comp-wrap']} ${id === activeCompId ? styles['comp-wrap-active'] : ''
                }`}
              key={id}
              tabIndex="0"
            >
              <Drop show={showDrop} handleDrop={(e) => { handleDrop(index, { ...e }) }} />
              <div className={styles['operate-wrap']}>
                <Icon
                  className={styles['operate-item']}
                  type="edit"
                  size={24}
                  onClick={() => { handleEditItemClick(id, Comp) }}
                />
                <Icon
                  className={styles['operate-item']}
                  type="delete"
                  size={24}
                  onClick={e => { handleOperateItem({ type: 'delete', index }, e) }}
                />
                {showUp && (
                  <Icon
                    className={styles['operate-item']}
                    type="up"
                    size={24}
                    onClick={e => { handleOperateItem({ type: 'up', index }, e) }}
                  />
                )}
                {showDown && (
                  <Icon
                    className={styles['operate-item']}
                    type="down"
                    size={24}
                    onClick={e => { handleOperateItem({ type: 'down', index }, e) }}
                  />
                )}
              </div>
              <Comp data={data} />
            </div>
          )
        }
        return (
          <div key={`${index}-null`} className={styles['null-comp']}>
            该组件不存在
          </div>
        )
      })}
      <Drop show={showDrop} handleDrop={(e) => { handleDrop(selectedList.length, { ...e }) }} />
      {isEmpty(selectedList) && <Alert message="请从左侧选择组件拖动到手机区域" type="info" />}
    </>
  )

}
