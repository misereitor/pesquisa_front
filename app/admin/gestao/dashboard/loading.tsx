import { Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Line One - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton variant="rectangular" height={100} className="rounded-xl" />
        <Skeleton variant="rectangular" height={100} className="rounded-xl" />
        <Skeleton variant="rectangular" height={100} className="rounded-xl" />
        <Skeleton variant="rectangular" height={100} className="rounded-xl" />
      </div>

      {/* Line Two - Bar Chart? */}
      <div className="w-full">
        <Skeleton variant="rectangular" height={300} className="rounded-xl" />
      </div>

      {/* Line Three - Table/List? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton variant="rectangular" height={300} className="rounded-xl" />
        <Skeleton variant="rectangular" height={300} className="rounded-xl" />
      </div>

      {/* Line Four/Five - Graphs */}
      <div className="w-full">
        <Skeleton variant="rectangular" height={400} className="rounded-xl" />
      </div>
    </div>
  );
}
