import '@picocss/pico/css/pico.min.css'
import './App.css'
import { useDocument } from '@automerge/automerge-repo-react-hooks'
import type { AutomergeUrl } from '@automerge/automerge-repo'
import { useRef } from 'react';

export interface Interaction {
  patrol_name: string;
  interaction_type: string;
  interaction_time: Date;
}

export interface Field {
  field_name: string;
  control_type: 'input' | 'select' | 'number'; // Added 'number' control type
  predefined_values?: string[];
}

export interface TrackedEvent {
  fields: Field[];
  interactions: Interaction[];
}

function App({ docUrl, initialFields }: { docUrl: AutomergeUrl; initialFields: Field[] }) {
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({}); // Dynamic refs for fields

  const [doc, changeDoc] = useDocument<TrackedEvent>(docUrl) || {};

  return (
    <>
      <header>
        <h1>
          Event Tracker
        </h1>
      </header>

      <table>
        <tbody>
          {doc?.fields?.map((field, index) => (
            <tr key={index}>
              <td><label>{field.field_name}</label></td>
              <td>
                {field.control_type === 'select' ? (
                  <select
                    ref={(el) => (fieldRefs.current[field.field_name] = el)}
                    name={field.field_name}
                  >
                    {field.predefined_values?.map((value, idx) => (
                      <option key={idx} value={value}>{value}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    ref={(el) => (fieldRefs.current[field.field_name] = el)}
                    name={field.field_name}
                    type={field.control_type === 'number' ? 'number' : 'text'} // Handle 'number' control type
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={() => {
        changeDoc?.(d =>
          d.interactions.unshift({
            patrol_name: fieldRefs.current['Patrol Name']?.value || "",
            interaction_time: new Date(),
            interaction_type: fieldRefs.current['Interaction Type']?.value || ""
          })
        );
        Object.keys(fieldRefs.current).forEach(key => {
          if (fieldRefs.current[key]) {
            fieldRefs.current[key]!.value = "";
          }
        });
      }}>
        <b>+</b> New Interaction
      </button>

      <div id='task-list'>
        <table>
          <thead>
            <tr>
              {doc?.fields?.map((field, index) => (
                <th key={index}>{field.field_name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc?.interactions?.map((interaction, rowIndex) => (
              <tr key={rowIndex}>
                {doc.fields.map((field, colIndex) => (
                  <td key={colIndex}>{interaction[field.field_name.toLowerCase().replace(/ /g, '_')] || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer>
        <p className="read-the-docs">
          Powered by Automerge + Vite + React + TypeScript
        </p>
        <p>
          <a href="/event-tracker/">Create a New Event</a>
        </p>
      </footer>
    </>
  );
}

export default App;
