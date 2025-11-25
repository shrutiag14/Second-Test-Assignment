import React, { useState } from 'react';
import { Calculation, calculationAPI } from '../api';

interface NewCalculationProps {
  onCalculationCreated: (calculation: Calculation) => void;
}

const NewCalculation: React.FC<NewCalculationProps> = ({ onCalculationCreated }) => {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const calculation = await calculationAPI.createStartingNumber(parseFloat(number));
      onCalculationCreated(calculation);
      setNumber('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create calculation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-calculation-form">
      <h3>Start a New Calculation</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="number">Starting Number</label>
          <input
            type="number"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a number..."
            required
            step="any"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Starting Number'}
        </button>
      </form>
    </div>
  );
};

export default NewCalculation;
