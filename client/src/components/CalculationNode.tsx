import React, { useState } from 'react';
import { Calculation, calculationAPI } from '../api';
import OperationForm from './OperationForm';

interface CalculationNodeProps {
  calculation: Calculation & { children?: Calculation[] };
  onOperationAdded: (calculation: Calculation) => void;
  isLoggedIn?: boolean;
}

const CalculationNode: React.FC<CalculationNodeProps> = ({
  calculation,
  onOperationAdded,
  isLoggedIn = true,
}) => {
  const [showForm, setShowForm] = useState(false);

  const handleOperationAdded = (newCalc: Calculation) => {
    onOperationAdded(newCalc);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div
      className={`calculation-node ${
        calculation.is_starting_number ? 'starting-number' : 'child'
      }`}
    >
      <div className="calculation-header">
        <div className="calculation-info">
          <div className="calculation-result">= {calculation.result}</div>
          {!calculation.is_starting_number && calculation.operation && (
            <div className="calculation-expression">
              Previous result {calculation.operation} {calculation.operand}
            </div>
          )}
          <div className="calculation-meta">
            By {calculation.username} • {formatDate(calculation.created_at)}
          </div>
        </div>
        {isLoggedIn && (
          <button
            className="add-operation-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Operation'}
          </button>
        )}
      </div>

      {showForm && isLoggedIn && (
        <OperationForm
          parentId={calculation.id}
          onOperationAdded={handleOperationAdded}
        />
      )}

      {calculation.children && calculation.children.length > 0 && (
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          {calculation.children.map((child) => (
            <CalculationNode
              key={child.id}
              calculation={child}
              onOperationAdded={onOperationAdded}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculationNode;
