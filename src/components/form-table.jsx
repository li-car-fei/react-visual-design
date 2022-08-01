import React, { useState, useEffect, useImperativeHandle } from 'react'
import { Table, Space } from 'antd'
import { Form, FormButtonGroup, FormGrid, Submit, Reset } from '@formily/antd'
import { createForm } from '@formily/core'
import { SchemaField } from './'

const formTableIns = createForm()

const initialState = {
  pageSize: 10,
  current: 1,
  total: 0,
  dataSource: [],
  filters: {},
}

export default (props) => {

  const [state, setState] = useState({ ...initialState })
  const [loading, setLoading] = useState(false)

  const { schema, columns = [], headBtnGroup, rowKey = 'id' } = props
  // const { dataSource, loading, current, pageSize, total } = state

  const getTableData = async () => {
    const { fetchTableData } = props
    const { pageSize, current, filters } = state
    setLoading(true)
    const res = await fetchTableData({
      offset: pageSize * (current - 1),
      limit: pageSize,
      ...filters,
    });
    setState({ ...state, total: res.count, dataSource: res.rows })
    setLoading(false)
  }

  const submit = filters => {
    setState({ ...state, filters, current: 1, total: 0 })
    getTableData()
  }

  const reset = () => {
    setState({ ...state, filters: {}, current: 1, total: 0 })
    getTableData()
  }

  const handleTableChange = ({ current }) => {
    setState({ ...state, current })
    getTableData()
  }

  // 需要暴漏给父组件的接口
  useImperativeHandle(props.onRef, () => {
    return {
      reset
    }
  })

  // 只在页面初始化时调用一次
  useEffect(() => {
    getTableData()
  }, [])

  return (
    <>
      <Space direction="vertical">
        <div className="table-top-placeholder">{headBtnGroup}</div>
        {schema && (
          <Form form={formTableIns} onAutoSubmit={submit}>
            <FormGrid minColumns={1} maxColumns={4}>
              <SchemaField schema={schema} />
              <FormButtonGroup.FormItem>
                <Submit>查询</Submit>
                <Reset onClick={reset}>重置</Reset>
              </FormButtonGroup.FormItem>
            </FormGrid>
          </Form>
        )}
        <Table
          columns={columns}
          rowKey={rowKey}
          loading={loading}
          dataSource={[...state.dataSource]}
          pagination={{ current: state.current, pageSize: state.pageSize, total: state.total }}
          onChange={handleTableChange}
        />
      </Space>
    </>
  )

}
