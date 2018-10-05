import React from 'react';
import { Layout, Menu } from 'antd';
import s from './Index.css';
import getMethod from '../../config';
import { Collapse } from 'antd';
import { Button } from 'antd';

const { Header, Content, Footer } = Layout;
const Panel = Collapse.Panel;
const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  </p>
);
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
    }
  }

  async componentDidMount() {
    const resource = await getMethod();
    console.log('resource', resource)
  }

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

  renderContent() {
    return(
      <Content style={{ padding: '0 50px', marginTop: 94 }}>
      <div className={s.container}>
          <Collapse bordered={false} defaultActiveKey={['1']} className={s.collapse}>
            <Panel header="This is panel header 1" key="1">
                {this.renderPanel()}
            </Panel>
            <Panel header="This is panel header 2" key="2">
                {text}
            </Panel>
            <Panel header="This is panel header 3" key="3">
                {text}
            </Panel>
            </Collapse>
      </div>
    </Content>
    )
  }

  renderFoot() {
    return(
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    )
  }

  renderPanel() {
    return(
      <div style={{ border: '1px solid #ededed', height: '45px', lineHeight: '45px', textAlign:'start'}}>
        <Button type="primary">Primary</Button>
      </div>
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
export default Index;