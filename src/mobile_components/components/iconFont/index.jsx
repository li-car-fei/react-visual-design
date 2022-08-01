import React from 'react'
import asyncLoadScript from '../../util/asyncLoadScript'

const svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false',
}

export default ({ scriptUrl, typePrefix }) => {
  asyncLoadScript(scriptUrl)
  return ({ type, ...rest }) => (
    <svg {...svgBaseProps} {...rest}>
      <use xlinkHref={`#${typePrefix}${type}`} />
    </svg>
  )
}
