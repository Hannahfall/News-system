import React from 'react';
import { Button } from 'antd';
import NewsPublish from '../../../components/publish-manage/NewsPublish';

export default function Unpublished() {
    return (
        <div>
          <NewsPublish type={1} />
          
        </div>
    )
}
