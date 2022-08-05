import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import Render from '@/components/Render';
import demo from '@/../mock/demo';

const PageJsonSchema: React.FC<any> = (props: any) => {

  const [components, setComponentsState] = useState('');
  const query: any = history.location.query;
  const api = query.api ? query.api : props.initApi;

  useEffect(() => {
    onSetComponentsState()
  }, []);

  const onSetComponentsState = async () => {
    if(api) {
      const result = demo[api]
      if(result) {
        setComponentsState(result);
      }
    } else {
      setComponentsState('请配置初始接口！');
    }
  };

  return (
    <div>
      <Render body={components.body} />
    </div>
  );
}

export default PageJsonSchema;