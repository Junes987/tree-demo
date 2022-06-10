import React from 'react'
import Tree01 from './views/Tree01'

const App = () => {
  
  const onChange = (value) => {

  }

  return (
    <div className="App">
      <h2>Hello Tree</h2>
      <hr />
      <Tree01 
        onChange={onChange} 
        checkedIds={['1-0-0-0']} 
      />
    </div>
  );
}

export default App;
