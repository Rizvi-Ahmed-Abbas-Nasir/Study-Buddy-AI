const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid place-items-center h-screen bg-[#1E1E24]">
      <main className="overflow-auto">
        <div className="mx-auto max-w-screen-xl">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
