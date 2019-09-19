import React, { useState, useEffect } from 'react';
import { js as beautify } from 'js-beautify';
import AceEditor from "react-ace";
import { sha256 } from 'js-sha256';
import './App.scss';

import "brace/mode/javascript";
import "brace/theme/monokai";


function App() {
  const [source, setSource] = useState('');
  const [hash, setHash] = useState('');
  const [bsource, setBSource] = useState('');

  useEffect(() => {
    setBSource(beautify(source, { preserve_newlines: false }));
  }, [source])

  useEffect(() => {
    console.log(bsource);
    setHash(sha256(bsource));
  }, [bsource]);
  const loaded = bsource.length > 0;

  
  const deploy = (source) => {

  }

  return (
    <div className="App">
      <h1 className="bar">
        Snippets
      </h1>
      <AceEditor
        value={source}
        className="editor"
        mode="javascript"
        theme="monokai"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width={'100%'}
        height={'100%'}
        onChange={source => {setSource(source)}}
        setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
        }}/>
      <div className='content-container'>
        <div className="center-h">
          <div className="form-container">
            <div className="checksum-section">
              {loaded? (
                  <div>
                    SHA256 CheckSum: {hash}
                  </div>
                ) : (
                  <div>
                    Enter some code first
                  </div>
                )}
            </div>
            <div className="deploy-section">
            {loaded? (
                  <div>
                    <div>
                      https://api.snippets.io/{hash}/
                    </div>
                    <button className="button" onClick={deploy(bsource)}>
                      Click to deploy to this endpoint
                    </button>
                  </div>
                ) : (
                  <div>
                    Not ready to deploy
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
