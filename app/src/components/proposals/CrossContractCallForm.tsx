import React from "react";
import { ButtonSm, FormGroup, ProposalData } from "./CreateProposalPopup";

interface CrossContractCallFormProps {
    proposalForm: ProposalData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleArgumentChange: (index: number, field: "key" | "value", value: string) => void;
    removeArgument: (index: number) => void;
    addArgument: () => void;
}

export default function CrossContractCallForm({
    proposalForm,
    handleInputChange,
    handleArgumentChange,
    removeArgument,
    addArgument
}: CrossContractCallFormProps) {
  return (
    <>
      <FormGroup>
        <label htmlFor="protocol">Protocol</label>
        <select
          id="protocol"
          name="protocol"
          value={proposalForm.protocol}
          onChange={handleInputChange}
          required
        >
          <option value="NEAR">NEAR</option>
          <option value="Starknet">Starknet</option>
        </select>
      </FormGroup>
      <FormGroup>
        <label htmlFor="contractId">Contract ID</label>
        <input
          type="text"
          id="contractId"
          name="contractId"
          value={proposalForm.contractId}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor="methodName">Method Name</label>
        <input
          type="text"
          id="methodName"
          name="methodName"
          value={proposalForm.methodName}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor="deposit">
          Deposit{' '}
          {proposalForm.protocol === 'NEAR' ? '(in octoNEAR)' : '(in STRK)'}
        </label>
        <input
          type="text"
          id="deposit"
          name="deposit"
          value={proposalForm.deposit}
          onChange={handleInputChange}
          placeholder="0"
          required
        />
      </FormGroup>
      {proposalForm.protocol === 'NEAR' && (
        <FormGroup>
          <label htmlFor="gas">Gas</label>
          <input
            type="text"
            id="gas"
            name="gas"
            value={proposalForm.gas}
            onChange={handleInputChange}
            placeholder="30000000000000"
            required
          />
        </FormGroup>
      )}
      <FormGroup>
        <label>Arguments</label>
        {proposalForm.arguments.map((arg: {key: string, value: string}, index: number) => (
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
                value={arg.key}
                onChange={(e) =>
                  handleArgumentChange(index, 'key', e.target.value)
                }
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Value</label>
              <input
                type="text"
                value={arg.value}
                onChange={(e) =>
                  handleArgumentChange(index, 'value', e.target.value)
                }
                required
              />
            </FormGroup>
            <ButtonSm
              type="button"
              onClick={() => removeArgument(index)}
              style={{ background: '#666', marginBottom: '1rem' }}
            >
              Remove
            </ButtonSm>
          </div>
        ))}
        <ButtonSm type="button" onClick={addArgument}>
          Add Argument
        </ButtonSm>
      </FormGroup>
    </>
  );
}
