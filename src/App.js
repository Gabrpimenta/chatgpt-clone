import './normal.css';
import icon from './assets/images/openai-icon-505x512.png';
import './App.css';
import { useEffect, useState } from 'react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === 'gpt' && 'chatgpt'}`}>
      <div className='chat-message-center'>
        <div className={`avatar ${message.user === 'gpt' && 'chatgpt'}`}>
          {message.user === 'gpt' && (
            <img src={icon} className='icon' alt='chatgpticon' />
          )}
        </div>
        <div className='message'>{message.message}</div>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    getEngines();
  }, []);
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { message: 'How can I help you today?', user: 'gpt' },
    { message: 'Hi', user: 'me' },
  ]);
  const clearChat = () => {
    setChatLog([]);
  };
  const getEngines = () => {
    fetch('http://localhost:3080/models')
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: 'me', message: `${input}` }];
    await setInput('');
    setChatLog(chatLogNew);
    const messages = chatLogNew.map((message) => message.message).join(' ');
    const response = await fetch('http://localhost:3080/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messages,
      }),
    });
    const data = await response.json();
    await setChatLog([
      ...chatLogNew,
      { message: `${data.message}`, user: 'gpt' },
    ]);
  };
  return (
    <div className='App'>
      <aside className='sidemenu'>
        <div className='side-menu-button' onClick={clearChat}>
          <span>+</span>
          New chat
        </div>
      </aside>
      <section className='chatbox'>
        <div className='chat-log'>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={handleChange}
              rows='1'
              className='chat-input-textarea'
            ></input>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
