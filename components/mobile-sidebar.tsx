interface SidebarProps {
  isPro: boolean;
  apiLimitCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isPro, apiLimitCount }) => {
  return (
    <div>
      <p>Pro Status: {isPro ? "Yes" : "No"}</p>
      <p>API Limit: {apiLimitCount}</p>
    </div>
  );
};
