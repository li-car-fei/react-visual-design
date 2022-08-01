import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { watermark } from './waterMark'

function WaterMark({ style, children, ...options }) {
  const containerEl = useRef(null)

  useEffect(() => {
    watermark({
      container: containerEl.current,
      ...options,
    })
  }, [options])
  return (
    <div
      ref={containerEl}
      style={{
        ...style,
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

WaterMark.propTypes = {
  style: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

export default WaterMark
