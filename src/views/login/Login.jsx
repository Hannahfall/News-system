import React from 'react';
import {Form , Button , Input, message} from 'antd';
import {UserOutlined ,LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import Particles from 'react-tsparticles';
import './login.css';


export default function Login(props) {

  const onFinish = (values) => {
    //console.log(values) 是输入的信息
    axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
      //console.log(res.data)是登录的用户信息
      if(res.data.length===0){
        message.error('用户名或密码不匹配')
      }else{
        localStorage.setItem('token',JSON.stringify(res.data[0]));
        props.history.push('/')
      }
    })
  }
  const particlesInit = (main) => {
    console.log(main);}
  const particlesLoaded = (container) => {
    console.log(container);
  };
  return (
    <div style={{background:'rgb(35.39.65)',height:'100%'}}> 
       
      <div className='formContainer'>
        <div className='loginTitle'>全球新闻发布管理系统</div>
        <Form
        name="basic"
        onFinish={onFinish}
      >
             <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
              >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                </Button>
            </Form.Item>
        </Form>
      </div>
    </div>
    )
}
