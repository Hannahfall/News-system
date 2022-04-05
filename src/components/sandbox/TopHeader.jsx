import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
import { Layout,Dropdown, Avatar ,Menu} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined 
} from '@ant-design/icons';
const {Header} = Layout;


 function TopHeader(props) {
 const changeCollapsed = ()=>{
    props.changeCollapsed()
  };

  const {role:{roleName},username} = JSON.parse(localStorage.getItem('token'))

  const menu = (
    <Menu>
      <Menu.Item>{roleName}</Menu.Item>
      <Menu.Item danger 
      onClick={()=>{
        localStorage.removeItem('token')
        props.history.replace('/login')
      }}>
          退出
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:
        <MenuFoldOutlined onClick={changeCollapsed}/>
      }

      <div style={{float:'right'}}>
        <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>&nbsp;&nbsp;&nbsp;
        <Dropdown overlay={menu}>  
           {/*VUE-插槽技术or REACT-RenderProps*/}
           <Avatar size="large" icon={<UserOutlined />} />                         
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
  return{
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
    return {type:'change_collapsed'} //action
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader));
