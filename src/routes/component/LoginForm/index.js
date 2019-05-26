import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, message } from 'antd';
import { getMethod } from '../../../config.js';

class LoginForm extends React.Component {

    static propTypes = {
        hiddenModal: PropTypes.func.isRequired,
    };

    async handleLoginSubmit(e) {
      const { hiddenModal } = this.props
      e.preventDefault();
      let isValid = false
      let loginValue = {}
      this.props.form.validateFields((err, values) => {
        if (!err) {
          isValid = true
          loginValue = values
        }
      });
      if (isValid) {
        const resp = await getMethod(loginValue, true)
        if (resp && resp.code === 0) {
          hiddenModal(false)
          localStorage.setItem('account', loginValue.account)
          localStorage.setItem('password', loginValue.password)
          window.location.reload()
          return true
        } else {
          message.error((resp && resp.msg) || '登录失败');
        }
     }
    }

    render() {
    const { getFieldDecorator } = this.props.form; 
    return (
    <Form onSubmit={this.handleLoginSubmit.bind(this)} className="loginForm">
    <Form.Item>
      {getFieldDecorator('account', {
        rules: [{ required: true, message: '请输入账号!' }],
      })(
        <Input
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="账号"
        />,
      )}
    </Form.Item>
    <Form.Item>
    {getFieldDecorator('password', {
      rules: [{ required: true, message: '请输入密码!' }],
    })(
      <Input
        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
        placeholder="密码"
      />,
    )}
  </Form.Item>
  <Form.Item>
  <Button type="primary" htmlType="submit" className="login-form-button">
    确定
  </Button>
  </Form.Item>
    </Form>
    )
    }
} 

export default Form.create()(LoginForm)