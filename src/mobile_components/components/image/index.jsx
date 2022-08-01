import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './index.less'
import propSchema from './config/schema.json'
import defaultData from './config/data.json'
import { defaultImg } from '../../util/img'

export default class Image extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'Image',
    id: 'Image',
    title: '图片',
    iconName: 'PictureOutlined',
  }

  static propSchema = propSchema

  render() {
    const {
      data: { link, src },
    } = this.props
    return (
      <a className="visual-design-img" href={link}>
        <img className="img" src={src || defaultImg} />
      </a>
    )
  }
}
