'use client';

import { BounceLoader } from 'react-spinners';

export default function ErrorPage() {
  return (
    <div className=" flex flex-col items-center mt-12">
      <div>
        <BounceLoader />
      </div>
      <div className=" font-bold my-2">There is something wrong...</div>
    </div>
  );
}
