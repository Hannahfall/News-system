import React , {useEffect,useState} from 'react';
import {Table , Button} from 'antd';
import usePublish from './usePublish';

export default function NewsPublish(props) {
    const {dataSource,handlePublish,handleSunset,handleDelete} = usePublish(props.type); 

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
              {
                props.type===1 && 
                <Button type='primary' onClick={() => handlePublish(item.id)}>发布</Button>
              }
              {
                props.type===2 && <Button onClick={() => handleSunset(item.id)}>下线</Button>
              }
              {
                props.type===3 && <Button danger onClick={() => handleDelete(item.id)}>删除</Button>
              }
            </div>
        }
        }
      ];

  return (
    <div>
        <Table columns={columns} dataSource={dataSource}
            rowKey={(item)=>item.id} 
            pagination={{pageSize: 5}} 
        />
    </div>
  )
}
