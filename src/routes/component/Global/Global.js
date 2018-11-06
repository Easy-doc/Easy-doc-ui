import React from 'react';
import { Form, Input, Button, Row, Col, Icon } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const children = [];
let time = 0;
class Global extends React.Component {
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
    let urlParams = ''
    this.props.form.validateFields((err, values) => {
      if (!err) {
          console.log('val', values)
        Object.keys(values).forEach((item, index) => {
            if ((/^globalKey*/g).test(item)) {
                urlParams += values[item] + '=' + values[`globalValue${index}`] + '&';
            }
        });
        console.log('dadada', urlParams)
      }
    });
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
        {getFieldDecorator(`globalKey${num}`)(
          <Col span={12}>
            <Input placeholder="key" />
          </Col>
        )}
        {getFieldDecorator(`globalValue${num}`)(
          <Col span={12}>
            <Input placeholder="value" />
            <span className="delete" onClick={this.handleDelete.bind(this)}><Icon type="close-circle" theme="outlined" /></span>
          </Col>
        )}
      </Row>
    );
  }

  initailGlobal() {
    const { getFieldDecorator } = this.props.form;
    let { num } = this.state;
    time++;
    if (time === 1) {
      children.push(
        <Row gutter={16} key={`row-${num}`}>
          {getFieldDecorator(`globalKey${num}`)(
            <Col span={12}>
              <Input placeholder="key" />
            </Col>
          )}
          {getFieldDecorator(`globalValue${num}`)(
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
    return (
      <Form onSubmit={this.handleAuthorize.bind(this)}>
        <FormItem label="全局参数" {...formItemLayout}>
          {this.initailGlobal()}
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

export default Form.create()(Global);
