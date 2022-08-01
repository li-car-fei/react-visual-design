## 热点图

Demo:

```jsx
import React, { Component } from 'react'
import { ImageArea } from 'react-visual-design-components'

export default class ImageAreaDemo extends Component {
  state = {
    coordinates: [
      {
        x: 178,
        y: 91,
        width: 158,
        height: 132,
        id: 'SJxb6YpuG',
        href: 'https://www.baidu.com/',
      },
      {
        x: 436,
        y: 97,
        width: 170,
        height: 168,
        id: 'SJMZ6YTdf',
        href: 'https://www.baidu.com/',
      },
    ],
  }

  render() {
    const { coordinates } = this.state
    return <ImageArea coordinates={coordinates} updateCoordinate={this.updateCoordinate} />
  }
}
```
