import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { GAP_SIZE, DOT_COLOR } from '../../constant/Background';

export const SideBar = observer(() => {
  const [gapSize, setGapSize] = useState(GAP_SIZE);
  const [dotColor, setDotColor] = useState(DOT_COLOR);
  return <div className="SideBar bg-white p-1 shadow-lg"></div>;
});
