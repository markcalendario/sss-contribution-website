"use client";

import Button from "@/components/Buttons/Buttons";
import { Checkbox, Input, Select } from "@/components/FormFields/FormFields";
import { Fragment, createContext, useContext, useEffect, useState } from "react";
import styles from "../shared.module.scss";

const EmployerRegistrationContext = createContext();

export default function EmployerRegistration() {
  const steps = ["employer-info", "contact-info", "other-details", "account-details"];
  const [currentStep, setCurrentStep] = useState("employer-info");
  const [payload, setPayload] = useState({
    businessName: "",
    address: "",
    zip: "",
    mobile: "",
    telephone: "",
    email: "",
    website: "",
    tin: "",
    payorType: "",
    password: "",
    confirmPassword: "",
    agree: false
  });

  function goToNextStep() {
    setCurrentStep(steps[steps.indexOf(currentStep) + 1]);
  }

  function gotoPrevStep() {
    setCurrentStep(steps[steps.indexOf(currentStep) - 1]);
  }

  function goToStep(step) {
    setCurrentStep(step);
  }

  function updateRegistrationFormData(key, value) {
    setPayload((prev) => {
      return {
        ...prev,
        [key]: value
      };
    });
  }

  async function handleRegister() {
    if (payload.password !== payload.confirmPassword) {
      return alert("Password and confirm password are not same.");
    }

    if (!payload.agree) {
      return alert("You must agree that your information are legit.");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/employer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      return alert("A problem occured while registering your account.");
    }

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    console.log(payload);
  }, [payload]);

  return (
    <EmployerRegistrationContext.Provider
      value={{ payload, updateRegistrationFormData, handleRegister }}>
      <section id={styles.registration} className={styles.memberRegistration}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.headers}>
              <h1 className={styles.title}>Registration Form for Employers</h1>
              <p>
                Please fill-out the form accurately. Input fields with asterisk (*) are required.
              </p>
            </div>
            <form
              onSubmit={(evt) => {
                evt.preventDefault();
              }}>
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
    </EmployerRegistrationContext.Provider>
  );
}

function AccountDetails(props) {
  const { gotoPrevStep } = props;
  const { payload, updateRegistrationFormData, handleRegister } = useContext(
    EmployerRegistrationContext
  );

  const changePasswordValue = (evt) => {
    updateRegistrationFormData("password", evt.target.value);
  };

  const changeConfirmPasswordValue = (evt) => {
    updateRegistrationFormData("confirmPassword", evt.target.value);
  };

  const changeAgreeCheckboxTickState = (evt) => {
    updateRegistrationFormData("agree", evt.target.checked);
  };

  return (
    <Fragment>
      <h1 className={styles.title}>Account Details</h1>
      <p>Provide a strong password for your SSS account.</p>
      <Input
        placeholder="Password"
        type="password"
        value={payload.password}
        onChange={changePasswordValue}
        required
      />
      <Input
        placeholder="Confirm Password"
        type="password"
        value={payload.confirmPassword}
        onChange={changeConfirmPasswordValue}
        required
      />
      <Checkbox checked={payload.agree} onChange={changeAgreeCheckboxTickState}>
        I confirm that the information I have entered is correct and legitimate.
      </Checkbox>
      <Button className="bg-green text-slate" onClick={handleRegister}>
        Register as Employer
      </Button>
      <Button className="bg-slate-3 text-primary" onClick={gotoPrevStep}>
        Previous
      </Button>
    </Fragment>
  );
}

function OtherDetailsForm(props) {
  const { goToNextStep, gotoPrevStep } = props;
  const { payload, updateRegistrationFormData } = useContext(EmployerRegistrationContext);

  const handleTinChange = (evt) => {
    updateRegistrationFormData("tin", evt.target.value);
  };

  const handlePayorType = (evt) => {
    updateRegistrationFormData("payorType", evt.target.value);
  };

  return (
    <Fragment>
      <h1 className={styles.title}>Other Details</h1>
      <Input
        placeholder="Tax Identification Number (TIN)"
        value={payload.tin}
        onChange={handleTinChange}
      />
      <Select
        placeholder="Select an Employer Type"
        value={payload.payorType}
        onChange={handlePayorType}
        required>
        <option value="">Select an Employer Type</option>
        <option value="business">Business</option>
        <option value="household">Household</option>
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
  const { payload, updateRegistrationFormData } = useContext(EmployerRegistrationContext);

  const changeAddressValue = (evt) => {
    updateRegistrationFormData("address", evt.target.value);
  };

  const changeZipValue = (evt) => {
    updateRegistrationFormData("zip", evt.target.value);
  };

  const changeMobileValue = (evt) => {
    updateRegistrationFormData("mobile", evt.target.value);
  };

  const changeTelephoneValue = (evt) => {
    updateRegistrationFormData("telephone", evt.target.value);
  };

  const changeEmailValue = (evt) => {
    updateRegistrationFormData("email", evt.target.value);
  };

  const changeWebsiteValue = (evt) => {
    updateRegistrationFormData("website", evt.target.value);
  };

  return (
    <Fragment>
      <h1 className={styles.title}>Contact Information</h1>
      <Input
        placeholder="Complete Address"
        value={payload.address}
        onChange={changeAddressValue}
        required
      />
      <Input placeholder="Zip Code" value={payload.zip} onChange={changeZipValue} required />
      <Input
        placeholder="Mobile Phone Number"
        onChange={changeMobileValue}
        value={payload.mobile}
        required
      />
      <Input
        placeholder="Telephone Number"
        value={payload.telephone}
        onChange={changeTelephoneValue}
      />
      <Input
        placeholder="Email Address"
        value={payload.email}
        onChange={changeEmailValue}
        required
      />
      <Input placeholder="Website" value={payload.website} onChange={changeWebsiteValue} />
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
  const { payload, updateRegistrationFormData } = useContext(EmployerRegistrationContext);

  const changeBusinessNameValue = (evt) => {
    updateRegistrationFormData("businessName", evt.target.value);
  };

  return (
    <Fragment>
      <h1 className={styles.title}>Employer Information</h1>
      <Input
        placeholder="Employer Name (Business Name / Name of Employer Household)"
        value={payload.businessName}
        onChange={changeBusinessNameValue}
        required
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
