"use client";

import { Content, DashboardContent, DashboardTitle } from "@/app/dashboard/layout.js";
import DateAndTimeCard from "@/components/DateAndTimeCard/DateAndTimeCard";
import { FullPageLoader } from "@/components/Loaders/Loaders";
import { VerticalTable } from "@/components/Table/Table";
import Welcomer from "@/components/Welcomer/Welcomer";
import { Fragment, createContext, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";

const MemberContext = createContext();

export default function MemberDashboard() {
  const [memberInfo, setMemberInfo] = useState(null);

  const getIndividualMemberInfo = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/individual/info`, {
      credentials: "include"
    });

    if (!response.ok) {
      return alert("An error occured while getting your information.");
    }

    const result = await response.json();

    if (!result.success) {
      return alert(result.message);
    }

    setMemberInfo(result.data);
  };

  useEffect(() => {
    getIndividualMemberInfo();
  }, []);

  if (memberInfo === null) {
    return <FullPageLoader text="Getting your information..." />;
  }

  return (
    <MemberContext.Provider value={memberInfo}>
      <WelcomeAndTime />
      <MemberInformation />
    </MemberContext.Provider>
  );
}

function WelcomeAndTime() {
  const { first_name, middle_name, last_name, suffix } = useContext(MemberContext);

  return (
    <DashboardContent id={styles.dateAndTime}>
      <Content className={styles.content}>
        <Welcomer
          className={styles.welcomer}
          name={`${first_name} ${middle_name} ${last_name} ${suffix}`}
          role="individual member"
        />
        <DateAndTimeCard className={styles.dateAndTimeCard} />
      </Content>
    </DashboardContent>
  );
}

function MemberInformation() {
  return (
    <DashboardContent id={styles.memberInformation}>
      <DashboardTitle>
        <h1>Your Information</h1>
      </DashboardTitle>
      <Content className={styles.content}>
        <BasicInformation />
        <ContactInformation />
      </Content>
    </DashboardContent>
  );
}

function BasicInformation() {
  const { sss_no, crn, tin, payor_type } = useContext(MemberContext);

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
            <th>CRN</th>
            <td>{crn}</td>
          </tr>
          <tr>
            <th>TIN</th>
            <td>{tin}</td>
          </tr>
          <tr>
            <th>Payor Type</th>
            <td>{payor_type.toUpperCase()}</td>
          </tr>
        </tbody>
      </VerticalTable>
    </Fragment>
  );
}

function ContactInformation() {
  const { address, zip, mobile, telephone, email } = useContext(MemberContext);

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
        </tbody>
      </VerticalTable>
    </Fragment>
  );
}
