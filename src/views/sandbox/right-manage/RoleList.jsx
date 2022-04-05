import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import { Table,Button,Modal,Tree } from 'antd';
import {DeleteOutlined,
  ProfileTwoTone,
  ExclamationCircleOutlined
 } from '@ant-design/icons';
 const {confirm} = Modal;



export default function RoleList() {

  const [dataSource,setdataSource] = useState([]);
  const[isModalVisible , setisModalVisible] = useState(false);
  const[treeData , settreeData] = useState([]);
  const[currentRights, setcurrentRights] = useState([])
  const [currentId , setcurrentId] = useState(0)

//【初始化】Table
  useEffect(()=>{
    axios({
      method:'GET',
      url:'http://localhost:5000/roles'
    }).then((res)=>{
      setdataSource(res.data)
    })
  },[])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>}  onClick={()=>showDeleteConfirm(item)} />&nbsp;
          <Button type="primary" shape='circle' icon={<ProfileTwoTone />}
          onClick={()=>{
            //console.log(item) 是点的那一项
            setisModalVisible(true);
            setcurrentRights(item.rights)
            setcurrentId(item.id)
            }} />
        </div>
      }
    }
  ];

  const showDeleteConfirm = (item)=> {
    confirm({
      title: '确定删除该管理员吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  //删除
  const deleteMethod = (item)=>{
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:5000/roles/${item.id}`)
  }

//【编辑按钮】Modal+Tree
  useEffect(() => {axios.get(
    'http://localhost:5000/rights?_embed=children'
  ).then(res => {
    settreeData(res.data)
  })},[])

  const handleOk = () => {
      //取消对话框
      setisModalVisible(false)
      //修改dataSource
      setdataSource(dataSource.map(item =>{
        //翻进dataSource找到勾选那一项（currentId)
        if(item.id === currentId){
          return {
            ...item,
            rights:currentRights
          }
        }return item
      }))
      //修改后端数据--patch
      axios.patch(`http://localhost:5000/roles/${currentId}`,
      {rights:currentRights})
  }

  const handleCancel = () => {
      setisModalVisible(false)
  }
  const onCheck = (checkedKeys) => { 
      setcurrentRights(checkedKeys)
   }

  
  return (
    <div>
        {/*利用rowKey属性设置key*/}
        <Table columns={columns} dataSource={dataSource} 
        rowKey={(item)=>item.id} 
        pagination={{pageSize: 5}} 
        />

        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                /* defaultExpandedKeys={['0-0-0', '0-0-1']}
                defaultSelectedKeys={['0-0-0', '0-0-1']}
                onSelect={onSelect}*/
                onCheck={onCheck} 
                checkStrictly = {true}
                checkedKeys={currentRights}
                treeData={treeData}
            />
        </Modal>
    </div>
  )
}
