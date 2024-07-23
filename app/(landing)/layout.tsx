const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen bg-[#1E1E24]">
      <main className="h-full overflow-auto">
        <div className="mx-auto max-w-screen-xl h-full">{children}</div>
      </main>
    </div>
  );
};

export default LandingLayout;
