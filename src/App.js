import React, { useState, useEffect } from "react";
import { js as beautify } from "js-beautify";
import AceEditor from "react-ace";
import { sha256 } from "js-sha256";
import axios from "axios";
import "./App.scss";

import "brace/mode/javascript";
import "brace/theme/monokai";
import "brace/mode/json";
import "brace/theme/github";

function App() {
  const [source, setSource] = useState(`
    function handler(req, cb) {
      console.log("Started");
      cb({data: "Hello World"});
    }
    
    
    module.exports = handler;
  `);
  const [hash, setHash] = useState("");
  const [bsource, setBSource] = useState("");
  const [postData, setPostData] = useState("");

  useEffect(() => {
    setBSource(beautify(source, { preserve_newlines: false }));
  }, [source]);

  useEffect(() => {
    console.log(bsource);
    setHash(sha256(bsource));
  }, [bsource]);

  const loaded = bsource.length > 0;

  const deploy = source => {
    axios
      .post("http://localhost:3000/api/create", {
        source
      })
      .then(res => {
        alert(res);
        console.log(res);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      });
  };

  const post = () => {
    let data;
    try {
      data = JSON.parse(postData);
    } catch (err) {
      alert(err.message);
      return;
    }
    axios
      .post(`http://localhost:3000/${hash}`, data)
      .then(res => {
        console.log(res);
        alert(JSON.stringify(res.data));
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const get = () => {
    axios
      .get(`http://localhost:3000/${hash}`)
      .then(res => {
        console.log(res);
        alert(JSON.stringify(res.data));
      })
      .catch(err => {
        alert(err.message);
      });
  };

  return (
    <div className="App">
      <h1 className="bar">Snippets</h1>
      <AceEditor
        value={source}
        className="editor"
        mode="javascript"
        theme="monokai"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width={"100%"}
        height={"100%"}
        onChange={source => {
          setSource(source);
        }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2
        }}
      />
      <div className="content-container">
        <div className="center-h">
          <div className="form-container">
            <div className="checksum-section">
              {loaded ? (
                <div>SHA256 CheckSum: {hash}</div>
              ) : (
                <div>Enter some code first</div>
              )}
            </div>
            <div className="deploy-section">
              {loaded ? (
                <div>
                  <div>https://api.snippets.engineer/{hash}/</div>
                  <button
                    className="button"
                    onClick={() => {
                      deploy(source);
                    }}
                  >
                    Click to deploy to this endpoint
                  </button>
                </div>
              ) : (
                <div>Not ready to deploy</div>
              )}
            </div>
            <AceEditor
              placeholder="Enter JSON Payload for POST request here"
              value={postData}
              className="json-editor"
              mode="json"
              theme="monokai"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              onChange={data => setPostData(data)}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2
              }}
            />
            <div className="button-group">
              <button className="button" onClick={post}>
                Test POST
              </button>
              <button className="button" onClick={get}>
                Test GET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
