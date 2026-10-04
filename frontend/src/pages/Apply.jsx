import JoinForm from '../components/JoinForm';

const Apply = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-200">
      {/* Header Section */}
      <header className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800 mb-8 md:mb-12 text-center">
        <div className="reveal-element">
          <span className="inline-block px-3 py-1 bg-[#dbeafe] dark:bg-blue-950/60 text-[#2563eb] dark:text-blue-400 text-[10px] uppercase font-bold tracking-widest rounded border border-transparent dark:border-blue-800/40 mb-6">
            Membership
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold text-[#1e3a8a] dark:text-white leading-tight">
            Join UIT Club
          </h1>
        </div>
      </header>

      {/* Form Section */}
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <div className="reveal-element">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 p-8 md:p-12">
            <JoinForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Apply;
