import style from './News.module.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import {Button, PageHeader , Steps , Form , Input, Select, message , notification} from 'antd';
const {Step} = Steps;
const {Option} = Select;

export default function NewsUpdate(props) {
    const[current,setCurrent] = useState(0);
    const[categoryList,setcategoryList] = useState([]);
    const[content,setcontent] = useState(""); //空字符串
    const[formInfo,setformInfo] = useState({}); //是个对象
    const NewsForm = useRef(null)
    //const User = JSON.parse(localStorage.getItem('token'))
    //const [newsInfo,setnewsInfo] = useState(null)

    //拿到更新前的信息并填充
    useEffect(() => {
      axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res=>{
        const {title,categoryId,content} = res.data;
        NewsForm.current.setFieldsValue({
            title,
            categoryId
        });
        setcontent(content);
      })
    } , [props.match.params.id])

    //拿到下拉选项
    useEffect(() => {
        axios.get('/categories').then(res =>
            //console.log(res.data)
            setcategoryList(res.data)
        )
    } , [])

    const handlePrevious = () => {
        setCurrent(current-1)
    };

    const handleNext = () => {
        if( current===0 ){
            NewsForm.current.validateFields().then( res=> {
                setformInfo(res)
                setCurrent(current+1)
            }).catch(error => {
                console.log(error)
            })
        }else{
            if( content==='' || content.trim()==='<p></p>'){
                message.error('新闻内容不能为空')
            }else{
                setCurrent(current+1)
            }
        }
    };

    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`,{
            ...formInfo,
            "content": content,
            "auditState": auditState
        }).then( res=> {
            props.history.push(auditState===0?'/news-manage/draft' : '/audit-manage/list');
            
            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
                placement:"bottomRight",
            });
        })
    }


    return (
        <div>
            {/*console.log(props)*/}
            <PageHeader
                className="site-page-header"
                onBack={() => props.history.goBack()}
                title="更新新闻"
            />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            {/*******表单或文本框 *******/}
            <div  style={{marginTop:'50px'}}>
                <div  className={current===0?'':style.active} >
                    <Form
                    name="basic"
                    ref={NewsForm}
                     >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item => 
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                 
                <div className={current===1?'':style.active}>
                    <NewsEditor getContent={value => setcontent(value)} content={content}/>
                </div>

                <div className={current===2?'':style.active}>3333</div>
            </div>

            {/*******步骤 *******/}
            <div style={{marginTop:'50px'}}>
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
                {
                    current < 2 && <Button onClick={handleNext}>下一步</Button>
                }
                {
                    current === 2 && 
                    <span>
                        <Button  onClick={() => {handleSave(0)}}>保存草稿箱</Button>&nbsp;
                        <Button  onClick={() => {handleSave(1)}}>提交审核</Button>
                    </span>
                }
            </div>

            
        </div>
    )
}
