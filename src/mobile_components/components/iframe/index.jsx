import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

const serializePostMessageData = data => {
  if (typeof data === 'object') {
    return JSON.stringify(data)
  }
  if (typeof data === 'string') {
    return data
  }
  return `${data}`
}

const defaultAttributes = {
  allowFullScreen: false,
  frameBorder: 0,
}

class Iframe extends Component {
  frameRef = createRef()

  componentDidMount() {
    window.addEventListener('message', this.onReceiveMessage)
    this.frameRef.current.addEventListener('load', this.onLoad)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onReceiveMessage)
  }

  componentDidUpdate(prevProps) {
    if (this.props.postMessageData !== prevProps.postMessageData) {
      this.sendMessage(this.props.postMessageData)
    }
  }

  onReceiveMessage = event => {
    const { handleReceiveMessage } = this.props
    if (handleReceiveMessage) {
      handleReceiveMessage(event)
    }
  }

  onLoad = () => {
    const { handleReady } = this.props
    if (handleReady) {
      handleReady()
    }
    this.sendMessage(this.props.postMessageData)
  }

  sendMessage = postMessageData => {
    const { targetOrigin } = this.props
    const serializedData = serializePostMessageData(postMessageData)
    this.frameRef.current.contentWindow.postMessage(serializedData, targetOrigin)
  }

  render() {
    const { attributes } = this.props
    const mergedAttributes = { ...defaultAttributes, ...attributes }
    return <iframe ref={this.frameRef} {...mergedAttributes} />
  }
}

Iframe.defaultProps = {
  serializeMessage: true,
  targetOrigin: '*',
  postMessageData: '',
}

Iframe.propTypes = {
  attributes: PropTypes.shape({
    allowFullScreen: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    frameBorder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    src: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  handleReceiveMessage: PropTypes.func,
  handleReady: PropTypes.func,
  postMessageData: PropTypes.any.isRequired,
  targetOrigin: PropTypes.string,
}

export default Iframe
