import { Radio } from '@geist-ui/react';

interface EstimatePickerParams {
  value: string;
  onChange: (value: string) => void;
}

const EstimatePicker = ({ value, onChange }: EstimatePickerParams): JSX.Element => {
  return (
    <Radio.Group value={value} onChange={onChange} useRow>
      {[...new Array(6)].map((_, index: number) => {
        const pointValue = index > 3 ? index + 2 * (index - 4) + 1 : index;
        return (
          <Radio key={index} value={String(pointValue)}>
            {pointValue}
          </Radio>
        );
      })}
    </Radio.Group>
  );
};

export default EstimatePicker;
