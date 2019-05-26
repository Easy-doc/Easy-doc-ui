/* eslint-disable no-script-url */
import React from 'react';
import { Form, Input, Button, message, Table, Divider } from 'antd';
import './Global.css'

/** 设置全局参数*/
class Global extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const str = localStorage.getItem('globalParam') || '[]'
    this.setState({ data: JSON.parse(str) })
  }

  addParams(e) {
    e.preventDefault();
    const { data } = this.state
    let isKey = true
    this.props.form.validateFields((err, values) => {
      if (!err) {
        data.forEach(item => {
          if (item.key === values.key) {
            message.warning('key不能重复')
            isKey = false
          }
        })
        if (isKey) {
          data.push(values)
          localStorage.setItem('globalParam', JSON.stringify(data))
          this.setState({ data })
        }
      }
    });
  }

  deleteParams(text) {
    const { key, value } = text
    const { data } = this.state
    const temp = data.filter(item => (item.key !== key) && (item.value !== value))
    this.setState({ data: temp })
    localStorage.setItem('globalParam', JSON.stringify(temp))
    
  }

  render() {
    const { data } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <div className="addInput">
        <div>
        <Form layout="inline" onSubmit={this.addParams.bind(this)}>
        <Form.Item >
          {getFieldDecorator('key', {
            rules: [{ required: true, message: '请输入key!' }],
          })(<Input placeholder="key" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('value', {
            rules: [{ required: true, message: '请输入value!' }],
          })(<Input placeholder="value" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </Form.Item>
      </Form>
        </div>
        <br />
        <Table dataSource={data}>
          <Table.Column title="key" dataIndex="key" />
          <Table.Column title="value" dataIndex="value" />
          <Table.Column title="操作"
          render={(text, record) => (
            <span>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.deleteParams(text)}>删除</a>
            </span>
          )}
          />
        </Table>
      </div>
    );
  }
}

export default Form.create()(Global);
