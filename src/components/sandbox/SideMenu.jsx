import React, {  useEffect, useState } from 'react';
import {Layout,Menu} from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux'
import './index.css';
const {Sider} = Layout;
const {SubMenu} = Menu;

//模拟数组结构
/* const menuList = [
  {
    key:'/home',
    title:'首页',
    icon:<UserOutlined/>
  },
  {
    key:'/user-manage',
    title:'用户管理',
    icon:<UserOutlined/>,
    children:[
      {
        key:"/user-manage/list",
        title:"用户列表",
        icon:<UserOutlined />
      }
    ]
  },
  {
    key:"/right-manage",
    title:"权限管理",
    icon:<UserOutlined />,
    children:[
      {
        key:"/right-manage/role/list",
        title:"角色列表",
        icon:<UserOutlined />
      },
      {
        key:"/right-manage/right/list",
        title:"权限列表",
        icon:<UserOutlined />
      }
    ]
  }
] */

function SideMenu(props) {
  //创建menuList及更新函数
  const[menuList,setMenuList] = useState([]);
  //发送Ajax请求获取menuList
  useEffect(()=>{
    axios({
      method:'GET',
      url:'http://localhost:5000/rights?_embed=children'
    }).then(res => {
      //console.log(res.data) --是个对象
      setMenuList(res.data)
    })
  },[])

  const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
  //检查pagepermission & 用户角色，从而呈现想要的菜单
  const check = (item)=>{
      //console.log(item)
      return item.pagepermisson && rights.includes(item.key)
  }

  //定义图标数组
  const iconList = {
    "/home":<UserOutlined />,
    "/user-manage":<UserOutlined />,
    "/user-manage/list":<UserOutlined />,
    "/right-manage":<UserOutlined />,
    "/right-manage/role/list":<UserOutlined />,
    "/right-manage/right/list":<UserOutlined />
  }

  //定义遍历数组的函数
  const renderMenu = (menuList)=>{
    return menuList.map(item => {
      //一级菜单
      if(item.children?.length > 0 && check(item)){
          return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {/**递归 */}
            {renderMenu(item.children)}
          </SubMenu>
      }
      //二级菜单
      return  check(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }

  //动态高亮所需变量：利用url
  const selectKeys = [props.location.pathname]
  const openKeys = ['/'+props.location.pathname.split('/')[1]]
  //console.log(props.location.pathname.split('/'))
  
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div style={{display:'flex',height:'100%','flexDirection':'column'}}>
          <div className="logo" >全球新闻发布管理系统</div>

          <div style={{flex:1 ,'overflow':'auto'}}>
                {/*1.antd的属性中无default是受控组件
                  2.selectedKeys选择谁高亮，openKeys选择展开被选中的菜单
                 */}
                <Menu theme="dark" mode="inline" selectedKeys={selectKeys}  defaultOpenKeys={openKeys}> 
                    {/*调用遍历数组的函数*/}
                    {renderMenu(menuList)}
                </Menu>
          </div>
        </div>
    </Sider>
  )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
  return {isCollapsed}
}

export default connect(mapStateToProps)(withRouter(SideMenu))
