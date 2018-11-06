import React from 'react';
import { Form, Input, Button, message, Row, Col, Icon } from 'antd';
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
    let obj = {};
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.keys(values).forEach((item, index) => {
              if (item === 'token') {
                localStorage.setItem(item, values[item]);
              } else  if ((/^cookieKey*/g).test(item)) {
                obj[values[item]] = values[`cookieValue${index}`];
            }
        });
      }
    });
    var res = await addCookie(JSON.stringify(obj));
    if (res && res.success === true) {
      message.info('添加成功');
    } else {
      message.info(res.message);
    }
  }

  handleDelete = () => {
    const { num } = this.state;
  }

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
            <span className="delete" onClick={this.handleDelete.bind(this)}><Icon type="close-circle" theme="outlined" /></span>
          </Col>
        )}
      </Row>
    );
  }

  initailCookie(arg) {
    const { getFieldDecorator } = this.props.form;
    let { num } = this.state;
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
            <Col span={12} style={{ position: 'relative'}}>
              <Input placeholder="value" />
              <span className="delete" onClick={this.handleDelete.bind(this)}>
              <Icon type="close-circle" theme="outlined" /></span>
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
          {this.initailCookie()}
          <Row gutter={16}>
            <Col span={12}>
              <Button 
              type="primary" 
              block 
              htmlType="submit" 
              className="pressureBtn">
            完成
          </Button>
          </Col>
          <Col span={12}>
          <Button
            className="pressureBtn"
            block
            type="defalut" 
            onClick={this.handleClick.bind(this)}>
            继续添加
          </Button>
          </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Authorize);
