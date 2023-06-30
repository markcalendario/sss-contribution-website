import {
  LoggedInPageProtection,
  MemberPageProtection
} from "@/components/RouteProtections/RouteProtections";
import { DashboardLayout, Main, Navigations } from "../layout";

export default function MemberDashboardLayout({ children }) {
  const asideLinks = [
    {
      link: `/dashboard/member`,
      icon: "fa fa-home",
      title: "Home"
    },
    {
      link: `/dashboard/member/history`,
      icon: "fa fa-history",
      title: "SSS/EC Contribution History"
    },
    {
      link: `/dashboard/member/contribute`,
      icon: "fa fa-file",
      title: "File an SSS/EC Contribution"
    },
    {
      link: `/dashboard/member/pay`,
      icon: "fa fa-hourglass-half",
      title: "Pending Payment"
    }
  ];

  return (
    <LoggedInPageProtection>
      <MemberPageProtection>
        <DashboardLayout>
          <Navigations asideLinks={asideLinks} />
          <Main>{children}</Main>
        </DashboardLayout>
      </MemberPageProtection>
    </LoggedInPageProtection>
  );
}
