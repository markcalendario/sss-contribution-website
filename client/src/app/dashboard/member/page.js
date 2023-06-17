import { Fragment } from "react";
import { Content, DashboardContent, DashboardTitle } from "../layout";
import Welcomer from "@/components/Welcomer/Welcomer";
import DateAndTimeCard from "@/components/DateAndTimeCard/DateAndTimeCard";
import styles from "./page.module.scss";
import Table from "@/components/Table/Table";
import { VerticalTable } from "@/components/Table/Table";

export default function MemberDashboard() {
  return (
    <Fragment>
      <WelcomeAndTime />
      <MemberInformation />
    </Fragment>
  );
}

function WelcomeAndTime() {
  return (
    <DashboardContent id={styles.dateAndTime}>
      <Content className={styles.content}>
        <Welcomer className={styles.welcomer} />
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
            <td>649410110</td>
          </tr>
          <tr>
            <th>CRN</th>
            <td>00649410110</td>
          </tr>
          <tr>
            <th>TIN</th>
            <td>9500411268755</td>
          </tr>
          <tr>
            <th>Payor Type</th>
            <td>Self-Employed</td>
          </tr>
        </tbody>
      </VerticalTable>
    </Fragment>
  );
}

function ContactInformation() {
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
            <td>172 Julian Felipe Street, Sangandaan, Caloocan City</td>
          </tr>
          <tr>
            <th>Zip Code</th>
            <td>1403</td>
          </tr>
          <tr>
            <th>Mobile Number</th>
            <td>+639063472117</td>
          </tr>
          <tr>
            <th>Telephone Number</th>
            <td>(02) 45634742</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>markcalendario@gmail.com</td>
          </tr>
        </tbody>
      </VerticalTable>
    </Fragment>
  );
}
