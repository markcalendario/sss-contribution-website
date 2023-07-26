import {
  EmployerPageProtection,
  LoggedInPageProtection
} from "@/components/RouteProtections/RouteProtections";
import { DashboardLayout, Main, Navigations } from "../layout";

export default function EmployerDashboardLayout({ children }) {
  const asideLinks = [
    {
      link: "/dashboard/employer/",
      icon: "fa fa-home",
      title: "Home"
    },
    {
      link: "/dashboard/employer/history/",
      icon: "fa fa-history",
      title: "SSS/EC Contribution History"
    },
    {
      link: "/dashboard/employer/contribute/",
      icon: "fa fa-file",
      title: "File an SSS/EC Contribution"
    },
    {
      link: "/dashboard/employer/pay/",
      icon: "fa fa-hourglass-half",
      title: "Pending Payment"
    }
  ];

  return (
    <LoggedInPageProtection>
      <EmployerPageProtection>
        <DashboardLayout>
          <Navigations asideLinks={asideLinks} />
          <Main>{children}</Main>
        </DashboardLayout>
      </EmployerPageProtection>
    </LoggedInPageProtection>
  );
}
