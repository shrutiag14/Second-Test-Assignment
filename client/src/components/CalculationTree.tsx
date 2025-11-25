import React from 'react';
import { Calculation } from '../api';
import CalculationNode from './CalculationNode';

interface CalculationTreeProps {
  calculations: Calculation[];
  onOperationAdded: (calculation: Calculation) => void;
  isLoggedIn?: boolean;
}

const CalculationTree: React.FC<CalculationTreeProps> = ({
  calculations,
  onOperationAdded,
  isLoggedIn = true,
}) => {
  // Build tree structure
  const buildTree = () => {
    const map = new Map<number, Calculation & { children: Calculation[] }>();
    const roots: (Calculation & { children: Calculation[] })[] = [];

    // Initialize all nodes
    calculations.forEach((calc) => {
      map.set(calc.id, { ...calc, children: [] });
    });

    // Build parent-child relationships
    calculations.forEach((calc) => {
      const node = map.get(calc.id)!;
      if (calc.parent_id === null) {
        roots.push(node);
      } else {
        const parent = map.get(calc.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return roots;
  };

  const tree = buildTree();

  if (calculations.length === 0) {
    return (
      <div className="empty-state">
        <p>
          {isLoggedIn 
            ? "No calculations yet. Start by creating a starting number above!"
            : "No calculations yet. Login to start a new calculation!"}
        </p>
      </div>
    );
  }

  return (
    <div className="calculation-tree">
      <h2>Calculation Tree</h2>
      {tree.map((root) => (
        <CalculationNode
          key={root.id}
          calculation={root}
          onOperationAdded={onOperationAdded}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default CalculationTree;
