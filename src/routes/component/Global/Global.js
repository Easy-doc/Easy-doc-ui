import React from 'react';
import { Form, Input, Button, Row, Col, Icon, message, Tooltip } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
/** 设置全局参数*/
class Global extends React.Component {
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
    this.initailGlobal();
  }

  async handleAuthorize(e) {
    e.preventDefault();
    let urlParams = '';
    let len = 0;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        len = Object.keys(values).length;
        len = Math.floor(len / 2);
        for (let i = 0; i < len; i++) {
          urlParams += values[`globalKey${i}`] + '=' + values[`globalValue${i}`] + '&';
        }
        localStorage.setItem('globalParam', urlParams.replace(/&$/g, ''));
        message.info('添加完成');
      }
    });
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
        {getFieldDecorator(`globalKey${num}`)(
          <Col span={12}>
            <Input placeholder="key" />
          </Col>
        )}
        {getFieldDecorator(`globalValue${num}`)(
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

  initailGlobal() {
    const { getFieldDecorator } = this.props.form;
    let temp = [];
    temp.push(
      <Row gutter={16} key={`row-0`}>
        {getFieldDecorator(`globalKey0`)(
          <Col span={12}>
            <Input placeholder="key" />
          </Col>
        )}
        {getFieldDecorator(`globalValue0`)(
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
              <Button 
                type="primary" 
                block htmlType="submit" 
                className="pressureBtn">
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
    const { children } = this.state;
    return (
      <Form onSubmit={this.handleAuthorize.bind(this)}>
        <FormItem label="全局参数" {...formItemLayout}>
          {children && children.map(item => item)}
          {this.renderButton()}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(Global);
