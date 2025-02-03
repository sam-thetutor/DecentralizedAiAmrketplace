import React, { useState } from 'react';
import { styled } from 'styled-components';
import ActionsDropdown, { ActionTypes } from './ActionsDropdown';
import CrossContractCallForm from './CrossContractCallForm';
import TransferForm from './TransferForm';
import SetContextVariableForm from './SetContextVariableForm';
import ChangeApprovalsNeededForm from './ChangeApprovalsNeededForm';
import MaxActiveProposalsForm from './MaxActiveProposalsForm';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  color: white;
  max-height: 90vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  h2 {
    padding-bottom: 0.5rem;
    margin: 0;
    position: sticky;
    top: 0;
    background: #1e1e1e;
    z-index: 1;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #444;
    background-color: #333;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ButtonSm = styled.button`
  color: white;
  padding: 0.25em 1em;
  margin: 0.25em;
  border-radius: 8px;
  font-size: 1rem;
  background: #5dbb63;
  cursor: pointer;
  justify-content: center;
  display: flex;
  border: none;
  outline: none;
`;

export interface ProposalData {
  actionType: string;
  contractId: string;
  methodName: string;
  arguments: { key: string; value: string }[];
  deposit: string;
  receiverId: string;
  amount: string;
  contextVariables: { key: string; value: string }[];
  minApprovals: string;
  maxActiveProposals: string;
}

export interface CreateProposalPopupProps {
  onClose: () => void;
  onSuccess: (proposalForm: ProposalData) => Promise<void>;
}


export default function CreateProposalPopup({ onClose, onSuccess }: CreateProposalPopupProps) {
  const [proposalForm, setProposalForm] = useState({
    actionType: 'Cross contract call',
    contractId: 'b77ix-eeaaa-aaaaa-qaada-cai',
    methodName: 'Add New AI Model',
    arguments: [{ key: '', value: '' }],
    deposit: '',
    receiverId: '',
    amount: '',
    contextVariables: [{ key: '', value: '' }],
    minApprovals: '',
    maxActiveProposals: '',
    inputType: '',
    inputDescription: '',
    outputType: '',
    outputDescription: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setProposalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArgumentChange = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    setProposalForm((prev) => {
      const newArgs = [...prev.arguments];
      newArgs[index] = {
        ...newArgs[index],
        [field]: value,
      };
      return {
        ...prev,
        arguments: newArgs,
      };
    });
  };

  const addContextVariable = () => {
    setProposalForm((prev) => ({
      ...prev,
      contextVariables: [...prev.contextVariables, { key: '', value: '' }],
    }));
  };

  const removeContextVariable = (index: number) => {
    setProposalForm((prev) => ({
      ...prev,
      contextVariables: prev.contextVariables.filter((_, i) => i !== index),
    }));
  };

  const addArgument = () => {
    setProposalForm((prev) => ({
      ...prev,
      arguments: [...prev.arguments, { key: '', value: '' }],
    }));
  };

  const removeArgument = (index: number) => {
    setProposalForm((prev) => ({
      ...prev,
      arguments: prev.arguments.filter((_, i) => i !== index),
    }));
  };

  const handleContextVariableChange = (
    index: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    setProposalForm((prev: any) => {
      const newVariables = [...prev.contextVariables];
      newVariables[index] = {
        ...newVariables[index],
        [field]: value,
      };
      return {
        ...prev,
        contextVariables: newVariables,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSuccess(proposalForm);
    onClose();
    setProposalForm({
      actionType: 'Cross contract call',
      contractId: '',
      methodName: '',
      arguments: [{ key: '', value: '' }],
      deposit: '',
      receiverId: '',
      amount: '',
      contextVariables: [{ key: '', value: '' }],
      minApprovals: '',
      maxActiveProposals: '',
      inputType: '',
      inputDescription: '',
      outputType: '',
      outputDescription: '',
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Create New Proposal</h2>
        <form onSubmit={handleSubmit}>
          <ActionsDropdown
            actionType={proposalForm.actionType}
            handleInputChange={handleInputChange}
          />
          {proposalForm.actionType === ActionTypes.CROSS_CONTRACT_CALL && (
            <CrossContractCallForm
              proposalForm={proposalForm}
              handleInputChange={handleInputChange}
              handleArgumentChange={handleArgumentChange}
              removeArgument={removeArgument}
              addArgument={addArgument}
            />
          )}
          {proposalForm.actionType === ActionTypes.TRANSFER && (
            <TransferForm
              proposalForm={proposalForm}
              handleInputChange={handleInputChange}
            />
          )}

          {proposalForm.actionType === ActionTypes.SET_CONTEXT_VARIABLE && (
            <SetContextVariableForm
              proposalForm={proposalForm}
              handleContextVariableChange={handleContextVariableChange}
              removeContextVariable={removeContextVariable}
              addContextVariable={addContextVariable}
            />
          )}

          {proposalForm.actionType === ActionTypes.CHANGE_APPROVALS_NEEDED && (
            <ChangeApprovalsNeededForm
              proposalForm={proposalForm}
              handleInputChange={handleInputChange}
            />
          )}

          {proposalForm.actionType ===
            ActionTypes.CHANGE_MAX_ACTIVE_PROPOSALS && (
            <MaxActiveProposalsForm
              proposalForm={proposalForm}
              handleInputChange={handleInputChange}
            />
          )}

          <ButtonGroup>
            <ButtonSm
              type="button"
              onClick={onClose}
              style={{ background: '#666' }}
            >
              Cancel
            </ButtonSm>
            <ButtonSm type="submit">Create Proposal</ButtonSm>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}
