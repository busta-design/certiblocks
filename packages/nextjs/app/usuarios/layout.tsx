import { type ReactNode } from "react";
import { UserHeader } from "~~/components/headers/UsersHeader";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <UserHeader />
      {children}
    </div>
  );
};

export default UserLayout;
