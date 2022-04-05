import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as Echarts from 'echarts';
//???
import _ from 'lodash';
import {Card , Row , Col , List ,  Avatar , Drawer} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function Home() {
  const[viewList,setviewList] = useState([]);
  const[starList,setstarList] = useState([]);
  const [allList, setallList] = useState([])
  const [visible, setvisible] = useState(false);
  const [piechart, setpiechart] = useState(null);

  const barRef = useRef();
  const pieRef = useRef();

  const {username , region , role:{roleName}} = JSON.parse(localStorage.getItem('token'));

  //注意path的书写：descending降序
  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res=>{
      setviewList(res.data)
    })
  } , [])

  useEffect(() => {
    axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res=>{
      setstarList(res.data)
    })
  } , []) 

  //Echarts
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res=>{
      setallList(res.data)
      renderBarView(_.groupBy(res.data,item=>item.category.title))
    })
  } , [])

  const renderBarView = (obj) => {
      // 基于准备好的dom，初始化echarts实例
      var myChart = Echarts.init(barRef.current);
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '新闻分类图示'
        },

        tooltip: {},
        legend: {
          data: ['数量']
        },

        xAxis: {
          data: Object.keys(obj),
          axisLabel: {
            //横坐标文字显示+全部显示
              rotate: "45",
              //???
              interval: 0
          }
        },

        yAxis: {
            //纵坐标单位
            minInterval: 1
        },

        series: [
          {
            name: '数量',
            type: 'bar',
            data: Object.values(obj).map(item=>item.length)
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      //响应式布局
      window.onresize = () => {
        // console.log("resize")
        myChart.resize()
    }
    }
  
  const renderPieView = (obj) => {
      // 数据处理：筛选数据→数据分类
      var currentList = allList.filter(item=>item.author===username);
      var groupObj = _.groupBy(currentList , item=>item.category.title)
      var list = [];
      for(var i in groupObj){
        list.push({
          name:i,
          value:groupObj[i].length
        })
      }
     //初始化前判断条件：避免多次初始化
      var myChart;
      if(!piechart){
        myChart = Echarts.init(pieRef.current);
        setpiechart(myChart)
      }else{
        myChart = piechart
      }
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '当前用户创作新闻分类图示',
          left: 'center'
        },

        tooltip: {
          trigger: 'item'
        },

        legend: {
          orient: 'vertical',
          left: 'left',
        },

        series: [
          {
            name: '发布数量',
            type: 'pie',
            radius: '50%',
            data: list,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      option && myChart.setOption(option);
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="最多浏览" bordered={false}>
            <List
              bordered
              dataSource={viewList}
              renderItem={item => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="最多点赞" bordered={false}>
            <List
                bordered
                dataSource={starList}
                renderItem={item => <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" bordered={false}>
              <Card
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
                  actions={[
                    <SettingOutlined key="setting" 
                    onClick={() => {
                      setTimeout(() => {
                        setvisible(true);
                        renderPieView()
                      } , 0)
                    }}
                    />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]}
                >
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={username}
                    description={
                      <div>
                        <b>{region ? region : '全球'}</b>
                        <span style={{paddingLeft:'30px'}}>{roleName}</span>
                      </div>
                    }
                  />
                </Card>
          </Card>
        </Col>
      </Row>

      <Drawer 
        title="个人新闻分类" 
        placement="right" 
        closable={true}
        onClose={() => {setvisible(false)}} 
        visible={visible}
      >
          <div ref={pieRef} style={{
              width:'100%',
              height:'400px',
              marginTop:'50px'
          }}></div>
      </Drawer>
                    
      <div ref={barRef} style={{
        height:'400px',
        width:'100%',
        marginTop: "30px"
        }}></div>
    </div>
  )
}
