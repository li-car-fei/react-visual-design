import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd-mobile'
import propSchema from './config/schema.json'
import defaultData from './config/data.json'
import './index.less'


export default class NewCard extends PureComponent {
    // 验证父组件传进来的值的合法性
    static propTypes = {
        data: PropTypes.object,
    }

    // 父组件没有传值的话，子组件使用的defaultProps里定义的默认值
    static defaultProps = {
        data: defaultData,
    }

    // 类静态属性
    static compAttr = {
        name: 'Card',
        id: 'card',
        title: '卡片',
        iconName: 'HddOutlined'
    }
    // 类静态属性
    static propSchema = propSchema

    render() {
        const { title, content } = this.props.data
        return (
            <div className='visual-design-card' >
                <Card title={title}>
                    {content}
                </Card>
            </div>
        )
    }
}
