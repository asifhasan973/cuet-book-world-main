const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-amber-500 rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;
