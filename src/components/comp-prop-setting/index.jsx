import { isEmpty } from 'lodash'
import { Alert } from 'antd'

import { Form, FormLayout } from '@formily/antd'
import { SchemaField } from '../'

export default props => {
  const { id, schema, propFormIns } = props
  if (isEmpty(id) && !(id)) {
    return <Alert message="请点击设置属性" type="info" />
  }
  if (isEmpty(schema)) {
    return <Alert message="请点击编辑或该点击无设置属性" type="warning" />
  }

  return (
    <Form form={propFormIns}>
      <FormLayout labelCol={6} wrapperCol={16}>
        <SchemaField schema={schema} />
      </FormLayout>
    </Form>
  )
}
