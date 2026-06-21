import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useCalculateValue, valueQueries } from '../api/queries';
import styled from '@emotion/styled';

const Button = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 16px;
  font-family: sans-serif;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px; /* Matches the button */
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #0070f3; /* Matches the button primary color */
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

export default function Fib() {
  const [index, setIndex] = useState('');

  const { data: allIndices } = useQuery(valueQueries.allIndices());
  const { data: allIndexValues } = useQuery(
    valueQueries.availableIndexvalues(),
  );

  const { mutate } = useCalculateValue();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(index, {
      onSuccess: () => {
        setIndex('');
      },
      onError: () => {
        setIndex('');
        console.error('Error in submiting the index');
      },
    });
  };

  const renderIndexes = () => {
    return allIndices?.map((item) => item).join(', ');
  };

  const renderValues = () => {
    const obj = allIndexValues ?? {};
    const indexValues = Object.keys(obj).map((key) => {
      return { index: key, value: obj[key] };
    });
    return indexValues?.map((item) => {
      return (
        <div>
          For index {item.index}, I calculated {item.value}
        </div>
      );
    });
  };

  return (
    <div>
      This is for testing...
      <form onSubmit={submitHandler}>
        <FieldGroup>
          <Label>Enter your Index: </Label>
          <Input
            value={index}
            onChange={(event) => setIndex(event.target.value)}
          />
          <Button type="submit">Submit</Button>
        </FieldGroup>
      </form>
      <h3>Indexes I've seen: </h3>
      {renderIndexes()}
      <h3>Calculated Values: </h3>
      {renderValues()}
    </div>
  );
}
