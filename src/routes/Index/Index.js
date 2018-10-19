import React from 'react';
import { Layout, Menu, Row, Col, Divider, Input, Form, Modal} from 'antd';
import { getMethod, base } from '../../config.js';
import { Collapse } from 'antd';
import { Button } from 'antd';
import { getDefault } from '../util/util';
import  FormContent  from '../common/FormContent/FormContent';
import './Index.css';

const { Header, Content, Footer } = Layout;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const FormItem = Form.Item;
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      value: '',
      pressureInfo: {},
      visible: false,
    }
  }

  async componentDidMount() {
    const resource = await getMethod();
    this.setState({ resource: resource.data });
  }

  showModal = (e) => {
    e.stopPropagation();
    this.setState({ visible: true });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  defaultValue(body) {
    if(body === null) {
      return '{\n "key" : "value" \n}';
    }
    const { fieldList } = body;
    var obj = {};
    fieldList && fieldList.forEach(item => obj[item.name] = getDefault(item.defaultValue, item.type));
    return JSON.stringify(obj).replace(/,/g,',\n').replace(/^{/g, '{\n').replace(/}$/g, '\n}');
  }
//渲染菜单栏
  renderMenu() {
    return (
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}>
        <Menu.Item key="1">nav 1</Menu.Item>
        </Menu>
      </Header>
    )
  }
//渲染折叠面板内容
  renderContent() {
    const { resource } = this.state;
    const { controllerList } = resource;
    return(
      <Content style={{ padding: '0 50px', marginTop: 94 }}>
      <div className='container'>
          <Collapse bordered={false} defaultActiveKey={['1']} className='collapse'>
          {controllerList && controllerList.map((item, index) => (
            <Panel header={this.renderContentItem(item)} key={`panel`+index}>
              {item.methodList && item.methodList.map((contentItem, index) => (
                  this.renderPanelContent(contentItem, index, item)
              ))}
            </Panel>
          ))}
          </Collapse>
      </div>
    </Content>
    )
  }
//子panel的内容
  renderPanelContent(contentItem, index, item) {
    const path = item.path + contentItem.path;
    const { paramList, responseList, body, type } = contentItem;
    return(
      <Collapse accordion key={`col-${index}`}>
        <Panel header={this.renderPanelContentHead(contentItem)}  showArrow={false}>
          <Row className="subPanel">
            <Col>参数</Col>
            <Divider/>
            <Row>
              <Col span={12}>名字</Col>
              <Col span={12}>描述</Col>
            </Row>
            <FormContent 
              formData={paramList} 
              body={body}  
              path={path}
              type={type} />
            <br/>
            <Row><Col>返回值</Col><Divider/></Row>
            <Row><Col span={12}>状态码</Col><Col span={12}>描述</Col></Row>
            {responseList && responseList.map((item, idx) => (
              <div>
              <Row key={`res${idx}`} className="subPanelDetail" type="flex"  align="top">
                <Col span={12}>{item.code}</Col>
                <Col span={12}>{item.description}</Col>
              </Row>
              {item.fieldMap && Object.keys(item.fieldMap).map(field => (
                <Row><Col span={12}></Col>
                      <Col span={12}>{field} : {item.fieldMap[field]}</Col>
                </Row>
              ))}
              </div>
            ))}
          </Row>
        </Panel>
    </Collapse>
    )
  }
//子panel的主体内容
  renderSubPanelContent() {

  }
//子panel内容的头部
  renderPanelContentHead(contentItem) {
    const {getFieldDecorator} = this.props.form;
    return(
      <div className="panel">
        <div>
        <Button type="primary" className="panelButton">{contentItem.type}</Button>
        <span className={contentItem.deprecated ? 'deprecated' : null}>{contentItem.path}  {contentItem.description}</span>
        </div>
        <Button type="default" className="pressButton" onClick={this.showModal}>压力测试</Button>
        <Modal 
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="请求数量">
            {getFieldDecorator('n', {})(
              <Input />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
//panel的头部描述
  renderContentItem(item) {
    return (<div className="panelItem">
      <p><span className="name">{item.name}</span>
          <span className="headPath">{item.path}</span>
          <span className="description">{item.description}</span>
      </p>
      <p className="author">{`author:  ${item.author}`}</p>
    </div>)
  }

  renderFoot() {
    return(
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    )
  }

    render() {
         return (
            <Layout>
              {this.renderMenu()}
              {this.renderContent()}
              {this.renderFoot()}
          </Layout>
         )
    }
}
export default Form.create()(Index);