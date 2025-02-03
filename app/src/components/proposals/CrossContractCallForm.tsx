import React from 'react';
import { ButtonSm, FormGroup, ProposalData } from './CreateProposalPopup';
import { styled } from 'styled-components';

const ScrollWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
`;

interface CrossContractCallFormProps {
  proposalForm: ProposalData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleArgumentChange: (index: number, field: 'key' | 'value', value: string) => void;
  removeArgument: (index: number) => void;
  addArgument: () => void;
}

export default function CrossContractCallForm({
  proposalForm,
  handleInputChange,
  handleArgumentChange,
  removeArgument,
  addArgument,
}: CrossContractCallFormProps) {
  return (
    <>
      <FormGroup>
        <label>Contract ID</label>
        <input
          type="text"
          name="contractId"
          value={proposalForm.contractId}
          onChange={handleInputChange}
          placeholder="Enter contract ID"
          required
          disabled
        />
      </FormGroup>

      <FormGroup>
        <label>Method Name</label>
        <input
          type="text"
          name="methodName"
          value={proposalForm.methodName}
          onChange={handleInputChange}
          placeholder="Enter method name"
          required
          disabled
        />
      </FormGroup>

      <FormGroup>
        <label>Agent Id</label>
        <input
          type="text"
          name="agentId"
          value={proposalForm.agentId}
          onChange={handleInputChange}
          placeholder="Enter Agent Id"
          required
        />
      </FormGroup>

      

    
{/* 
      <FormGroup>
        <label>Description</label>
        <textarea
          name="description"
          value={proposalForm.description}
          onChange={handleInputChange}
          placeholder="Enter  description about the Agent"
          rows={4}
          required
        />
      </FormGroup> */}

      <FormGroup>
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={proposalForm.amount}
          onChange={handleInputChange}
          placeholder="Enter agent price charge"
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Agent Expertise</label>
        <input
          type="text"
          name="expertise"
          value={proposalForm.expertise}
          onChange={handleInputChange}
          placeholder="Enter required expertise"
          required
        />
      </FormGroup>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Input Parameters</h3>
      <FormGroup>
        <label>Input Type</label>
        <input
          type="text"
          name="inputType"
          value={proposalForm.inputType}
          onChange={handleInputChange}
          placeholder="Enter input type"
          required
        />
      </FormGroup>
      <FormGroup>
        <label>Input Description</label>
        <textarea
          name="inputDescription"
          value={proposalForm.inputDescription}
          onChange={handleInputChange}
          placeholder="Enter input description"
          rows={3}
          required
        />
      </FormGroup>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Output Parameters</h3>
      <FormGroup>
        <label>Output Type</label>
        <input
          type="text"
          name="outputType"
          value={proposalForm.outputType}
          onChange={handleInputChange}
          placeholder="Enter output type"
          required
        />
      </FormGroup>
      <FormGroup>
        <label>Output Description</label>
        <textarea
          name="outputDescription"
          value={proposalForm.outputDescription}
          onChange={handleInputChange}
          placeholder="Enter output description"
          rows={3}
          required
        />
      </FormGroup>
    </>
  );
}
