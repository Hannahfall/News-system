import React,{useEffect, useState} from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
  const[editorState,seteditorState] = useState('');

    useEffect(() => {
      const html = props.content;
      //解决NewsAdd中报错的问题
      if (props.content===undefined)return;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        seteditorState(editorState);
      }
    },[props.content])


  return (
    <div>
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={editorState =>  seteditorState(editorState) }

            onBlur={() => { 
                props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
            />
    </div>
  )
}
