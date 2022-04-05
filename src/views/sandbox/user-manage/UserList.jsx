import React,{ useState, useEffect , useRef}  from 'react';
import  { Button, Table,Modal, Switch } from 'antd';
import axios from 'axios';
import { DeleteOutlined, ExclamationCircleOutlined,ProfileTwoTone } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;

export default function UserList() {
  const [dataSource,setdataSource] = useState([]);
  const[isAddVisible,setisAddVisible] = useState(false);
  const[regionList,setregionList] = useState([]);
  const[roleList,setroleList] = useState([]);
  const addForm = useRef(null);
  const[isUpdateVisible,setisUpdateVisible] = useState(false);
  const updateForm = useRef(null);
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  const [current,setcurrent] = useState(null)

  //获取用户登录信息
  const {roleId,username,region} = JSON.parse(localStorage.getItem('token'))

  //【Table数据】
  //从数据库获取dataSource
  useEffect(()=>{
    //增加代码可读性（从roleId中映射出角色名称
    const roleObj = {
      '1':'superadmin',
      '2':'admin',
      '3':'editor'
    }

    ///users是roleId数值，所以要从_expand=role中取中文名
    //表关联取法：没有roleName
    axios.get('http://localhost:5000/users?_expand=role'
    ).then(res=>{const list = res.data;
        setdataSource(roleObj[roleId]==='superadmin' ? list : [
          //判断：非superadmin的用户列表能看到什么内容？自己+同区域的editor
          ...list.filter(item => item.username===username),
          ...list.filter(item => item.region===region && roleObj[item.roleId]==='editor')
        ])
      })
},[roleId,region,username])
  //从数据库获取regionList
  useEffect(()=>{
    axios.get('http://localhost:5000/regions'
    ).then((res)=>{setregionList(res.data)})
  },[])
  //从数据库获取roleList
  useEffect(()=>{
    axios.get('http://localhost:5000/roles'
    ).then((res)=>{setroleList(res.data)})
  },[])

  //【Table表头】
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render:(region)=>{
        return <b>{region === '' ? '全球':region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      //从role.roleName中取名称
      render:(role)=>{
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>}  onClick={()=>showDeleteConfirm(item)} />&nbsp;
          <Button type="primary" shape='circle' icon={<ProfileTwoTone/>} onClick={()=>handleUpdate(item)}  />
        </div>
      }
    }
  ];

  //【更新用户】
  const handleUpdate = (item)=>{
    //console.log(item)
    //定时器中是同步的！！！
    setTimeout(() => {
      setisUpdateVisible(true);

      if(item.roleId===1){
        setisUpdateDisabled(true) //超级管理员--不用选区域--区域的选框是禁用的
      }else{
        setisUpdateDisabled(false) //取消禁用
      }

      updateForm.current.setFieldsValue(item)
    }, 0);

      setcurrent(item)
  }

  const updateFormOk = () => {
    //console.log(current) 是更新前的表单信息
    //console.log(value)  是表单输入的信息，是对象
    updateForm.current.validateFields().then(value=>{
        setisUpdateVisible(false)

        setdataSource(dataSource.map(item => {
          if(item.id===current.id){
            return{
              //为什么是被更新而不会重复？
              ...item,
              ...value,
              //????????表关联取法：/user中没有roleName
              role:roleList.filter(data=>data.id===value.roleId)[0]
            }
          }return item
        }))

        setisUpdateDisabled(!isUpdateDisabled)

        axios.patch(`http://localhost:5000/users/${current.id}`,value)
    })
  }

   //【添加用户】
   const addFormOk = () => {
    addForm.current.validateFields().then(value=>{
      //console.log(value)  是表单输入的信息，是对象
      //隐藏对话框
      setisAddVisible(false)
      //post到后端，生成id.再更新dataSource。
      axios.post(`http://localhost:5000/users`,{
          ...value, //为什么是展开的对象
           "roleState": true,
          "default": false  //为什么id会自增长，这两个不会自动添加
      }).then(res => {
          //console.log(res.data) 是完整了属性的user对象
          setdataSource([...dataSource,res.data])
      })
    }).catch(err => {
      console.log(err)
    })
  }

  //【删除用户】
  const showDeleteConfirm = (item)=> {
    confirm({
      title: '确定删除该用户吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item)=>{
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }


  return (
    <div>
        <Button type="primary" onClick={()=>{setisAddVisible(true)}}>添加用户</Button>

  
        <Modal title="添加用户" 
        visible={isAddVisible} 
        onOk={()=>addFormOk()} 
        onCancel={()=>setisAddVisible(false)}
        >
             <UserForm regionList={regionList} roleList={roleList} ref={addForm}/>
        </Modal>
        
        <Modal title="更新用户" 
        visible={isUpdateVisible} 
        onOk={()=>updateFormOk()} 
        onCancel={()=>{setisUpdateVisible(false)
        setisUpdateDisabled(!isUpdateDisabled)}}
        >
             <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
        </Modal>

        <Table columns={columns} dataSource={dataSource} 
        rowKey={(item)=>item.id} 
        pagination={{pageSize: 5}}  />
    </div>
  )
}
