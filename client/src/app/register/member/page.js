"use client";

import { Checkbox, Input, Select } from "@/components/FormFields/FormFields";
import styles from "../shared.module.scss";
import Button from "@/components/Buttons/Buttons";
import { Fragment, useEffect, useState } from "react";

export default function MemberRegistration() {
  const [currentStep, setCurrentStep] = useState("basic-info");
  const steps = ["basic-info", "contact-info", "other-details", "account-details"];
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    address: "",
    zip: "",
    mobile: "",
    telephone: "",
    email: "",
    crn: "",
    tin: "",
    payorType: "",
    password: "",
    agree: false,
    confirmPassword: ""
  });

  const goToNextStep = () => {
    setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
  };

  const gotoPrevStep = () => {
    setCurrentStep(steps[steps.indexOf(currentStep) - 1]);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const handleChangePayload = (evt, key) => {
    setPayload((prev) => {
      if (key === "agree") {
        return { ...prev, [key]: evt.target.checked };
      }

      return { ...prev, [key]: evt.target.value };
    });
  };

  const handleRegister = async () => {
    const isPasswordSame = payload.password === payload.confirmPassword;
    if (!isPasswordSame) {
      return alert("Please make sure that the confirm password field is correct.");
    }

    if (!payload.agree) {
      return alert("Please confirm that your information is correct.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/individual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      return alert("An error occured while signing you up.");
    }

    const result = await response.json();
    if (!result.success) {
      return alert(result.message);
    }

    alert("You are now registered. Please sign in.");
    window.location.href = "/login";
  };

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  return (
    <section id={styles.registration} className={styles.memberRegistration}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headers}>
            <h1 className={styles.title}>Registration Form for Individual Member</h1>
            <p>Please fill-out the form accurately. Input fields with asterisk (*) are required.</p>
          </div>
          <form onSubmit={(evt) => evt.preventDefault()}>
            {currentStep === "basic-info" ? (
              <BasicInformationForm
                payload={payload}
                handleChangePayload={handleChangePayload}
                goToNextStep={goToNextStep}
              />
            ) : null}
            {currentStep === "contact-info" ? (
              <ContactInformationForm
                payload={payload}
                handleChangePayload={handleChangePayload}
                goToNextStep={goToNextStep}
                gotoPrevStep={gotoPrevStep}
              />
            ) : null}
            {currentStep === "other-details" ? (
              <OtherDetailsForm
                payload={payload}
                handleChangePayload={handleChangePayload}
                goToNextStep={goToNextStep}
                gotoPrevStep={gotoPrevStep}
              />
            ) : null}
            {currentStep === "account-details" ? (
              <AccountDetails
                payload={payload}
                handleRegister={handleRegister}
                handleChangePayload={handleChangePayload}
                gotoPrevStep={gotoPrevStep}
              />
            ) : null}
          </form>
          <FormNavigator currentStep={currentStep} goToStep={goToStep} />
        </div>
      </div>
    </section>
  );
}

function AccountDetails(props) {
  const { payload, handleRegister, handleChangePayload, gotoPrevStep } = props;
  const { password, confirmPassword, agree } = payload;

  return (
    <Fragment>
      <h1 className={styles.title}>Account Details</h1>
      <p>Provide a strong password for your SSS account.</p>
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(evt) => {
          handleChangePayload(evt, "password");
        }}
        required
      />
      <Input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(evt) => {
          handleChangePayload(evt, "confirmPassword");
        }}
        required
      />
      <Checkbox
        checked={agree}
        onChange={(evt) => {
          handleChangePayload(evt, "agree");
        }}>
        I confirm that the information I have entered is correct and legitimate.
      </Checkbox>
      <Button className="bg-green text-slate" onClick={handleRegister}>
        Register as Individual Member
      </Button>
      <Button className="bg-slate-3 text-primary" onClick={gotoPrevStep}>
        Previous
      </Button>
    </Fragment>
  );
}

function OtherDetailsForm(props) {
  const { payload, handleChangePayload, goToNextStep, gotoPrevStep } = props;
  const { crn, tin, payorType } = payload;

  return (
    <Fragment>
      <h1 className={styles.title}>Other Details</h1>
      <Input
        placeholder="Common Reference Number (CRN)"
        value={crn}
        onChange={(evt) => {
          handleChangePayload(evt, "crn");
        }}
      />
      <Input
        placeholder="Tax Identification Number (TIN)"
        value={tin}
        onChange={(evt) => {
          handleChangePayload(evt, "tin");
        }}
      />
      <Select
        placeholder="Select a Payor Type"
        value={payorType}
        onChange={(evt) => {
          handleChangePayload(evt, "payorType");
        }}
        required>
        <option value="">Select a Payor Type</option>
        <option value="self-employed">Self-Employed</option>
        <option value="non-working spouse">Non-Working Spouse</option>
        <option value="voluntary">Voluntary</option>
        <option value="ofw">OFW</option>
        <option value="farmer/fisherman">Farmer/Fisherman</option>
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
  const { payload, handleChangePayload, goToNextStep, gotoPrevStep } = props;
  const { address, zip, mobile, telephone, email } = payload;

  return (
    <Fragment>
      <h1 className={styles.title}>Contact Information</h1>
      <Input
        placeholder="Complete Address"
        value={address}
        onChange={(evt) => {
          handleChangePayload(evt, "address");
        }}
        required
      />
      <Input
        placeholder="Zip Code"
        value={zip}
        onChange={(evt) => {
          handleChangePayload(evt, "zip");
        }}
        required
      />
      <Input
        placeholder="Mobile Phone Number"
        value={mobile}
        onChange={(evt) => {
          handleChangePayload(evt, "mobile");
        }}
        required
      />
      <Input
        placeholder="Telephone Number"
        value={telephone}
        onChange={(evt) => {
          handleChangePayload(evt, "telephone");
        }}
      />
      <Input
        placeholder="Email Address"
        value={email}
        onChange={(evt) => {
          handleChangePayload(evt, "email");
        }}
      />
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
  const { payload, handleChangePayload, goToNextStep } = props;
  const { firstName, lastName, middleName, suffix } = payload;

  return (
    <Fragment>
      <h1 className={styles.title}>Basic Information</h1>
      <Input
        placeholder="First Name"
        value={firstName}
        onChange={(evt) => {
          handleChangePayload(evt, "firstName");
        }}
        required
      />
      <Input
        placeholder="Middle Name"
        value={middleName}
        onChange={(evt) => {
          handleChangePayload(evt, "middleName");
        }}
        required
      />
      <Input
        placeholder="Last Name"
        value={lastName}
        onChange={(evt) => {
          handleChangePayload(evt, "lastName");
        }}
        required
      />
      <Input
        placeholder="Suffix (Jr., Sr., etc.)"
        value={suffix}
        onChange={(evt) => {
          handleChangePayload(evt, "suffix");
        }}
      />
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
