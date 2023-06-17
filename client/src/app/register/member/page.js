"use client";

import { Checkbox, Input, Select } from "@/components/FormFields/FormFields";
import styles from "../shared.module.scss";
import Button from "@/components/Buttons/Buttons";
import { Fragment, useState } from "react";

export default function MemberRegistration() {
  const [currentStep, setCurrentStep] = useState("basic-info");
  const steps = ["basic-info", "contact-info", "other-details", "account-details"];

  function goToNextStep() {
    setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
  }

  function gotoPrevStep() {
    setCurrentStep(steps[steps.indexOf(currentStep) - 1]);
  }

  function goToStep(step) {
    setCurrentStep(step);
  }

  return (
    <section id={styles.registration} className={styles.memberRegistration}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headers}>
            <h1 className={styles.title}>Registration Form for Individual Member</h1>
            <p>Please fill-out the form accurately. Input fields with asterisk (*) are required.</p>
          </div>
          <form>
            {currentStep === "basic-info" ? (
              <BasicInformationForm goToNextStep={goToNextStep} />
            ) : null}
            {currentStep === "contact-info" ? (
              <ContactInformationForm goToNextStep={goToNextStep} gotoPrevStep={gotoPrevStep} />
            ) : null}
            {currentStep === "other-details" ? (
              <OtherDetailsForm goToNextStep={goToNextStep} gotoPrevStep={gotoPrevStep} />
            ) : null}
            {currentStep === "account-details" ? (
              <AccountDetails gotoPrevStep={gotoPrevStep} />
            ) : null}
          </form>
          <FormNavigator currentStep={currentStep} goToStep={goToStep} />
        </div>
      </div>
    </section>
  );
}

function AccountDetails(props) {
  const { gotoPrevStep } = props;

  return (
    <Fragment>
      <h1 className={styles.title}>Account Details</h1>
      <p>Provide a strong password for your SSS account.</p>
      <Input placeholder="Password" type="password" required />
      <Input placeholder="Confirm Password" type="password" required />
      <Checkbox>I confirm that the information I have entered is correct and legitimate.</Checkbox>
      <Button className="bg-green text-slate">Register as Individual Member</Button>
      <Button className="bg-slate-3 text-primary" onClick={gotoPrevStep}>
        Previous
      </Button>
    </Fragment>
  );
}

function OtherDetailsForm(props) {
  const { goToNextStep, gotoPrevStep } = props;

  return (
    <Fragment>
      <h1 className={styles.title}>Other Details</h1>
      <Input placeholder="Common Reference Number (CRN)" />
      <Input placeholder="Tax Identification Number (TIN)" />
      <Select placeholder="Select a Payor Type" required>
        <option value="Self-Employed">Self-Employed</option>
        <option value="Non-Working Spouse">Non-Working Spouse</option>
        <option value="Voluntary">Voluntary</option>
        <option value="OFW">OFW</option>
        <option value="Farmer/Fisherman">Farmer/Fisherman</option>
      </Select>
      <Button className="bg-primary text-slate" onClick={goToNextStep}>
        Next
      </Button>
      <Button className="bg-slate-3 text-primary" onClick={gotoPrevStep}>
        Previous
      </Button>
    </Fragment>
  );
}

function ContactInformationForm(props) {
  const { goToNextStep, gotoPrevStep } = props;

  return (
    <Fragment>
      <h1 className={styles.title}>Contact Information</h1>
      <Input placeholder="Complete Address" required />
      <Input placeholder="Zip Code" required />
      <Input placeholder="Mobile Phone Number" required />
      <Input placeholder="Telephone Number" />
      <Input placeholder="Email Address" />
      <Button className="bg-primary text-slate" onClick={goToNextStep}>
        Next
      </Button>
      <Button className="bg-slate-3 text-primary" onClick={gotoPrevStep}>
        Previous
      </Button>
    </Fragment>
  );
}

function BasicInformationForm(props) {
  const { goToNextStep } = props;

  return (
    <Fragment>
      <h1 className={styles.title}>Basic Information</h1>
      <Input placeholder="First Name" required />
      <Input placeholder="Last Name" required />
      <Input placeholder="Middle Name" required />
      <Input placeholder="Suffix (Jr., Sr., etc.)" />
      <Button className="bg-primary text-slate" onClick={goToNextStep}>
        Next
      </Button>
    </Fragment>
  );
}

function FormNavigator(props) {
  const { currentStep, goToStep } = props;

  return (
    <div className={styles.formNavigator}>
      <h1 className={styles.title}>Form Steps</h1>
      <p>Complete these sections to create your SSS individual member account.</p>
      <div
        className={styles.step + (currentStep === "basic-info" ? " " + styles.active : "")}
        onClick={() => {
          goToStep("basic-info");
        }}>
        <h2>Basic Information</h2>
      </div>
      <div
        className={styles.step + (currentStep === "contact-info" ? " " + styles.active : "")}
        onClick={() => {
          goToStep("contact-info");
        }}>
        <h2>Contact Information</h2>
      </div>
      <div
        className={styles.step + (currentStep === "other-details" ? " " + styles.active : "")}
        onClick={() => {
          goToStep("other-details");
        }}>
        <h2>Other Details</h2>
      </div>
      <div
        className={styles.step + (currentStep === "account-details" ? " " + styles.active : "")}
        onClick={() => {
          goToStep("account-details");
        }}>
        <h2>Account Details</h2>
      </div>
    </div>
  );
}
