import {
  Content,
  DashboardContent,
  DashboardTitle
} from "@/app/dashboard/layout";
import { Fragment } from "react";
import Button from "../Buttons/Buttons";
import Highlight from "../Highlight/Highlight";
import NoResultIndicator from "../NoResultIndicator/NoResultIndicator";
import styles from "./PaymentSection.module.scss";

export default function PaymentSection() {
  const pay = async (payload) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/pay`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

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
    let bankName = prompt("Enter a bank name.");

    pay({
      amount: amount,
      mode: "bank",
      bank: bankName,
      checkReference: "",
      checkDate: ""
    });
  };

  const handleCheckPay = () => {
    const amount = prompt("Enter exact amount.");
    const checkReference = prompt("Enter check reference number.");
    const checkDate = prompt(
      "Enter check validity date. Follow this format: YYYY-MM-DD"
    );
    const bankName = prompt("Enter bank name of this check.");

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
      <Content>
        <div className={styles.buttons}>
          <Button className="bg-primary text-slate" onClick={handleCashPay}>
            <i className="fa fa-coins" /> Pay using Cash
          </Button>
          <Button className="bg-primary text-slate" onClick={handleCheckPay}>
            <i className="fa fa-receipt" /> Pay using Check
          </Button>
          <Button className="bg-primary text-slate" onClick={handleBankPay}>
            <i className="fa fa-bank" /> Pay through Bank
          </Button>
        </div>
      </Content>
    </DashboardContent>
  );
}

export function NoUnpaidContributionsIndicator() {
  return (
    <Fragment>
      <Highlight tint="green">
        <h1>Hooray!</h1>
        <p>You have no pending contributions to pay.</p>
      </Highlight>
      <NoResultIndicator text="You have no unpaid contributions." />
    </Fragment>
  );
}
