import React, { Component } from 'react';
import ReactDOM from "react-dom";
import AceEditor from "react-ace";


import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/snippets/markdown";
import "ace-builds/src-noconflict/theme-monokai";


class CodeEditor extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef();
        this.onEditorChange = this.onEditorChange.bind(this)
    }

    onEditorChange(newValue) {
        ReactDOM.findDOMNode(this.myRef.current).innerHTML = newValue


    }

    render() {
        return (
            <AceEditor
                placeholder="Placeholder Text"
                mode="markdown"
                theme="monokai"
                name="mempadPage"
                height='calc(100% - 60px)'
                width={"100%"}
                drawerWidth={this.props.drawerWidth}
                wrapEnabled={true}
                onLoad={this.onLoad}
                onChange={
                    (newValue) => {
                        if (this.props.node) {
                            this.props.node.content = newValue;
                        }
                        this.props.setContentHasChanged(true);
                    }
                }

                fontSize={16}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                value={this.props.value}

                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: false,
                    tabSize: 2,
                }} />


        );
    }
}

export default CodeEditor;