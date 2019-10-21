import React from 'react';
import { Layout, Menu, Row, Col, Divider, Input, Modal, Form, Radio, Tabs, Select, message } from 'antd';
import { getMethod, pressureTest, pressure_url, getUrlList } from '../../config.js';
import { Collapse, Tree, Icon } from 'antd';
import { Button } from 'antd';
import { jsonParse, getDefault, getPressureRes, getBtnBg } from '../util/util';
import { defaultObj } from '../util/constant';
import FormContent from '../component/FormContent/FormContent';
import Global from '../component/Global/Global';
import LoginForm from '../component/LoginForm';
import './Home.css';

const { Header, Content, Footer } = Layout;
const Panel = Collapse.Panel;
const { TextArea } = Input;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TreeNode } = Tree

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const RadioGroup = Radio.Group;
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      value: '',
      pressureInfo: {},
      visible: false,
      isGet: true, // 压力测试是否get,
      urlList: [],
      modelVisble: false,
      field: {},
      loginDialogVisible: false, //登录弹窗
      loading: false,
      baseModalVisible: false,
      baseUrl: '',
    };
    this.renderTitle = this.renderTitle.bind(this);
    this.c = this.renderPressurelContent.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  async componentDidMount() {
    const loginInfo = { 
      account: localStorage.getItem('account') || '', 
      password:localStorage.getItem('password') || '' 
    }
    const resource = await getMethod(loginInfo, true);
    if (resource && resource.code === -1 && !resource.success) {
      this.setState({ loginDialogVisible: true })
    }
    this.setState({ resource: resource == null ? {} : resource.data});
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleModelOk = () => {
    this.setState({
      modelVisble: false,
    });
  };

  handleModelCancel = () => {
    this.setState({
      modelVisble: false,
    });
  };

  async handleFocus() {
    const urlList = await getUrlList();
    this.setState({
      urlList: urlList.data,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let body = {};
    let param = '';
    let url = '';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.keys(values).forEach(item => {
          if (item === 'body') {
            body = JSON.stringify(JSON.parse(values[item]));
          } else if (values[item] !== undefined) {
            param += `${item}=${values[item]}&`;
          }
          url = pressure_url + '?' + param.substring(0, param.length - 1);
        });
      }
    });
    const response = await pressureTest(url, body);
    this.setState({
      visible: true,
      pressureInfo: response.success ? response.data : response,
    });
  }

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

  // 压力测试是否为get方法
  onChange = e => {
    this.props.form.setFieldsValue({
      isGet: e.target.value,
    });
  };

  showModal(field) {
    const { data } = field;
    if (data && JSON.stringify(data) !== '{}') {
      this.setState({ modelVisble: true, field: data });
    }
  }

  hiddenModal = (e) => {
    this.setState({ loginDialogVisible:  e })
  }

  // 退出登录
  loginout = () => {
    localStorage.removeItem('account')
    localStorage.removeItem('password')
    window.location.reload()
  }

  baseOk = () => {
    const { baseUrl } = this.state
    if (!baseUrl) {
      message.warning('url不能为空')
      return
    }
    localStorage.setItem('base', baseUrl)
    this.setState({ baseModalVisible: false })
    window.location.reload()
  }

  baseChange = (e) => {
    this.setState({ baseUrl: e.target.value })
  }

  //渲染菜单栏
  renderMenu() {
    return (
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#26292e' }}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px', background: '#26292e', color: '#fff' }}
        >
        <Menu.SubMenu
          style={{ float: 'right' }}
          title= {localStorage.getItem('account') || ''}
        >
          {localStorage.getItem('account') && <Menu.Item onClick={this.loginout}>退出登录</Menu.Item>}
        </Menu.SubMenu>
        <Menu.Item
        style={{ float: 'right' }}
        onClick={() => this.setState({ baseModalVisible: true })}
       >更换接口地址
       </Menu.Item>
        </Menu>
      </Header>
    );
  }

  renderTitle() {
    const { resource = {} } = this.state;
    const { name = '', description = '' } = resource;
    return (
      <div className="title">
        {JSON.stringify(resource) !== '{}' ? (
          <div>
            <div className="name">{name}</div>
            <div>{description}</div>
          </div>
        ) : null}
      </div>
    );
  }

  renderTabs() {
    return (
      <Content style={{ padding: '0 50px', marginTop: 10, textAlign: 'left' }}>
        <div className="container">
          <Tabs className="tabs" type="card">
            <TabPane tab="接口列表" key="1" className="tabs-1">
              {this.renderContent()}
            </TabPane>
            <TabPane tab="Models" key="2" className="tabs-2">
              {this.renderModel()}
            </TabPane>
            <TabPane tab="压力测试" key="3" className="tabs-3">
              {this.renderPressurelContent()}
            </TabPane>
            <TabPane tab="全局参数" key="5" className="tabs-5">
              <Global />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    );
  }

  //渲染折叠面板内容
  renderContent() {
    const { resource = {} } = this.state;
    const { controllerList } = resource;
    return (
      <Collapse bordered={false} defaultActiveKey={['1']} className="collapse" accordion>
        {controllerList &&
          controllerList.map((item, index) => (
            <Panel header={this.renderContentItem(item)} key={`panel` + index}>
              {item.methodList &&
                item.methodList.map((contentItem, index) =>
                  this.renderPanelContent(contentItem, index, item)
                )}
            </Panel>
          ))}
      </Collapse>
    );
  }

  //子panel的内容
  renderPanelContent(contentItem, index, item) {
    const path = item.path + contentItem.path;
    const { paramList, responseList, body, type } = contentItem;
    return (
      <Collapse accordion key={`col-${index}`} bordered={false} showArrow={false}>
        <Panel header={this.renderPanelContentHead(contentItem)}>
          <Row className="subPanel">
            <Col>参数</Col>
            <Divider />
            <Row>
              <Col span={12}>名字</Col>
              <Col span={12}>描述</Col>
            </Row>
            <FormContent formData={paramList} body={body} path={path} type={type} />
            <br />
            <Row>
              <Col>返回值</Col>
              <Divider />
            </Row>
            <Row>
              <Col span={12}>状态码</Col>
              <Col span={12}>描述</Col>
            </Row>
            {responseList &&
              responseList.map((item, idx) => (
                <div key={`res${idx}`}>
                  <Row className="subPanelDetail" type="flex" align="top">
                    <Col span={12}>{item.code}</Col>
                    <Col span={12}>{item.description}</Col>
                  </Row>
                  {item &&
                    item.fieldList &&
                    item.fieldList.map((field, idx) => (
                      <Row key={`filed-${idx}`}>
                        <Col span={12} />
                        <Col span={12}>
                          <p
                            onClick={() => this.showModal(field)}
                            className={field.data ? 'pointer' : ''}
                          >
                            {field.name} : {field.description}
                          </p>
                        </Col>
                      </Row>
                    ))}
                    {this.renderModelDialog()}
                </div>
              ))}
          </Row>
        </Panel>
      </Collapse>
    );
  }

  renderPressureRes() {
    const { pressureInfo } = this.state;
    const res = getPressureRes(pressureInfo);
    return (
      <Modal
        title="压力测试结果"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleOk}
      >
        <pre className="modelItem">
          {getPressureRes &&
            Object.keys(res).map(item => (
              <Row>
                <Col span={8}>{item}</Col>
                <Col span={8}>{res[item]}</Col>
              </Row>
            ))}
        </pre>
      </Modal>
    );
  }

  renderModelDialog() {
    const { field = {}, modelVisble } = this.state;
    const { fieldList = [] } = field;
    return (
      <Modal
        title="Model"
        visible={modelVisble}
        onOk={this.handleModelOk}
        onCancel={this.handleModelCancel}
        width={650}
      >
        {this.renderModelTable(fieldList)}
      </Modal>
    );
  }
  // 压力测试内容
  renderPressurelContent() {
    const { getFieldDecorator } = this.props.form;
    const { urlList } = this.state;
    const obj = { params: {}, body: {} };
    return (
      <div>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormItem label="请求数量" {...formItemLayout}>
            {getFieldDecorator('n', { initialValue: 1 })(<Input size="large" />)}
          </FormItem>
          <FormItem label="并发数量" {...formItemLayout}>
            {getFieldDecorator('c', { initialValue: 1 })(<Input size="large" />)}
          </FormItem>
          <FormItem label="cookie" {...formItemLayout}>
            {getFieldDecorator('cookie', {})(<Input size="large" />)}
          </FormItem>
          <FormItem label="是否为get" {...formItemLayout}>
            {getFieldDecorator('isGet', { initialValue: true })(
              <RadioGroup onChange={this.onChange}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="请求地址" {...formItemLayout}>
            {getFieldDecorator('url')(
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="选择请求地址"
                onFocus={this.handleFocus}
                size="large"
              >
                {urlList && urlList.map(item => <Option value={item}>{item}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="参数" {...formItemLayout}>
            {getFieldDecorator('body', { initialValue: jsonParse(obj) })(<TextArea rows={4} />)}
            <Button type="primary" htmlType="submit" block className="pressureBtn">
              完成
            </Button>
          </FormItem>
        </Form>
        {this.renderPressureRes()}
      </div>
    );
  }

  //子panel内容的头部
  renderPanelContentHead(contentItem) {
    return (
      <div className="panel">
        <div>
          <Button
            type="primary"
            className="panelButton"
            style={{ background: getBtnBg(contentItem.type) }}
          >
            {contentItem.type}
          </Button>
          <span className={contentItem.deprecated ? 'deprecated' : null}>
            {contentItem.path} {contentItem.description}
          </span>
        </div>
      </div>
    );
  }

  //panel的头部描述
  renderContentItem(item) {
    return (
      <div className="panelItem">
        <p>
          <span className="name">{item.name}</span>
          <span className="headPath">{item.path}</span>
          <span className="description">{item.description}</span>
        </p>
        <span className={item.author ? 'author' : ''}>{`${item.author}`}</span>
      </div>
    );
  }


  renderModelTable(model) {
    const loop = data => {
      if (data.nestModel) {
       return data.nestModel.fieldList.map((item, idx) => 
        <TreeNode 
          title={
            <span className="treeNode">
              <span className="node">{item.name}</span>
              <span className="node">{item.type}</span>
              <span className="node">{item.description}</span>
            </span>}
          key={`${item.name}-${idx}`}
          style={{ color: '#fff' }}
        >
          {loop(item)}
        </TreeNode>)
      }

    }

    return (
      <div className="modelItem">
        <Row justify="space-around" type="flex" className="col">
          <Col span={6}>名称</Col>
          <Col span={6}>类型</Col>
          <Col span={6}>描述</Col>
        </Row>
        {model &&
          model.map(modelItem => (
            <Row justify="space-around" type="flex" className="col">
              <Col span={6}>
                {modelItem.name}
                {modelItem.nestModel && (
                  <Tree
                    showIcon
                    defaultExpandAll
                    switcherIcon={<Icon type="down" />}
                  >
                    {loop(modelItem)}
                  </Tree>
                )}
              </Col>
              <Col span={6}>{modelItem.type}</Col>
              <Col span={6}>{modelItem.description}</Col>
            </Row>
          ))}
      </div>
    );
  }
  // 渲染model卡片
  renderModel() {
    const { resource = {} } = this.state;
    const { modelList } = resource;
    return (
      <Collapse className="collapse" bordered={false}>
        {modelList &&
          modelList.map(item => (
            <Panel
              className="modelPanel"
              hoverable
              header={
                <div>
                  <span className={item.deprecated === false ? '' : 'deleteText'}>{item.name}</span>
                  &nbsp;&nbsp;
                  <span className="modelDesciption">{item.description}</span>
                </div>
              }
            >
              {this.renderModelTable(item.fieldList)}
            </Panel>
          ))}
      </Collapse>
    );
  }

  // 添加用户登录权限
  renderLoginDialog = () => {
    const { loginDialogVisible } = this.state
    return (<Modal
      visible={loginDialogVisible}
      title="登录"
      footer={null}
    >
    <LoginForm hiddenModal={this.hiddenModal} />
    </Modal>)
  }

  renderFoot() {
    return (
      <Footer style={{ textAlign: 'center', marginTop: '10px' }}>
        Easy-doc ©2019 Created by Stalary
      </Footer>
    );
  }

  renderBaseModal() {
    const { baseModalVisible } = this.state
    return (
      <Modal
        title="更换地址"
        visible={baseModalVisible}
        onCancel={() => this.setState({ baseModalVisible: false })}
        onOk={this.baseOk}
      >
        <Input placeholder="请输入地址" onChange={this.baseChange}/>
      </Modal>
    )
  }

  render() {
    return (
      <Layout>
        {this.renderMenu()}
        {this.renderTitle()}
        {this.renderTabs()}
        {this.renderLoginDialog()}
        {this.renderFoot()}
        {this.renderBaseModal()}
      </Layout>
    );
  }
}

export default Form.create()(Index);
