import { Button, Modal, message } from 'antd'
import { Link } from 'umi'
import { FormDialog } from '@/components'
// import {
//   geVisualPageById,
//   updateVisualPage,
//   deleteVisualPage,
// } from '@/service'

import {
  geVisualPageById,
  updateVisualPage,
  deleteVisualPage,
} from '@/local_service'
import { v4 } from 'uuid'



export const modalSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      required: true,
      maxLength: 20,
      triggerType: 'onBlur',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入图名称',
      },
    },
    description: {
      type: 'string',
      title: '描述',
      maxLength: 200,
      triggerType: 'onBlur',
      'x-decorator': 'FormItem',
      'x-component': 'TextArea',
      'x-component-props': {
        placeholder: '请输入图描述',
      },
    },
  },
}

export const createTableColumns = (formTableEl) => {

  const onsubmit = async (values) => {
    await updateVisualPage(values)
    formTableEl.current.reset()
    message.success('编辑成功')
  }

  return [
    {
      title: '编号',
      dataIndex: 'id',
      width: '5%',
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: '15%',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: '15%',
    },

    {
      title: '操作',
      width: '20%',
      dataIndex: 'id',
      render: id => (
        <>
          <Button
            type="link"
            size="small"
            onClick={async () => {
              const values = await geVisualPageById(id)
              FormDialog({ schema: modalSchema, title: '编辑信息' })
                .forOpen((_, next) => {
                  next({
                    initialValues: values,
                  })
                })
                .forConfirm((payload, next) => {
                  onsubmit(payload.values)
                  next(payload)
                }).open()
            }}
          >
            编辑信息
          </Button>
          <Link
            to={{
              pathname: '/visual-graph/edit',
              search: `?pageId=${id}`,
            }}
          >
            编辑图
          </Link>
          <Link
            to={{
              pathname: '/visual-graph/preview',
              search: `?pageId=${id}`,
            }}
          >
            &nbsp;预览
          </Link>
          <Button
            type="text"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                content: '你确定删除该图?',
                onOk: async () => {
                  await deleteVisualPage(id)
                  message.success('删除成功')
                  formTableEl.current.reset()
                },
              })
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ]
}

export const tableSearchSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '名称',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}




export const randomGraphData = {
  counter: 5,
  graph: {
    nodes: [
      { id: 1, label: "Node 1", color: "#e04141" },
      { id: 2, label: "Node 2", color: "#e09c41" },
      { id: 3, label: "Node 3", color: "#e0df41" },
      { id: 4, label: "Node 4", color: "#7be041" },
      { id: 5, label: "Node 5", color: "#41e0c9" }
    ],
    edges: [
      { id: v4(), from: 1, to: 2 },
      { id: v4(), from: 1, to: 3 },
      { id: v4(), from: 2, to: 4 },
      { id: v4(), from: 2, to: 5 }
    ]
  }
}

export const nodeSchema = {
  "type": "object",
  "properties": {
    "label": {
      "type": "string",
      "title": "节点名称",
      "x-component": "Input",
      "x-decorator": "FormItem",
      "x-validator": [
        {
          "required": true,
          "triggerType": "onBlur"
        }
      ]
    }
  }
}

export const randomColor = () => {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

