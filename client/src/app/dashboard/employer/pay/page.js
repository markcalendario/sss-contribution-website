"use client";

import { HorizontalTable } from "@/components/Table/Table";
import { DashboardContent, Content, DashboardTitle } from "../../layout";
import { Input } from "@/components/FormFields/FormFields";
import styles from "./page.module.scss";
import Button from "@/components/Buttons/Buttons";
import { Fragment, createContext, useContext, useEffect, useState } from "react";
import NoResultIndicator from "@/components/NoResultIndicator/NoResultIndicator";
import { FullPageLoader } from "@/components/Loaders/Loaders";
import Highlight from "@/components/Highlight/Highlight";

const UnpaidContributionsContext = createContext();

export default function PayContributionPageCompiled() {
  const [unpaidContributions, setUnpaidContributions] = useState(null);
  const [unpaidContributionsAmount, setUnpaidContributionsAmount] = useState(null);

  const getUnpaidContributions = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributions/unpaid`, {
      credentials: "include"
    });

    if (!response.ok) {
      return alert("Something went wrong while fetching all unpaid contributions.");
    }

    const result = await response.json();
    if (!result.success) {
      return alert(result.message);
    }

    setUnpaidContributions(result.data);
  };

  const getAmountOfUnpaidContributions = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributions/unpaid-amount`, {
      credentials: "include"
    });

    if (!response.ok) {
      return alert("Something went wrong while fetching unpaid contributions amount.");
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
    return <NoUnpaidContributions />;
  }

  return (
    <Fragment>
      <UnpaidContributionsContext.Provider
        value={{ unpaidContributions, unpaidContributionsAmount }}>
        <UnpaidContributionsList />
      </UnpaidContributionsContext.Provider>
      <PaymentSection />
    </Fragment>
  );
}

function NoUnpaidContributions() {
  return (
    <DashboardContent>
      <DashboardTitle>
        <h1>Pay a Contribution</h1>
      </DashboardTitle>
      <Content>
        <Highlight tint="green">
          <h1>Hooray!</h1>
          <p>You have no pending contributions to pay.</p>
        </Highlight>
        <NoResultIndicator text="You have no unpaid contributions." />
      </Content>
    </DashboardContent>
  );
}

function UnpaidContributionsList() {
  const { unpaidContributions, unpaidContributionsAmount } = useContext(UnpaidContributionsContext);

  const undoContributionFiling = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/remove-unpaid-contribution`,
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    if (!response.ok) {
      return alert("Something went wrong while fetching all unpaid contributions.");
    }

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      window.location.reload();
    }
  };

  return (
    <DashboardContent id={styles.unpaidContributionsList}>
      <DashboardTitle>
        <h1>Pay a Contribution</h1>
        <p>You are obliged to pay the listed contribution below.</p>
      </DashboardTitle>
      <Content className={styles.content}>
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
                <td>
                  <Input placeholder="Amount to Pay" value={data.sss} readOnly />
                </td>
                <td>
                  <Input placeholder="Amount to Pay" value={data.ec} readOnly />
                </td>
                <td>
                  <Input placeholder="Filing Date" value={data.filing_date} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </HorizontalTable>
      </Content>
    </DashboardContent>
  );
}

function PaymentSection() {
  const pay = async (payload) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributions/pay`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return alert("Something went wrong while submitting your payments.");
    }

    const result = await response.json();
    alert(result.message);
    if (result.success) {
      window.location.reload();
    }
  };

  const handleCashPay = () => {
    let amount = prompt("Enter exact amount.");

    if (!amount) {
      return;
    }

    pay({
      amount: amount,
      mode: "cash",
      bank: "",
      checkReference: "",
      checkDate: ""
    });
  };

  const handleBankPay = () => {
    let amount = prompt("Enter exact amount.");

    if (!amount) {
      return;
    }

    pay({
      amount: amount,
      mode: "bank",
      bank: "",
      checkReference: "",
      checkDate: ""
    });
  };

  const handleCheckPay = () => {
    const amount = prompt("Enter exact amount.");
    if (!amount) {
      return;
    }

    const checkReference = prompt("Enter check reference number.");
    if (!checkReference) {
      return;
    }

    const checkDate = prompt("Enter check validity date. Follow this format: YYYY-MM-DD");
    if (!checkDate) {
      return;
    }

    const bankName = prompt("Enter bank name of this check.");
    if (!bankName) {
      return;
    }

    pay({
      amount: amount,
      mode: "check",
      bank: bankName,
      checkReference: checkReference,
      checkDate: checkDate
    });
  };

  return (
    <DashboardContent id={styles.paymentSection}>
      <DashboardTitle>
        <h1>Payment Section</h1>
        <p>Select a payment method.</p>
      </DashboardTitle>
      <Content className={styles.content}>
        <Button className="bg-primary text-slate" onClick={handleCashPay}>
          <i className="fa fa-coins" /> Pay using Cash
        </Button>
        <Button className="bg-primary text-slate" onClick={handleCheckPay}>
          <i className="fa fa-receipt" /> Pay using Check
        </Button>
        <Button className="bg-primary text-slate" onClick={handleBankPay}>
          <i className="fa fa-bank" /> Pay through Bank
        </Button>
      </Content>
    </DashboardContent>
  );
}
