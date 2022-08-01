## Iframe

Demo:

```jsx
import React from 'react'
import { Iframe } from 'react-visual-design-components'
export default () => (
  <Iframe
    attributes={{ src: 'https://www.baidu.com/' }}
    postMessageData={{ name: 'kokiy' }}
    handleReceiveMessage={console.log}
  />
)
```
