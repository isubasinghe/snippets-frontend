import React from 'react';
import AceEditor from "react-ace";
import './App.scss';

import "brace/mode/javascript";
import "brace/theme/monokai";

function App() {
  return (
    <div className="App">
      <h1 className="bar">
        Snippets
      </h1>
      <AceEditor
        className="editor"
        mode="javascript"
        theme="monokai"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width={'100%'}
        height={'100%'}
        setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
        }}/>
      <div className='content-container'>

      </div>
    </div>
  );
}

export default App;
