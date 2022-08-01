import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Carousel } from 'antd-mobile'
import propSchema from './config/schema.json'
import defaultData from './config/data.json'
import './index.less'
import { carouselDefaultImg } from '../../util/img'

export default class NewCarousel extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'Carousel',
    id: 'Carousel',
    title: '轮播',
    iconName: 'SwapOutlined',
  }

  static propSchema = propSchema

  state = {
    imgHeight: 240,
  }

  render() {
    const { array } = this.props.data
    const { imgHeight } = this.state
    return (
      <Carousel autoplay infinite className="visual-design-carousel">
        {array.map((item, index) => (
          <a
            key={index}
            href={item.href}
            style={{
              display: 'inline-block',
              width: '100%',
              height: imgHeight,
            }}
          >
            <img
              src={item.src || carouselDefaultImg}
              style={{ width: '100%' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }
}
