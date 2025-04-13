import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { type Field, type TrackedEvent } from './App.tsx'

import './index.css'
import { isValidAutomergeUrl, Repo } from '@automerge/automerge-repo'
import { BrowserWebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"
import { RepoContext } from '@automerge/automerge-repo-react-hooks'

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
  storage: new IndexedDBStorageAdapter(),
})

const initialFields: Field[] = [
  { field_id: 'patrol_name', field_name: 'Patrol Name', control_type: 'input' },
  { field_id: 'interaction_type', field_name: 'Interaction Type', control_type: 'select', predefined_values: ['Check In', 'Check Out', 'Score', 'Other'] },
  { field_id: 'score', field_name: 'Score', control_type: 'number' } // Changed 'Score' field to be of type 'number'
];

const rootDocUrl = `${document.location.hash.substring(1)}`
let handle
if (isValidAutomergeUrl(rootDocUrl)) {
  handle = repo.find(rootDocUrl)
} else {
  handle = repo.create<TrackedEvent>({ fields: initialFields, interactions: [] })
}
const docUrl = document.location.hash = handle.url

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  </React.StrictMode>,
)
