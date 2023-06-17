"use client";

import { Fragment, useState } from "react";
import { Content, DashboardContent, DashboardTitle } from "../../layout";
import DateAndTimeCard from "@/components/DateAndTimeCard/DateAndTimeCard";
import Highlight from "@/components/Highlight/Highlight";
import { HorizontalTable } from "@/components/Table/Table";
import { Input } from "@/components/FormFields/FormFields";
import styles from "./page.module.scss";
import Button from "@/components/Buttons/Buttons";

export default function Contribute() {
  return (
    <Fragment>
      <DateAndTimeCard />
      <ContributionFiling />
    </Fragment>
  );
}

function ContributionFiling() {
  return (
    <DashboardContent id={styles.contributionFiling}>
      <DashboardTitle>
        <h1>File a Contribution</h1>
      </DashboardTitle>
      <Content className={styles.content}>
        <Highlight tint="orange">
          <h1>Proceed with Caution</h1>
          <p>
            You are filing a contribution for the year{" "}
            <strong>
              <u>2023</u>
            </strong>
            . Put amount only for the month you only want to pay.
          </p>
        </Highlight>
        <HorizontalTable>
          <thead>
            <tr>
              <th>Month</th>
              <th>SSS Contribution</th>
              <th>EC Contribution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>July</th>
              <td data-head="SSS Contribution">
                <Input placeholder="Amount" />
              </td>
              <td data-head="EC Contribution">
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>August</th>
              <td data-head="SSS Contribution">
                <Input placeholder="Amount" />
              </td>
              <td data-head="EC Contribution">
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>September</th>
              <td data-head="SSS Contribution">
                <Input placeholder="Amount" />
              </td>
              <td data-head="EC Contribution">
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>October</th>
              <td data-head="SSS Contribution">
                <Input placeholder="Amount" />
              </td>
              <td data-head="EC Contribution">
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>November</th>
              <td data-head="SSS Contribution">
                <Input placeholder="Amount" />
              </td>
              <td data-head="EC Contribution">
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>December</th>
              <td data-head="SSS Contribution">
                <Input placeholder="Amount" />
              </td>
              <td data-head="EC Contribution">
                <Input placeholder="Amount" />
              </td>
            </tr>
          </tbody>
        </HorizontalTable>
        <Button className="bg-green text-slate">Finalize and Submit</Button>
      </Content>
    </DashboardContent>
  );
}
