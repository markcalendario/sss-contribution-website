import { HorizontalTable, VerticalTable } from "@/components/Table/Table";
import { DashboardContent, Content, DashboardTitle } from "../../layout";
import { Input } from "@/components/FormFields/FormFields";
import styles from "./page.module.scss";
import Highlight from "@/components/Highlight/Highlight";
import Button from "@/components/Buttons/Buttons";

export default function Pay() {
  return (
    <DashboardContent id={styles.pay}>
      <DashboardTitle>
        <h1>Pay a Contribution</h1>
        <p>
          You are obliged to pay the listed contribution below (including the penalty for skipping a
          month).
        </p>
      </DashboardTitle>
      <Content className={styles.content}>
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
              <th>June</th>
              <td>
                <Input placeholder="Amount to Pay" value="1300" readOnly />
              </td>
              <td>
                <Input placeholder="Amount to Pay" value="1300" readOnly />
              </td>
            </tr>
            <tr>
              <th>July</th>
              <td>
                <Input placeholder="Amount to Pay" value="1300" readOnly />
              </td>
              <td>
                <Input placeholder="Amount to Pay" value="1300" readOnly />
              </td>
            </tr>
            <tr>
              <th>August</th>
              <td>
                <Input placeholder="Amount to Pay" value="1300" readOnly />
              </td>
              <td>
                <Input placeholder="Amount to Pay" value="1300" readOnly />
              </td>
            </tr>
          </tbody>
        </HorizontalTable>
        <Highlight tint="red">
          <h1>₱60 SSS Penalty</h1>
          <p>You skipped a following month: March, April, May</p>
        </Highlight>
        <Highlight tint="red">
          <h1>₱40 EC Penalty</h1>
          <p>You skipped a following month: March, April, May</p>
        </Highlight>
        <h3>Select a payment methods</h3>
        <div className={styles.paymentButtons}>
          <Button className="bg-primary text-slate">
            <i className="fa fa-coins" /> Pay using Cash
          </Button>
          <Button className="bg-primary text-slate">
            <i className="fa fa-receipt" /> Pay using Check
          </Button>
          <Button className="bg-primary text-slate">
            <i className="fa fa-bank" /> Pay through Bank
          </Button>
        </div>
      </Content>
    </DashboardContent>
  );
}
