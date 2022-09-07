import React from 'react';
import { componentRender } from './config'
import { map } from 'lodash'

function Render(props: any) {

  // 由于mobile_component已经写死，因此不能嵌套render，只能先试着按照数组一轮遍历
  const components = componentRender(props.body, props.data, props.callback)

  return (
    (typeof components === 'string') ? (
    <span dangerouslySetInnerHTML={{ __html: components }} />
    ) : (
        map(components, (item, index) => {
          if(item.Comp === 'none_comp'){
            return (<div key={ `index-null` } style={{ 'padding': '12px 0', 'textAlign': 'center', 'background': 'lightgray' }}>
                      该组件不存在: { item.data}
                    </div>)
          }
          const Comp = item.Comp;
          return (<Comp data={item.data} key={ `index-${ index}` }></Comp>)
  
      })
    )
  )
}

export default Render;
