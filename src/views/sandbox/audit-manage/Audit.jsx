import React, { useState , useEffect} from 'react';
import { Table , Button ,  notification} from 'antd';
import axios from 'axios';

export default function Audit() {
    const [dataSource,setdataSource] = useState([]);
    const {roleId,region,username} = JSON.parse(localStorage.getItem('token'));

    useEffect(()=>{
        const roleObj = {
            '1':'superadmin',
            '2':'admin',
            '3':'editor'
        }
        //注意path的请求参数
        axios.get(`/news?auditState=1&_expand=category`).then( res =>{
          setdataSource(roleObj[roleId]==='superadmin' ? res.data : [
              ...res.data.filter(item => item.author===username),
              ...res.data.filter(item => item.region===region && roleObj[item.roleId]==='editor')
          ])
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
          title: '操作',
          render: (item) => {
            return <div>
                     <Button onClick={()=>handleAudit(item,2,1)}>通过</Button>
                    <Button  danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
            </div>
        }
        }
      ];

      const handleAudit = (item,auditState,publishState) => {
          setdataSource(dataSource.filter(data => data.id!==item.id));
          axios.patch(`/news/${item.id}`,{
              auditState,
              publishState
          }).then(res=>{
                notification.info({
                message: `通知`,
                description:
                  `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
                placement:"bottomRight"
            });
          })
      }
    return (
        <div>
            <Table columns={columns} dataSource={dataSource}
            rowKey={(item)=>item.id} 
            pagination={{pageSize: 5}} 
            />
        </div>
    )
}
