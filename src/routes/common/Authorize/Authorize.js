import React from 'react';
import {Form, Input, Button, message} from 'antd'; 

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: { span: 8},
    wrapperCol: { span: 8 },
  };
class Authorize extends React.Component {

    handleAuthorize(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if(!err) {
            Object.keys(values).forEach(item => {
                if(values[item] !== undefined) {
                    localStorage.setItem(item, values[item]);
                    message.info('添加成功');
                }
            });
          }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
            return (
                <Form onSubmit={this.handleAuthorize.bind(this)}>
                    <FormItem label="Token" {...formItemLayout}>
                        {getFieldDecorator('token')(
                        <TextArea row={6}/>
                        )}
                    </FormItem>
                    <FormItem label="Cookie" {...formItemLayout}>
                        {getFieldDecorator('cookie')(
                        <TextArea row={6}/>
                        )}
                        <Button
                            type="primary"
                            block
                            htmlType="submit"
                            className="pressureBtn"
                        >
                        完成
                        </Button>
                    </FormItem>
                </Form>)
    }
}

export default Form.create()(Authorize);