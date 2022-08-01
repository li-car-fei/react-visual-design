import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NoticeBar } from 'antd-mobile'

import propSchema from './config/schema.json'
import defaultData from './config/data.json'

export default class NewNoticeBar extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'NoticeBar',
    id: 'NoticeBar',
    title: '通知栏',
    iconName: 'StarOutlined',
  }

  static propSchema = propSchema

  render() {
    const { data } = this.props
    return (
      <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
        {data.content}
      </NoticeBar>
    )
  }
}
