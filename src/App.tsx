import automergeLogo from '/automerge.png'
import '@picocss/pico/css/pico.min.css'
import './App.css'
import { useDocument } from '@automerge/automerge-repo-react-hooks'
import { updateText } from '@automerge/automerge/next'
import type { AutomergeUrl } from '@automerge/automerge-repo'
import { useRef } from 'react';

export interface Interaction {
  patrol_name: string;
  interaction_time:Date;
  done: boolean;
}

export interface TrackedEvent {
  interactions: Interaction[];
}


function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const patrolNameRef = useRef<HTMLInputElement>(null);

  const [doc, changeDoc] = useDocument<TrackedEvent>(docUrl)

  return (
    <>
      <header>
        <h1>
          Event Tracker
        </h1>
      </header>

    <input ref={patrolNameRef} name='patrol_name' />

      <button type="button" onClick={() => {
        console.log("button");
        changeDoc(d =>
          d.interactions.unshift({
            patrol_name: patrolNameRef.current?.value || "",
            interaction_time: new Date(),
            done: false
            
          })
        );
      }}>
        <b>+</b> New Interaction
      </button>

      <div id='task-list'>

      {doc && doc.interactions?.map(({ patrol_name, interaction_time, done }, index) =>
        <div className='task' key={index}>
          <input
            type="checkbox"
            checked={done}
            onChange={() => changeDoc(d => {
              d.interactions[index].done = !d.interactions[index].done;
            })}
          />

          <input type="text"
            placeholder='What needs doing?' value={patrol_name || ''}
            onChange={(e) => changeDoc(d => {
              // Use Automerge's updateText for efficient multiplayer edits
              // (as opposed to replacing the whole patrol_name on each edit)
              updateText(d.interactions[index], ['patrol_name'], e.target.value)
            })}
            style={done ? {textDecoration: 'line-through'}: {}}
          />
          {interaction_time.toTimeString()}
        </div>)
      }

      </div>



      <footer>
        <p className="read-the-docs">Powered by Automerge + Vite + React + TypeScript
        </p>
      </footer>
    </>
  )
}

export default App
