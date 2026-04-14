import { BookX } from 'lucide-react';

const EmptyState = ({ title = 'Nothing here yet', message = 'No data available.', icon }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
      {icon || <BookX className="h-10 w-10 text-slate-400 dark:text-slate-500" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
  </div>
);

export default EmptyState;
