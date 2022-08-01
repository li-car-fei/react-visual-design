import React, { useCallback } from 'react'
import { Button, message } from 'antd'
import styles from './index.less'
import { FormTable, FormDialog } from '@/components'

import { tableSearchSchema, createTableColumns, modalSchema } from './_config'
// import { addVisualPage, visualPagePaging } from '@/service'
import { addVisualPage, visualPagePaging } from '@/local_service'

export default () => {
  const formTableEl = React.createRef()

  const onsubmit = useCallback(
    async values => {
      await addVisualPage(values)
      formTableEl.current.reset()
      message.success('新增成功')
    },
    [formTableEl],
  )

  return (
    <div className={styles.page}>
      <FormTable
        rowKey="id"
        onRef={formTableEl}
        columns={createTableColumns(formTableEl)}
        fetchTableData={visualPagePaging}
        schema={tableSearchSchema}
        headBtnGroup={
          <Button
            type="primary"
            onClick={() => {
              FormDialog({ schema: modalSchema, title: '新增页面' })
                .forOpen((_, next) => {
                  next({
                    initialValues: {},
                  })
                })
                .forConfirm((payload, next) => {
                  onsubmit(payload.values)
                  next(payload)
                })
                .open()
            }}
          >
            新增页面
          </Button>
        }
      />
    </div>
  )
}
