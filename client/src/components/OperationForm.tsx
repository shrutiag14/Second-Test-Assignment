import React, { useState } from 'react';
import { Calculation, calculationAPI } from '../api';

interface OperationFormProps {
  parentId: number;
  onOperationAdded: (calculation: Calculation) => void;
}

const OperationForm: React.FC<OperationFormProps> = ({
  parentId,
  onOperationAdded,
}) => {
  const [operation, setOperation] = useState('+');
  const [operand, setOperand] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const calculation = await calculationAPI.addOperation(
        parentId,
        operation,
        parseFloat(operand)
      );
      onOperationAdded(calculation);
      setOperand('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add operation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operation-form">
      <form onSubmit={handleSubmit}>
        <div className="operation-form-row">
          <div className="form-group">
            <label htmlFor="operation">Operation</label>
            <select
              id="operation"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="+">+ Addition</option>
              <option value="-">- Subtraction</option>
              <option value="*">× Multiplication</option>
              <option value="/">÷ Division</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="operand">Number</label>
            <input
              type="number"
              id="operand"
              value={operand}
              onChange={(e) => setOperand(e.target.value)}
              placeholder="Enter number..."
              required
              step="any"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default OperationForm;
