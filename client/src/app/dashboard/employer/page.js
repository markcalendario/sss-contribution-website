"use client";

import {
  Content,
  DashboardContent,
  DashboardTitle
} from "@/app/dashboard/layout.js";
import DateAndTimeCard from "@/components/DateAndTimeCard/DateAndTimeCard";
import { FullPageLoader } from "@/components/Loaders/Loaders";
import { VerticalTable } from "@/components/Table/Table";
import Welcomer from "@/components/Welcomer/Welcomer";
import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import styles from "./page.module.scss";

const EmployerContext = createContext();

export default function EmployerDashboard() {
  const [employerInfo, setEmployerInfo] = useState(null);

  const getEmployerInfo = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/accounts/employer/info`,
      { credentials: "include" }
    );

    if (!response.ok) {
      return alert("An error occured while getting your information.");
    }

    const result = await response.json();

    if (!result.success) {
      return alert(result.message);
    }

    setEmployerInfo(result.data);
  };

  useEffect(() => {
    getEmployerInfo();
  }, []);

  if (employerInfo === null) {
    return <FullPageLoader text="Getting your information..." />;
  }

  return (
    <EmployerContext.Provider value={employerInfo}>
      <WelcomeAndTime />
      <MemberInformation />
    </EmployerContext.Provider>
  );
}

function WelcomeAndTime() {
  const { business_name } = useContext(EmployerContext);

  return (
    <DashboardContent id={styles.dateAndTime}>
      <Content className={styles.content}>
        <Welcomer
          className={styles.welcomer}
          name={business_name}
          role="employer"
        />
        <DateAndTimeCard className={styles.dateTimeCard} />
      </Content>
    </DashboardContent>
  );
}

function MemberInformation() {
  return (
    <DashboardContent>
      <DashboardTitle>
        <h1>Your Information</h1>
      </DashboardTitle>
      <Content>
        <BasicInformation />
        <ContactInformation />
      </Content>
    </DashboardContent>
  );
}

function BasicInformation() {
  const { sss_no, tin, payor_type } = useContext(EmployerContext);

  return (
    <Fragment>
      <VerticalTable>
        <thead>
          <tr>
            <th colSpan={2}>Basic Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>SSS Number</th>
            <td>{sss_no}</td>
          </tr>
          <tr>
            <th>TIN</th>
            <td>{tin}</td>
          </tr>
          <tr>
            <th>Employer Type</th>
            <td>{payor_type.toUpperCase()}</td>
          </tr>
        </tbody>
      </VerticalTable>
    </Fragment>
  );
}

function ContactInformation() {
  const { address, zip, mobile, telephone, email, website } =
    useContext(EmployerContext);

  return (
    <Fragment>
      <VerticalTable>
        <thead>
          <tr>
            <th colSpan={2}>Contact Information</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Complete Address</th>
            <td>{address}</td>
          </tr>
          <tr>
            <th>Zip Code</th>
            <td>{zip}</td>
          </tr>
          <tr>
            <th>Mobile Number</th>
            <td>{mobile}</td>
          </tr>
          <tr>
            <th>Telephone Number</th>
            <td>{telephone}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>{email}</td>
          </tr>
          <tr>
            <th>Website</th>
            <td>
              <a href={website}>{website}</a>
            </td>
          </tr>
        </tbody>
      </VerticalTable>
    </Fragment>
  );
}
