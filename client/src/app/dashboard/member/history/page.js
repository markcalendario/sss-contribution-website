"use client";

import { useState, useEffect } from "react";
import { Content, DashboardContent, DashboardTitle } from "../../layout";
import { HorizontalTable } from "@/components/Table/Table";
import { FullPageLoader } from "@/components/Loaders/Loaders";
import NoResultIndicator from "@/components/NoResultIndicator/NoResultIndicator";

export default function History() {
  const [history, setHistory] = useState(null);

  const getContributionHistory = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributions/history`, {
      credentials: "include"
    });

    if (!response.ok) {
      return alert("An error occured while fetching contribution history.");
    }

    const result = await response.json();
    if (!result.success) {
      return alert(result.message);
    }

    setHistory(result.history);
  };

  useEffect(() => {
    getContributionHistory();
  }, []);

  if (history === null) {
    return <FullPageLoader text="Checking History" />;
  }

  if (history.length === 0) {
    return <NoResultIndicator text="Contribution history is empty." />;
  }

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
              <th>Period</th>
              <th>SSS Contribution</th>
              <th>Mode of Payment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map(({ period, sss, mode, paid_date }) => (
              <tr key={period}>
                <td data-head="Month">{period}</td>
                <td data-head="SSS Contribution">₱ {parseFloat(sss).toLocaleString()}</td>
                <td data-head="Mode of Payment">{mode}</td>
                <td data-head="Date">{paid_date}</td>
              </tr>
            ))}
          </tbody>
        </HorizontalTable>
      </Content>
    </DashboardContent>
  );
}
