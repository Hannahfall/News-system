import React, { useState , useEffect } from 'react';
import { Table , Button ,Tag ,notification } from 'antd';
import axios from 'axios';

export default function AuditList(props) {
    const[dataSource,setdataSource] = useState([]);
    const {username} = JSON.parse(localStorage.getItem('token'));

    useEffect(()=>{
        //注意path的请求参数:只能看到登录账号是作者的 & 审核状态不等于0 & 发布状态小于等于1
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then( res =>{
            //console.log(res.data)
          setdataSource(res.data)
        })
      },[username]);

    const columns = [
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
          title: '审核状态',
          dataIndex: 'auditState',
          render:(auditState)=>{
              const colorList = ['','orange','green','red'];
              const auditList = ["草稿箱","审核中","已通过","未通过"];
              return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
          }
        },
        {
          title: '操作',
          render: (item) => {
            return <div>
                {
                    item.auditState===1 &&  <Button  onClick={() => handleRevert(item)}>撤销</Button>
                }
                {
                    item.auditState===2 &&  <Button  danger  onClick={() => handlePublish(item)}>发布</Button>
                }
                {
                    item.auditState===3 &&  <Button type="primary"  onClick={() => handleUpdate(item)}>更新</Button>
                }
            </div>
        }
        }
      ];

      const handleRevert = (item) => {
          setdataSource(dataSource.filter(data=>data.id!==item.id));
          axios.patch(`/news/${item.id}`,{
              auditState:0
          }).then(res=>{
            props.history.push('/news-manage/draft')

            notification.info({
                message: `通知`,
                description:
                  `您可以到草稿箱中查看您的新闻`,
                placement:"bottomRight"
          })
        })
      };
      const handlePublish = (item) => {
          axios.patch(`/news/${item.id}`,{
              publishState:2
          }).then(res=>{
              props.history.push('/publish-manage/published')

              notification.info({
                message: `通知`,
                description:
                  `您可以到【发布管理/已发布】中查看您的新闻`,
                placement:"bottomRight"
            })
        })
      };
      const handleUpdate = (item) => {
          props.history.push(`/news-manage/update/${item.id}`)
      };

    return (
        <div>
            <Table columns={columns} dataSource={dataSource}
            rowKey={(item)=>item.id} 
            pagination={{pageSize: 5}} 
            />
        </div>
    )
}
