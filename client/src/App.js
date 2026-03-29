import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [showSnippets, setShowSnippets] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [username, setUsername] = useState('');
const [token, setToken] = useState('');
const [authMode, setAuthMode] = useState('login');
const [email, setEmail] = useState('');
const [authPassword, setAuthPassword] = useState('');
const [authUsername, setAuthUsername] = useState('');
const [isError, setIsError] = useState(false);

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const res = await axios.get('https://ai-code-sandbox.onrender.com/api/snippets/all');
      setSnippets(res.data.snippets);
    } catch (err) {
      console.log('Error loading snippets:', err);
    }
  };

  const saveSnippet = async () => {
    if (!title) return alert('Please enter a title!');
    try {
      await axios.post('https://ai-code-sandbox.onrender.com/api/snippets/save', { title, code, language });
      alert('Snippet saved!');
      setTitle('');
      loadSnippets();
    } catch (err) {
      alert('Error saving snippet');
    }
  };

  const deleteSnippet = async (id) => {
    try {
      await axios.delete(`https://ai-code-sandbox.onrender.com/api/snippets/delete/${id}`);
      loadSnippets();
    } catch (err) {
      alert('Error deleting snippet');
    }
  };

  const runCode = async () => {
    setLoading(true);
    setOutput('Running...');
    setIsError(false);
    try {
      const res = await axios.post('https://ai-code-sandbox.onrender.com/api/code/run', { code, language });
      setOutput(res.data.output);
      setIsError(res.data.isError);
      console.log('isError value:', res.data.isError);
    } catch (err) {
      setIsError(true);
      setOutput('Error: ' + err.message);
    }
    setLoading(false);
  };

  const askAI = async () => {
    setLoading(true);
    setAiResponse('Thinking...');
    try {
      const fullPrompt = `Here is my code:\n\`\`\`${language}\n${code}\n\`\`\`\n\n${prompt}`;
      const res = await axios.post('https://ai-code-sandbox.onrender.com/api/ai/chat', { prompt: fullPrompt });
      setAiResponse(res.data.response);
    } catch (err) {
      setAiResponse('Error: ' + err.message);
    }
    setLoading(false);
  };

  const login = async () => {
    try {
      const res = await axios.post('https://ai-code-sandbox.onrender.com/api/auth/login', {
        email,
        password: authPassword
      });
      setToken(res.data.token);
      setUsername(res.data.username);
      setIsLoggedIn(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  const register = async () => {
    try {
      const res = await axios.post('https://ai-code-sandbox.onrender.com/api/auth/register', {
        username: authUsername,
        email,
        password: authPassword
      });
      setToken(res.data.token);
      setUsername(res.data.username);
      setIsLoggedIn(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken('');
    setUsername('');
  };

  const fixCode = async () => {
    setLoading(true);
    setAiResponse('Fixing your code...');
    try {
      const res = await axios.post('https://ai-code-sandbox.onrender.com/api/ai/fix', {
        code,
        language,
        error: output
      });
      setCode(res.data.fixedCode);
      setAiResponse('✅ Code fixed! Click Run to test it.');
      setIsError(false);
    } catch (err) {
      setAiResponse('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>AI Code Sandbox</h1>

      {!isLoggedIn ? (
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-tabs">
              <button
                className={authMode === 'login' ? 'active-tab' : ''}
                onClick={() => setAuthMode('login')}
              >Login</button>
              <button
                className={authMode === 'register' ? 'active-tab' : ''}
                onClick={() => setAuthMode('register')}
              >Register</button>
            </div>

            {authMode === 'register' && (
              <input
                type="text"
                placeholder="Username"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <button onClick={authMode === 'login' ? login : register}>
              {authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="user-bar">
            <span>👋 Welcome, <b>{username}</b>!</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>

          <div className="toolbar">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
            </select>
            <button onClick={runCode} disabled={loading}>
              {loading ? <><span className="loading"></span>Running...</> : '▶ Run Code'}
            </button>
            <input
              type="text"
              placeholder="Snippet title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
            <button onClick={saveSnippet} className="save-btn">💾 Save</button>
            <button onClick={() => setShowSnippets(!showSnippets)} className="snippets-btn">
              📂 {showSnippets ? 'Hide Snippets' : 'My Snippets'}
            </button>
          </div>

          {showSnippets && (
            <div className="snippets-container">
              <h3>Saved Snippets</h3>
              {snippets.length === 0 && <p>No snippets saved yet!</p>}
              {snippets.map((snippet) => (
                <div key={snippet._id} className="snippet-item">
                  <span className="snippet-lang">{snippet.language}</span>
                  <span className="snippet-title">{snippet.title}</span>
                  <button onClick={() => { setCode(snippet.code); setLanguage(snippet.language); setShowSnippets(false); }} className="load-btn">Load</button>
                  <button onClick={() => deleteSnippet(snippet._id)} className="delete-btn">🗑️</button>
                </div>
              ))}
            </div>
          )}

          <div className="editor-container">
            <Editor
              height="300px"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
              }}
            />
          </div>

          <div className="output-container">
  <h3>Output</h3>
  <pre className={isError ? 'error-output' : 'success-output'}>{output}</pre>
  {isError && (
    <button onClick={fixCode} disabled={loading} className="fix-btn">
      {loading ? <><span className="loading"></span>Fixing...</> : '🔧 Fix with AI'}
    </button>
  )}
</div>
          <div className="ai-container">
            <input
              type="text"
              placeholder="Ask AI about your code..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={askAI} disabled={loading}>
              {loading ? <><span className="loading"></span>Thinking...</> : 'Ask AI'}
            </button>
          </div>

          <div className="ai-response">
            <h3>AI Response</h3>
            <pre>{aiResponse}</pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;