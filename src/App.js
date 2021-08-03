import './App.css';
import FileManager from './components/FileManager/FileManager';

export const API = "/reactfm/api/index.php";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FileManager />
      </header>
    </div>
  );
}

export default App;
