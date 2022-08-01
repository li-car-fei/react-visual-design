import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import propSchema from './config/schema.json'
import defaultData from './config/data.json'
import './index.less'

export default class RichText extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'RichText',
    id: 'RichText',
    title: '富文本',
    iconName: 'StarOutlined',
  }

  static propSchema = propSchema

  render() {
    const { data } = this.props
    return (
      <div className="visual-design-rich-text" dangerouslySetInnerHTML={{ __html: data.content }} />
    )
  }
}
