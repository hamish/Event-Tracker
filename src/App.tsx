import '@picocss/pico/css/pico.min.css';
import './App.css';
import { useDocument } from '@automerge/automerge-repo-react-hooks';
import { useState } from 'react';
import type { AutomergeUrl } from '@automerge/automerge-repo';

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

function App({ docUrl }: { docUrl: AutomergeUrl }) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [doc, changeDoc] = useDocument<TrackedEvent>(docUrl) || {};

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  const handleNewInteraction = () => {
    const newInteraction: Partial<Interaction> = {};
    doc?.fields.forEach(field => {
      const fieldValue = formValues[field.field_id] || "";
      newInteraction[field.field_id] = fieldValue;
    });
    changeDoc?.(d => d.interactions.unshift({
      ...newInteraction,
      interaction_time: new Date(),
    } as Interaction));

    setFormValues(prevValues => {
      const updatedValues = { ...prevValues };
      doc?.fields.forEach(field => {
        if (field.field_id === 'patrol_name' || field.field_id === 'score') {
          updatedValues[field.field_id] = "";
        }
      });
      return updatedValues;
    });
  };

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
                        className={`button ${formValues[field.field_id] === value ? 'selected' : ''}`}
                        onClick={() => handleInputChange(field.field_id, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.control_type === 'number' ? 'number' : 'text'}
                    value={formValues[field.field_id] || ''}
                    onChange={(e) => handleInputChange(field.field_id, e.target.value)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={handleNewInteraction}>
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
        <p>
          <a href={`${import.meta.env.BASE_URL}/`}>Create a New Event</a>
        </p>
      </footer>
    </>
  );
}

export default App;
