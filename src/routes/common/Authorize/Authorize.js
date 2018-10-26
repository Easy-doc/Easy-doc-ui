import React from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { addCookie } from '../../../config';
import './Authorize.css';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const children = [];
let time = 0;
class Authorize extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      num: 1,
      key: value.key,
      value: value.value,
    };
  }

  async handleAuthorize(e) {
    e.preventDefault();
    let arr = [];
    let obj = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.keys(values).forEach(item => {
          if (values[item] !== undefined) {
            if (item === 'cookieKey1' || item === 'cookieValue1') {
              arr.push(values[item]);
            } else if (item === 'token') {
              localStorage.setItem(item, values[item]);
            }
          }
        });
        if (arr && arr.length !== 0) {
          obj[arr[0]] = arr[1];
          obj = JSON.stringify(obj);
          localStorage.setItem('cookie', obj);
        }
        message.info('添加成功');
      }
    });
    var res = await addCookie(JSON.parse(obj));
    console.log(res);
  }

  handleChange = e => {
    const key = e.target.value || '';
    if (!('value' in this.props)) {
      this.setState({ key: key });
    }
    console.log('keyahahha', this.state.key);
    this.triggerChange({ key });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    console.log('onChange', this.props);
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  handleClick() {
    const { getFieldDecorator } = this.props.form;
    let { num } = this.state;
    this.setState({ num: ++num });
    children.push(
      <Row gutter={16} key={`row-${num}`}>
        {getFieldDecorator(`cookieKey${num}`)(
          <Col span={12}>
            <Input placeholder="key" />
          </Col>
        )}
        {getFieldDecorator(`cookieValue${num}`)(
          <Col span={12}>
            <Input placeholder="value" />
          </Col>
        )}
      </Row>
    );
  }

  initailCookie() {
    const { getFieldDecorator } = this.props.form;
    let { num, key, value } = this.state;
    time++;
    if (time === 1) {
      children.push(
        <Row gutter={16} key={`row-${num}`}>
          {getFieldDecorator(`cookieKey${num}`)(
            <Col span={12}>
              <Input placeholder="key" />
            </Col>
          )}
          {getFieldDecorator(`cookieValue${num}`)(
            <Col span={12}>
              <Input placeholder="value" />
            </Col>
          )}
        </Row>
      );
    }
    return children;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleAuthorize.bind(this)}>
        <FormItem label="Token" {...formItemLayout}>
          {getFieldDecorator('token')(<TextArea row={6} />)}
        </FormItem>
        <FormItem label="Cookie" {...formItemLayout}>
          <Button type="defalut" className="addBtn" onClick={this.handleClick.bind(this)}>
            Add
          </Button>
          {this.initailCookie()}
          <Button type="primary" block htmlType="submit" className="pressureBtn">
            完成
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Authorize);
