"use client";

import Button from "@/components/Buttons/Buttons";
import { Input } from "@/components/FormFields/FormFields";
import Highlight from "@/components/Highlight/Highlight";
import { FullPageLoader } from "@/components/Loaders/Loaders";
import PaymentSection, {
  NoUnpaidContributionsIndicator
} from "@/components/PaymentSection/PaymentSection";
import { HorizontalTable } from "@/components/Table/Table";
import { createContext, useContext, useEffect, useState } from "react";
import { Content, DashboardContent, DashboardTitle } from "../../layout";

const UnpaidContributionsContext = createContext();

export default function PayContributionPageCompiled() {
  const [unpaidContributions, setUnpaidContributions] = useState(null);
  const [unpaidContributionsAmount, setUnpaidContributionsAmount] =
    useState(null);

  const getUnpaidContributions = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/unpaid`,
      { credentials: "include" }
    );

    if (!response.ok) {
      return alert(
        "Something went wrong while fetching all unpaid contributions."
      );
    }

    const result = await response.json();
    if (!result.success) {
      return alert(result.message);
    }

    setUnpaidContributions(result.data);
  };

  const getAmountOfUnpaidContributions = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/unpaid-amount`,
      {
        credentials: "include"
      }
    );

    if (!response.ok) {
      return alert(
        "Something went wrong while fetching unpaid contributions amount."
      );
    }

    const result = await response.json();
    if (!result.success) {
      return alert(result.message);
    }

    setUnpaidContributionsAmount(result.amount);
  };

  useEffect(() => {
    getAmountOfUnpaidContributions();
    getUnpaidContributions();
  }, []);

  if (unpaidContributions === null) {
    return <FullPageLoader text="Fetching Unpaid Contributions" />;
  }

  if (unpaidContributions.length === 0 || unpaidContributionsAmount === null) {
    return <NoUnpaidContributionsIndicator />;
  }

  return (
    <UnpaidContributionsContext.Provider
      value={{ unpaidContributions, unpaidContributionsAmount }}>
      <UnpaidContributionsList />
      <PaymentSection />
    </UnpaidContributionsContext.Provider>
  );
}

function UnpaidContributionsList() {
  const { unpaidContributions, unpaidContributionsAmount } = useContext(
    UnpaidContributionsContext
  );

  const undoContributionFiling = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/remove-unpaid-contribution`,
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    if (!response.ok) {
      return alert(
        "Something went wrong while fetching all unpaid contributions."
      );
    }

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      window.location.reload();
    }
  };

  return (
    <DashboardContent>
      <DashboardTitle>
        <h1>Pay a Contribution</h1>
        <p>You are obliged to pay the listed contribution below.</p>
      </DashboardTitle>
      <Content>
        <Highlight tint="orange">
          <h1>₱ {unpaidContributionsAmount}</h1>
          <p>Please pay exact amount.</p>
        </Highlight>
        <HorizontalTable>
          <thead>
            <tr>
              <th>Period</th>
              <th>SSS Contribution</th>
              <th>EC Contribution</th>
              <th>Filing Date</th>
            </tr>
          </thead>
          <tbody>
            {unpaidContributions.map((data, index) => (
              <tr key={index}>
                <th>{data.period}</th>
                <td data-head="SSS Contribution">
                  <Input
                    placeholder="Amount to Pay"
                    value={data.sss}
                    readOnly
                  />
                </td>
                <td data-head="EC Contribution">
                  <Input placeholder="Amount to Pay" value={data.ec} readOnly />
                </td>
                <td data-head="Filing Date">
                  <Input
                    placeholder="Filing Date"
                    value={data.filing_date}
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HorizontalTable>
        <div>
          <Button
            className="bg-red text-slate"
            onClick={undoContributionFiling}>
            Unfile Contribution
          </Button>
        </div>
      </Content>
    </DashboardContent>
  );
}
