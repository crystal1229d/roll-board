'use client';

import { useEffect, useState } from 'react';

const useHydrate = () => {
  const [isMount, setIsMount] = useState<boolean>(false);

  useEffect(() => {
    setIsMount(true);
  }, []);

  return isMount;
};

export default useHydrate;
