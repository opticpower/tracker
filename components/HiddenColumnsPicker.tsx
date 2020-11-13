import { Button } from '@geist-ui/react';
import styled from 'styled-components';

interface HiddenColumnsPickerParams {
  columns: string[];
  showColumn: (columns: string) => void;
}

const HiddenColumnsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  margin: 0 20px;
`;

const HiddenColumnsPicker = ({ columns, showColumn }: HiddenColumnsPickerParams): JSX.Element => {
  return (
    Boolean(columns.length) && (
      <HiddenColumnsContainer>
        Hidden columns:
        {columns.map(column => (
          <Button size="small" key={`hidden-key-${column}`} onClick={() => showColumn(column)}>
            {column}
          </Button>
        ))}
      </HiddenColumnsContainer>
    )
  );
};

export default HiddenColumnsPicker;
