import { HorizontalMenuMode } from '../types';

import Horizontal from './Horizontal';
import Vertical from './Vertical';

const ReversedHorizontalMix = () => {
  return [
    <Vertical key="vertical" />,

    <Horizontal
      key="ReversedHorizontalMix "
      mode={HorizontalMenuMode.FirstLevel}
    />
  ];
};

export default ReversedHorizontalMix;
