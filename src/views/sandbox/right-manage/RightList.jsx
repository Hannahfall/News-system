import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Button,Table,Tag,Modal,Popover,Switch} from 'antd';
import {DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined} from '@ant-design/icons';
const { confirm } = Modal;
const { content } = Popover;

export default function RightList() {

  const [dataSource,setdataSource] = useState();

  //获取要呈现的数据————这里不用useEffect,直接axios().then()好像也可以？
  useEffect(()=>{
    axios({
      method:'GET',
      url:'http://localhost:5000/rights?_embed=children'
    }).then(res => {
      const list = res.data;

      //不能写死，删除元素时会出现错误
      list[0].children = '';
      //遍历并做判断————没有子项时就不会出现折叠选项
      list.forEach(item => {
        if(item.children.length === 0){
          item.children = ''
        }
      })
      setdataSource(list)
    })
  },[])
  
  //定义表头————dataIndex要和后端数据对应
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
        dataIndex: 'title'
    },
    {
        title:"权限路径",
        dataIndex:'key',
        render:(key)=>{
          return <Tag color="volcano">{key}</Tag>
        }
    },
    {
      title:"操作",
      render:(item)=>{
        return <div>
            <Button danger shape='circle' icon={<DeleteOutlined/>}  onClick={()=>showDeleteConfirm(item)} />&nbsp;
          
            {/*content属性是<div><Switch/></div>*/}
            <Popover  
              content={<div style={{textAlign:"center"}}><Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}} /></div>}
              title="配置开关" 
              trigger={item.pagepermisson===undefined?'':'click' }
            >
                  <Button type="primary" shape='circle' icon={<EditOutlined/>} 
                  disabled={item.pagepermisson===undefined}/>
                  
            </Popover>
        </div>
      }
  }
  ];

  const switchMethod = (item)=>{
    //改前端dataSource
    item.pagepermisson = item.pagepermisson === 1? 0:1
    setdataSource([...dataSource])
    //更新后端json文件
    if(item.grade === 1 ){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{pagepermisson:item.pagepermisson})
    }else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{pagepermisson:item.pagepermisson})
    }
  }

  const showDeleteConfirm = (item)=> {
    confirm({
      title: '确定删除该权限吗?',
      icon: <ExclamationCircleOutlined />,
      //content: 'Some descriptions',
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        //console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item)=>{
    //console.log(item)   item.rightId是上一级的id
    if(item.grade === 1){
      //更新状态，除去点选删除按钮的那一项————前端页面更新
      setdataSource(dataSource.filter(data => data.id!==item.id))
      //利用axios删除后端数据————后端数据库更新
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }else{
      //更新前端
      let list = dataSource.filter( data => data.id === item.rightId ) //找出选中元素的上一级
      list[0].children = list[0].children.filter( data => data.id !== item.id )
      //为什么这里要展开数组复制一份哦
      setdataSource([...dataSource])
      //注意url的改变
      axios.delete(`http://localhost:5000/children/${item.id}`)
      //更新后端
    }
    //dataSource.filter((data)=>{}) 
  }
  
  return (
    <Table dataSource={dataSource} columns={columns}
    pagination={{pageSize: 5}} 
     />
  )
}
