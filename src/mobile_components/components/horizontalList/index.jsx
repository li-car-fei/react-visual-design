import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import propSchema from './config/schema.json'
import defaultData from './config/data.json'
import { defaultImg } from '../../util/img'

import './index.less'

export default class HorizontalList extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'HorizontalList',
    id: 'HorizontalList',
    title: '水平列表',
    iconName: 'StarOutlined',
  }

  static propSchema = propSchema

  render() {
    const { array } = this.props.data
    return (
      <div className="visual-design-horizontal-list">
        {array.map((item, index) => (
          <div key={index} className="item">
            <a href={item.link}>
              <img src={item.src || defaultImg} />
            </a>
            <span>{item.text}</span>
          </div>
        ))}
        <div className="place-holder" />
      </div>
    )
  }
}
