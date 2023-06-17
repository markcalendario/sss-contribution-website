import { Fragment } from "react";
import { Content, DashboardContent, DashboardTitle } from "../../layout";
import { HorizontalTable } from "@/components/Table/Table";

export default function History() {
  return (
    <DashboardContent>
      <DashboardTitle>
        <h1>Contribution History</h1>
        <p>List of paid contribution since you joined SSS.</p>
      </DashboardTitle>
      <Content>
        <HorizontalTable>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Penalty</th>
              <th>Total Amount Paid</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-head="Date">2023-06-17</td>
              <td data-head="Amount">4500</td>
              <td data-head="Penalty">60</td>
              <td data-head="Total Amount Paid">4560</td>
              <td data-head="Mode">Cash</td>
            </tr>
            <tr>
              <td data-head="Date">2023-04-17</td>
              <td data-head="Amount">4500</td>
              <td data-head="Penalty">0</td>
              <td data-head="Total Amount Paid">4500</td>
              <td data-head="Mode">Cash</td>
            </tr>
            <tr>
              <td data-head="Date">2023-03-17</td>
              <td data-head="Amount">4500</td>
              <td data-head="Penalty">0</td>
              <td data-head="Total Amount Paid">4500</td>
              <td data-head="Mode">Cash</td>
            </tr>
          </tbody>
        </HorizontalTable>
      </Content>
    </DashboardContent>
  );
}
