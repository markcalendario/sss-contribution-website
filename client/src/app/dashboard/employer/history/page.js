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
              <th>Month</th>
              <th>SSS Contribution</th>
              <th>SSS Penalty</th>
              <th>EC Contribution</th>
              <th>EC Penalty</th>
              <th>Paid Amount</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-head="Month">February</td>
              <td data-head="SSS Contribution">4500</td>
              <td data-head="SSS Penalty">60</td>
              <td data-head="EC Contribution">4500</td>
              <td data-head="EC Penalty">60</td>
              <td data-head="Paid Amount">4560</td>
              <td data-head="Mode">Cash</td>
              <td data-head="Date">2023-02-20</td>
            </tr>
            <tr>
              <td data-head="Month">January</td>
              <td data-head="SSS Contribution">4500</td>
              <td data-head="SSS Penalty">0</td>
              <td data-head="EC Contribution">4500</td>
              <td data-head="EC Penalty">0</td>
              <td data-head="Paid Amount">4500</td>
              <td data-head="Mode">Cash</td>
              <td data-head="Date">2023-01-20</td>
            </tr>
            <tr>
              <td data-head="Month">December</td>
              <td data-head="SSS Contribution">4500</td>
              <td data-head="SSS Penalty">0</td>
              <td data-head="EC Contribution">4500</td>
              <td data-head="EC Penalty">0</td>
              <td data-head="Paid Amount">4500</td>
              <td data-head="Mode">Cash</td>
              <td data-head="Date">2022-12-20</td>
            </tr>
          </tbody>
        </HorizontalTable>
      </Content>
    </DashboardContent>
  );
}
