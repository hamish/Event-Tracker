import './App.css';
import type { AutomergeUrl } from '@automerge/automerge-repo';
import Event from './Event';

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  return <Event docUrl={docUrl} />;
}

export default App;
