import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { NavBar, Icon } from 'antd-mobile'

import propSchema from './config/schema.json'
import defaultData from './config/data.json'

export default class NewNavBar extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'NavBar',
    id: 'NavBar',
    title: '导航栏',
    iconName: 'StarOutlined',
  }

  static propSchema = propSchema

  render() {
    const { data } = this.props
    return (
      <NavBar
        mode={data.mode}
        icon={<Icon type="left" />}
        onLeftClick={() => console.log('onLeftClick')}
      >
        {data.title}
      </NavBar>
    )
  }
}
