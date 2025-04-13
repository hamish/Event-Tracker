import '@picocss/pico/css/pico.min.css';
import './App.css';
import { useDocument } from '@automerge/automerge-repo-react-hooks';
import { useRef } from 'react';
import type { AutomergeUrl } from '@automerge/automerge-repo'

export interface Interaction {
  patrol_name: string;
  interaction_type: string;
  interaction_time: Date;
  [key: string]: any; // Add this line to allow string indexing
}

export interface Field {
  field_id: string; // Unique identifier for the field
  field_name: string;
  control_type: 'input' | 'select' | 'number';
  predefined_values?: string[];
}

export interface TrackedEvent {
  fields: Field[];
  interactions: Interaction[];
}

function downloadCSV(interactions: Interaction[], fields: Field[]) {
  const headers = fields.map(field => field.field_name).concat('Interaction Time');
  const rows = interactions.map(interaction => {
    return fields.map(field => interaction[field.field_id] || '').concat(interaction.interaction_time ? new Date(interaction.interaction_time).toISOString() : '');
  });

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'interactions.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleButtonSelection(button: HTMLButtonElement) {
  const isSelected = button.classList.contains('selected');
  if (isSelected) {
    button.classList.remove('selected');
  } else {
    button.classList.add('selected');
  }
}

function App({ docUrl }: { docUrl: AutomergeUrl }) {
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
                  <div>
                    {field.predefined_values?.map((value, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (fieldRefs.current[field.field_id]) {
                            fieldRefs.current[field.field_id]!.value = value;
                          }
                          // Update the selected button's style
                          const buttons = document.querySelectorAll(`button[name='${field.field_id}']`);
                          buttons.forEach(button => button.classList.remove('selected')); // Reset all buttons
                          const selectedButton = buttons[idx] as HTMLButtonElement;
                          if (selectedButton) {
                            toggleButtonSelection(selectedButton);
                          }
                        }}
                        name={field.field_id} // Add name attribute for easier selection
                      >
                        {value}
                      </button>
                    ))}
                    <input
                      ref={(el) => (fieldRefs.current[field.field_id] = el)}
                      name={field.field_id}
                      type="hidden"
                    />
                  </div>
                ) : (
                  <input
                    ref={(el) => (fieldRefs.current[field.field_id] = el)}
                    name={field.field_id}
                    type={field.control_type === 'number' ? 'number' : 'text'}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={() => {
        const newInteraction: Partial<Interaction> = {};
        doc?.fields.forEach(field => {
          const fieldValue = fieldRefs.current[field.field_id]?.value || "";
          newInteraction[field.field_id] = fieldValue;
        });
        changeDoc?.(d => d.interactions.unshift({
          ...newInteraction,
          interaction_time: new Date(),
        } as Interaction));
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
              <th>Interaction Time</th> {/* New column header */}
            </tr>
          </thead>
          <tbody>
            {doc?.interactions?.map((interaction, rowIndex) => (
              <tr key={rowIndex}>
                {doc.fields.map((field, colIndex) => (
                  <td key={colIndex}>{interaction[field.field_id] || ''}</td>
                ))}
                <td>{interaction.interaction_time ? new Date(interaction.interaction_time).toLocaleString() : ''}</td> {/* New column data */}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={() => downloadCSV(doc?.interactions || [], doc?.fields || [])}>
          Download CSV
        </button>
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
