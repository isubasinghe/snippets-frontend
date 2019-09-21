import React, { useState, useEffect } from "react";
import { js as beautify } from "js-beautify";
import AceEditor from "react-ace";
import { sha256 } from "js-sha256";
import axios from "axios";
import "./App.scss";

import "brace/mode/javascript";
import "brace/mode/json";
import "brace/theme/dracula";

const theme = "dracula";

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
      .post("https://snippets-eng.herokuapp.com/api/create", {
        source
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        alert(err.response.data.error);
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
      .post(`https://snippets-eng.herokuapp.com/${hash}`, data)
      .then(res => {
        console.log(res);
        alert(JSON.stringify(res.data));
      })
      .catch(err => {
        alert(err.response.data.error);
      });
  };

  const get = () => {
    axios
      .get(`https://snippets-eng.herokuapp.com/${hash}`)
      .then(res => {
        console.log(res);
        alert(JSON.stringify(res.data));
      })
      .catch(err => {
        console.log(err);
        alert(err.response.data.error);
      });
  };

  return (
    <div className="App">
      <h1 className="bar">Snippets</h1>
      <AceEditor
        value={source}
        className="editor"
        mode="javascript"
        theme={theme}
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
                <div className="text-desc">SHA256 CheckSum: {hash}</div>
              ) : (
                <div className="text-desc">Enter some code first</div>
              )}
            </div>
            <div className="deploy-section">
              {loaded ? (
                <div>
                  <div className="text-desc">https://snippets-eng.herokuapp.com/{hash}/</div>
                  <button
                    className="button deploy-button"
                    onClick={() => {
                      deploy(source);
                    }}
                  >
                    Click to deploy to this endpoint
                  </button>
                </div>
              ) : (
                <div className="text-desc">Not ready to deploy</div>
              )}
            </div>
            <AceEditor
              placeholder="Enter JSON Payload for POST request here"
              value={postData}
              className="json-editor"
              mode="json"
              theme={theme}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              onChange={data => setPostData(data)}
              width={'95%'}
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
