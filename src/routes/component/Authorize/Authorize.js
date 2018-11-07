import React from 'react';
import { Form, Input, Button, message, Row, Col, Icon, Tooltip } from 'antd';
import { addCookie } from '../../../config';
import './Authorize.css';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
/** 
 * Authorize 设置cookie和token
*/
class Authorize extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      num: 1,
      key: value.key,
      value: value.value,
      children: [],
    };
  }

  componentDidMount() {
    this.initailCookie();
  }

  async handleAuthorize(e) {
    e.preventDefault();
    let obj = {};
    let len = 0;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values['token'] !== undefined) {
          localStorage.setItem('token', values['token']);
        }
        len = Math.floor((Object.keys(values).length - 1) / 2);
        for (let i = 0; i < len; i++) {
          obj[`${values[`cookieKey${i}`]}`] = values[`cookieValue${i}`];
        }
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
    let { num, children } = this.state;
    children.splice(num - 1, 1);
    this.setState({ children: children, num: --num });
  };

  handleClick() {
    const { getFieldDecorator } = this.props.form;
    let { num, children } = this.state;
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
            <span className="delete" onClick={this.handleDelete.bind(this)}>
              <Icon type="close-circle" theme="outlined" />
            </span>
          </Col>
        )}
      </Row>
    );
    this.setState({ children: children, num: ++num });
  }

  initailCookie() {
    const { getFieldDecorator } = this.props.form;
    let temp = [];
    temp.push(
      <Row gutter={16} key={`row-0`}>
        {getFieldDecorator(`cookieKey0`)(
          <Col span={12}>
            <Input placeholder="key" />
          </Col>
        )}
        {getFieldDecorator(`cookieValue0`)(
          <Col span={12} style={{ position: 'relative' }}>
            <Input placeholder="value" />
          </Col>
        )}
      </Row>
    );
    this.setState({ children: temp });
  }

  renderButton() {
    return (
      <Row gutter={16}>
            <Col span={12}>
            <Tooltip placement="topLeft" title="需要修改或删除的操作，在表单内修改后点击完成按钮完成">
              <Button type="primary" block htmlType="submit" className="pressureBtn">
                完成
              </Button>
            </Tooltip>
            </Col>
            <Col span={12}>
              <Button
                className="pressureBtn"
                block
                type="defalut"
                onClick={this.handleClick.bind(this)}
              >
                继续添加
              </Button>
            </Col>
      </Row>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children } = this.state;
    return (
      <Form onSubmit={this.handleAuthorize.bind(this)}>
        <FormItem label="Token" {...formItemLayout}>
          {getFieldDecorator('token')(<TextArea row={6} />)}
        </FormItem>
        <FormItem label="Cookie" {...formItemLayout}>
          {children && children.map(item => item)}
          {this.renderButton()}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Authorize);
