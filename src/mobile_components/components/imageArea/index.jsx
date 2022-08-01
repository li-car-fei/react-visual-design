import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import { v4 } from 'uuid'
import propSchema from './config/schema.json'
import './index.less'
import { defaultImg } from '../../util/img'
import defaultData from './config/data.json'

export default class ImageArea extends Component {
  static propTypes = {
    data: PropTypes.object,
    imgSrc: PropTypes.string,
  }

  static defaultProps = {
    data: defaultData,
    imgSrc: '',
  }

  static compAttr = {
    name: 'ImageArea',
    id: 'ImageArea',
    title: '热点图',
    iconName: 'PictureOutlined',
  }

  static propSchema = propSchema

  imgmapName = v4()

  imgRef = createRef(null)

  state = {
    imgWidthZoomRadio: null,
    imgHeightZoomRadio: null,
  }

  componentDidMount() {
    this.imgRef.current.onload = () => {
      this.setState({
        imgWidthZoomRadio: +(this.imgRef.current.width / this.imgRef.current.naturalWidth).toFixed(
          2,
        ),
        imgHeightZoomRadio: +(
          this.imgRef.current.height / this.imgRef.current.naturalHeight
        ).toFixed(2),
      })
    }
  }

  render() {
    const {
      data: { src, coordinates },
    } = this.props
    const { imgWidthZoomRadio, imgHeightZoomRadio } = this.state
    return (
      <div className="visual-design-img-area-container">
        <img
          className="img"
          src={src || defaultImg}
          alt=""
          ref={this.imgRef}
          draggable={false}
          useMap={`#${this.imgmapName}`}
        />
        {imgWidthZoomRadio && imgHeightZoomRadio && (
          <map name={this.imgmapName}>
            {coordinates.map(({ x, y, width, height, id, href }) => {
              const realX = Number((x * imgWidthZoomRadio).toFixed(2))
              const realY = Number((y * imgHeightZoomRadio).toFixed(2))
              const realWidth = realX + Number((width * imgWidthZoomRadio).toFixed(2))
              const realHeight = realY + Number((height * imgHeightZoomRadio).toFixed(2))
              return (
                <area
                  key={id}
                  shape="rect"
                  coords={`${realX},${realY},${realWidth},${realHeight}`}
                  href={href}
                  target="__blank"
                />
              )
            })}
          </map>
        )}
      </div>
    )
  }
}
