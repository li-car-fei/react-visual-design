import React, { useState }  from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios'
import dsl from './dsl.json';
import { v4 } from 'uuid';

function NocodePost({handleNodePost}) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const parse = (res) => {
    const parseArr = res.data.split(' ')
    const parseOut = parseArr.reduce((arr, current, index, arrFor) => {
      if (dsl[current] === 'nextAdd') { return [...arr, arrFor[index + 2]] }
      if (current === 'header') { return [...arr, current] }
      return [...arr]
    }, [])
    const setPost = parseOut.reduce((arr, current) => {
      return [...arr, { id: v4(), name: dsl[current] }]
    }, [])
    handleNodePost(setPost)
  }
  
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file as RcFile);
    });
    setUploading(true);
    // You can use any AJAX library you like
    axios('/noCodePost', {
      method: 'POST',
      data: formData,
    })
      .then((res) => parse(res))
      .then(() => {
        setFileList([]);
        message.success('upload successfully.');
      })
      .catch((error) => {
        console.log(error)
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  )
}

export default NocodePost;
