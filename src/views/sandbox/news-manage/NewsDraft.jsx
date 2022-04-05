import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import { Table,Button,Modal,notification } from 'antd';
import {DeleteOutlined,
  EditOutlined ,
  ExclamationCircleOutlined,
  UploadOutlined 
 } from '@ant-design/icons';
 const {confirm} = Modal;



export default function NewsDraft(props) {
  const [dataSource,setdataSource] = useState([]);
  const {username} = JSON.parse(localStorage.getItem('token'))

//【初始化】Table
  //dataSource
  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then( res =>{
        //console.log(res.data)
      setdataSource(res.data)
    })
  },[username]) //为什么要设置username
  //columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
          return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '分类',
      dataIndex: 'category',
      render:(category)=>{
          return category.title
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} 
          onClick={()=>showDeleteConfirm(item)} 
          />&nbsp;

          <Button shape='circle' icon={<EditOutlined />} 
          onClick={()=> props.history.push(`/news-manage/update/${item.id}`)}
          />&nbsp;

          <Button type="primary" shape="circle" icon={<UploadOutlined />} 
          onClick={() => {handleCheck(item.id)}}
          />
       
        </div>
      }
    }
  ];

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
        "auditState": 1
    }).then(res=>{
        props.history.push('/audit-manage/list')

        notification.info({
            message: `通知`,
            description:
              `您可以到${'审核列表'}中查看您的新闻`,
            placement:"bottomRight"
        });
    })
}


  const showDeleteConfirm = (item)=> {
    confirm({
      title: '确定删除该草稿吗?',
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
    axios.delete(`/news/${item.id}`)
  }

  
  return (
    <div>
        {/*利用rowKey属性设置key*/}
        <Table columns={columns} dataSource={dataSource}
         rowKey={(item)=>item.id} 
         pagination={{pageSize: 5}} 
         />
    </div>
  )
}
