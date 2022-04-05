import React,{forwardRef, useEffect, useState} from 'react';
import {Form,Input,Select} from 'antd';
const { Option } = Select;;

const UserForm = forwardRef((props,ref) => {
    const {regionList,roleList,isUpdate} = props
    const [isDisabled,setisDisabled] = useState(false)

    useEffect(()=>{
        //只有参数的值改变时才会渲染effect
        setisDisabled(props.isUpdateDisabled)
    } , [props.isUpdateDisabled])

    const {roleId,username,region} = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        '1':'superadmin',
        '2':'admin',
        '3':'editor'
      }
    const checkRegionDisabled = (item) => {
        if(roleObj[roleId]==='superadmin'){
            if(isUpdate){
                return false
            }else{
                return false
            }
        }else{
            if(isUpdate){
                return true
            }else{
                return  item.value!==region
            }
        }
    }
    const checkRoleDisabled = (item) => {
        if(roleObj[roleId]==='superadmin'){
            if(isUpdate){
                return false
            }else{
                return false
            }
        }else{
            if(isUpdate){
                return true
            }else{
                return  roleObj[item.id]!=='editor'
            }
        }
    }
    
    return (
        <Form layout="vertical" ref={ref}>
            <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            name="region"
            label="区域"
            rules={isDisabled?[]:[{ required: true, message: 'Please input information!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                    regionList.map(item => 
                        <Option value={item.value} key={item.id}
                        disabled={checkRegionDisabled(item)}>  {item.title}  </Option>
                    )
                    }
                </Select>
            </Form.Item>

            <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: 'Please input information!' }]}
            >
                <Select onChange={(value)=>{
                    if(value === 1){
                        setisDisabled(true)
                        ref.current.setFieldsValue({region:''})
                    }else{
                        setisDisabled(false)
                    }
                }}>
                    {
                    roleList.map(item => 
                        <Option value={item.id} key={item.id}
                        disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                    )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm;