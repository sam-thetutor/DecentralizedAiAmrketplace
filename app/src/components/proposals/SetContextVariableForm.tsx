import React from 'react';
import { ButtonSm, FormGroup, ProposalData } from './CreateProposalPopup';

interface SetContextVariableFormProps {
    proposalForm: ProposalData;
    handleContextVariableChange: (
        index: number,
        field: 'key' | 'value',
        value: string,
      ) => void,
    removeContextVariable: (index: number) => void,
    addContextVariable: () => void,
}

export default function SetContextVariableForm({
    proposalForm,
    handleContextVariableChange,
    removeContextVariable,
    addContextVariable,
}: SetContextVariableFormProps) {
  return (
    <>
      {proposalForm.contextVariables.map((variable: { key: string; value: string }, index: number) => (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          <FormGroup>
            <label>Key</label>
            <input
              type="text"
              value={variable.key}
              onChange={(e) =>
                handleContextVariableChange(index, 'key', e.target.value)
              }
              required
            />
          </FormGroup>
          <FormGroup>
            <label>Value</label>
            <input
              type="text"
              value={variable.value}
              onChange={(e) =>
                handleContextVariableChange(index, 'value', e.target.value)
              }
              required
            />
          </FormGroup>
          <ButtonSm
            type="button"
            onClick={() => removeContextVariable(index)}
            style={{ background: '#666', marginBottom: '1rem' }}
          >
            Remove
          </ButtonSm>
        </div>
      ))}
      <ButtonSm type="button" onClick={addContextVariable}>
        Add Variable
      </ButtonSm>
    </>
  );
}
