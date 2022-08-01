import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'antd-mobile'
import propSchema from './config/schema.json'
import defaultData from './config/data.json'
import './index.less'

export default class NewAccordion extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: defaultData,
  }

  static compAttr = {
    name: 'Accordion',
    id: 'accordion',
    title: '手风琴',
    iconName: 'OrderedListOutlined',
  }

  static propSchema = propSchema

  render() {
    const { array } = this.props.data
    return (
      <div className="visual-design-accordion">
        {array.map(({ title, content }, i) => (
          <Accordion key={i}>
            <Accordion.Panel header={title} className="pad">
              {content}
            </Accordion.Panel>
          </Accordion>
        ))}
      </div>
    )
  }
}
