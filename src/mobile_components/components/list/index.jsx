import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import { List } from 'antd-mobile'
import propSchema from './config/schema.json'
import defaultData from './config/data.json'


export default class MyList extends PureComponent {
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
        name: 'List',
        id: 'list',
        title: '列表',
        iconName: ''
    }
    // 类静态属性
    static propSchema = propSchema

    render() {
        const { array, header } = this.props.data
        return (
            <div>
                <List header={header}>
                    {
                        array.map(({ content, description, title, clickable }, i) => (
                            <List.Item key={i} description={description} title={title} clickable={clickable.toString()}>
                                {content}
                            </List.Item>
                        ))
                    }
                </List>
            </div>
        )
    }
}
