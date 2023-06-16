"use client";

import { Checkbox, Input, Select } from "@/app/components/FormFields/FormFields";
import styles from "../shared.module.scss";
import Button from "@/app/components/Buttons/Buttons";
import { Fragment, useState } from "react";

export default function EmployerRegistration() {
  const [currentStep, setCurrentStep] = useState("employer-info");
  const steps = ["employer-info", "contact-info", "other-details", "account-details"];

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
            <h1 className={styles.title}>Registration Form for Employers</h1>
            <p>Please fill-out the form accurately. Input fields with asterisk (*) are required.</p>
          </div>
          <form>
            {currentStep === "employer-info" ? (
              <EmployerInformationForm goToNextStep={goToNextStep} />
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
      <Button className="bg-green text-slate">Register as Employer</Button>
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
      <Input placeholder="Tax Identification Number (TIN)" />
      <Select placeholder="Select an Employer Type" required>
        <option value="Business">Business</option>
        <option value="Household">Household</option>
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
      <Input placeholder="Website" />
      <Button className="bg-primary text-slate" onClick={goToNextStep}>
        Next
      </Button>
      <Button className="bg-slate-3 text-primary" onClick={gotoPrevStep}>
        Previous
      </Button>
    </Fragment>
  );
}

function EmployerInformationForm(props) {
  const { goToNextStep } = props;

  return (
    <Fragment>
      <h1 className={styles.title}>Employer Information</h1>
      <Input placeholder="Employer Name (Business Name / Name of Employer Household)" required />
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
      <p>Complete these sections to create your SSS employer member account.</p>
      <div
        className={styles.step + (currentStep === "employer-info" ? " " + styles.active : "")}
        onClick={() => {
          goToStep("employer-info");
        }}>
        <h2>Employer Information</h2>
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
