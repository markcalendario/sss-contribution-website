import { Fragment } from "react";
import { Content, DashboardContent, DashboardTitle } from "../../layout";
import DateAndTimeCard from "@/components/DateAndTimeCard/DateAndTimeCard";
import Highlight from "@/components/Highlight/Highlight";
import { VerticalTable } from "@/components/Table/Table";
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
        <VerticalTable>
          <tbody>
            <tr>
              <th>July</th>
              <td>
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>August</th>
              <td>
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>September</th>
              <td>
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>October</th>
              <td>
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>November</th>
              <td>
                <Input placeholder="Amount" />
              </td>
            </tr>
            <tr>
              <th>December</th>
              <td>
                <Input placeholder="Amount" />
              </td>
            </tr>
          </tbody>
        </VerticalTable>
        <Button className="bg-green text-slate">Finalize and Submit</Button>
      </Content>
    </DashboardContent>
  );
}
