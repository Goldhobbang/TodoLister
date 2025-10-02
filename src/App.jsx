import { useState, useEffect } from 'react';
import "./App.css";

function App() {
  // --- State Hooks ---

  // 입력창의 텍스트를 관리하는 state
  const [text, setText] = useState('');

  // 할 일 목록을 관리하는 state
  // 1. 초기값을 localStorage에서 불러오도록 수정
  // 2. 데이터 구조를 { id, text, completed } 객체로 변경
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('todo-items');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // '뒤로가기' 기능을 위해 이전 상태들을 저장하는 state
  const [history, setHistory] = useState([]);

  // --- useEffect Hook for Persistence ---

  // items state가 변경될 때마다 localStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem('todo-items', JSON.stringify(items));
  }, [items]);

  // --- Helper Functions ---

  // 상태를 업데이트하면서 동시에 history에 이전 상태를 기록하는 함수
  const updateItems = (newItems) => {
    setHistory([...history, items]); // 현재 상태를 history에 추가
    setItems(newItems);
  };

  // --- Event Handlers ---

  // 할 일 추가 함수
  const handleAddItem = () => {
    if (text.trim() !== '') {
      // 새로운 아이템 객체 생성 (고유 id 추가)
      const newItem = {
        id: Date.now(), // 중복되지 않는 고유한 id 생성
        text: text,
        completed: false
      };
      updateItems([...items, newItem]);
      setText(''); // 입력창 비우기
    }
  };

  // 입력창 텍스트 변경 핸들러
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // 특정 할 일 삭제 함수 (index 대신 고유 id 사용)
  const handleDeleteItem = (idToDelete) => {
    const newItems = items.filter(item => item.id !== idToDelete);
    updateItems(newItems);
  };

  // 전체 삭제 함수
  const handleDeleteAll = () => {
    updateItems([]);
  };

  const handleToggleComplete = (idToToggle) => {
    const newItems = items.map(item =>
      item.id === idToToggle ? { ...item, completed: !item.completed } : item
    );
    setItems(newItems);
  };


  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setItems(previousState);
      setHistory(history.slice(0, -1)); 
    }
  };


  return (
    <div>
      <h1>할일 리스트!</h1>
      <div className="controls">
        <button onClick={handleUndo} disabled={history.length === 0} className="undo-btn">
          뒤로가기
        </button>
        <button onClick={handleDeleteAll} className="delete-all-btn">
          전체 삭제
        </button>
      </div>
      
      <div className="input-area">
        <input type="text" value={text} onChange={handleTextChange} placeholder="할 일 입력" />
        <button onClick={handleAddItem} disabled={!text.trim()}>추가</button>
      </div>

      <ol>
        {items.map((item) => (
          <li key={item.id} className={item.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleComplete(item.id)}
            />
            <span className="item-text">{item.text}</span>
            <button onClick={() => handleDeleteItem(item.id)} className="delete-item-btn">삭제</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;