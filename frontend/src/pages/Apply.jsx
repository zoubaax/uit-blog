import JoinForm from '../components/JoinForm';

const Apply = () => {
  return (
    <div className="bg-slate-50/60 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      {/* Header Section */}
      <header className="pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 px-4 max-w-4xl mx-auto text-center">
        <div className="reveal-element space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Join UIT Club
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Be part of our university engineering & research collective. Complete this quick form to get started.
          </p>
        </div>
      </header>

      {/* Form Section */}
      <main className="max-w-2xl mx-auto px-3.5 sm:px-6 pb-20">
        <div className="reveal-element">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-7 md:p-10 transition-all">
            <JoinForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Apply;
