import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Button, Modal } from 'antd';
import { getDefault, jsonParse, getBtnBg } from '../../util/util';
import { getRes, base } from '../../../config.js';
import { defaultObj } from '../../util/constant';
import './FormContent.css';

const FormItem = Form.Item;
const { TextArea } = Input;
class FormContent extends React.Component {
  static propTypes = {
    formData: PropTypes.array.isRequired, // 表单数据
    body: PropTypes.object, // body
    path: PropTypes.string.isRequired, // 目标路径
    type: PropTypes.string.isRequired, // 方法类型
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      response: {}, //返回结果
    };
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  defaultValue(body) {
    if (body === null) {
      return defaultObj;
    }
    const { fieldList } = body;
    var obj = {};
    fieldList &&
      fieldList.forEach(item => (obj[item.name] = getDefault(item.defaultValue, item.type)));
    return jsonParse(obj);
  }

  async handleSubmit(e) {
    const { type, path } = this.props;
    e.preventDefault();
    var body = {};
    var param = '';
    var url = '';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.keys(values).forEach(item => {
          if (/^{\(.|\n\)*}$/g.test(values[item])) {
            body = JSON.parse(values[item]);
          } else if (values[item] !== undefined && values[item] !== '') {
            param += `${item}=${values[item]}&`;
          }
        });
        url = base + path + (param ? '?' : '' ) + param.substring(0, param.length - 1);
      }
    });
    try {
      const res = await getRes(url, type, JSON.stringify(body));
      this.setState({ response: res || {} });
    } catch (e) {
      console.log('压力测试', e);
    }
  }

  render() {
    const { formData, body, type } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        {formData &&
          formData.map((item, index) => (
            <Row key={`row-${index}`} className="subPanelDetail" type="flex" align="top">
              <Col span={12}>
                <span>{item.name}</span>
                <span className={item.required ? 'required' : 'notShow'}>*required</span>
                <div className="paramType">{item.type}</div>
              </Col>
              <Col span={8}>
                <p>{item.description}</p>
                {item.type === 'Object' ? (
                  <FormItem>
                    {getFieldDecorator(item.name, {
                      initialValue: this.defaultValue(body),
                    })(<TextArea rows={4} className="formBody" />)}
                  </FormItem>
                ) : (
                  <FormItem>
                    {getFieldDecorator(item.name, {
                      initialValue: item.defaultValue,
                    })(<Input size="large" />)}
                  </FormItem>
                )}
              </Col>
            </Row>
          ))}
        <FormItem>
          <Button
            type="primary"
            className="excute"
            htmlType="submit"
            style={{ background: getBtnBg(type), border: 'none' }}
            block
            onClick={this.showModal}
          >
            运行
          </Button>
        </FormItem>
        <Modal
          title="Result"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <pre className="bodyContent">{jsonParse(this.state.response || {})}</pre>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(FormContent);
