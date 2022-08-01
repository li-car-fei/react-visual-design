import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { WhiteSpace } from 'antd-mobile'

import propSchema from './config/schema.json'
import defaultData from './config/data.json'

export default class NewWhiteSpace extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'WhiteSpace',
    id: 'WhiteSpace',
    title: '留白',
    iconName: 'StarOutlined',
  }

  static propSchema = propSchema

  render() {
    const { data } = this.props
    return (
      <div>
        <WhiteSpace style={{ backgroundColor: data.backgroundColor }} size={data.size} />
      </div>
    )
  }
}
