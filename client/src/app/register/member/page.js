"use client";

import Button from "@/components/Buttons/Buttons";
import { Checkbox, Input, Select } from "@/components/FormFields/FormFields";
import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import styles from "../shared.module.scss";

const MemberRegistrationContext = createContext();

export default function MemberRegistration() {
  const steps = [
    "basic-info",
    "contact-info",
    "other-details",
    "account-details"
  ];
  const [currentStep, setCurrentStep] = useState("basic-info");
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

  const updateRegistrationFormData = (key, value) => {
    setPayload((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const handleRegister = async () => {
    const isPasswordSame = payload.password === payload.confirmPassword;
    if (!isPasswordSame) {
      return alert(
        "Please make sure that the confirm password field is correct."
      );
    }

    if (!payload.agree) {
      return alert("Please confirm that your information is correct.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register/individual`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
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
    <MemberRegistrationContext.Provider
      value={{ payload, updateRegistrationFormData, handleRegister }}>
      <section id={styles.registration} className={styles.memberRegistration}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.headers}>
              <h1 className={styles.title}>
                Registration Form for Individual Member
              </h1>
              <p>
                Please fill-out the form accurately. Input fields with asterisk
                (*) are required.
              </p>
            </div>
            <form onSubmit={(evt) => evt.preventDefault()}>
              {currentStep === "basic-info" ? (
                <BasicInformationForm goToNextStep={goToNextStep} />
              ) : null}
              {currentStep === "contact-info" ? (
                <ContactInformationForm
                  goToNextStep={goToNextStep}
                  gotoPrevStep={gotoPrevStep}
                />
              ) : null}
              {currentStep === "other-details" ? (
                <OtherDetailsForm
                  goToNextStep={goToNextStep}
                  gotoPrevStep={gotoPrevStep}
                />
              ) : null}
              {currentStep === "account-details" ? (
                <AccountDetails gotoPrevStep={gotoPrevStep} />
              ) : null}
            </form>
            <FormNavigator currentStep={currentStep} goToStep={goToStep} />
          </div>
        </div>
      </section>
    </MemberRegistrationContext.Provider>
  );
}

function AccountDetails(props) {
  const { gotoPrevStep } = props;
  const { payload, updateRegistrationFormData, handleRegister } = useContext(
    MemberRegistrationContext
  );

  const changePasswordValue = (evt) => {
    updateRegistrationFormData("password", evt.target.value);
  };

  const changeConfirmPasswordValue = (evt) => {
    updateRegistrationFormData("confirmPassword", evt.target.value);
  };

  const changeCheckboxTickState = (evt) => {
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
      <Checkbox checked={payload.agree} onChange={changeCheckboxTickState}>
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
  const { goToNextStep, gotoPrevStep } = props;
  const { payload, updateRegistrationFormData } = useContext(
    MemberRegistrationContext
  );

  const changeCrnValue = (evt) => {
    updateRegistrationFormData("crn", evt.target.value);
  };

  const changeTinValue = (evt) => {
    updateRegistrationFormData("tin", evt.target.value);
  };

  const changePayorTypeValue = (evt) => {
    updateRegistrationFormData("payorType", evt.target.value);
  };

  return (
    <Fragment>
      <h1 className={styles.title}>Other Details</h1>
      <Input
        placeholder="Common Reference Number (CRN)"
        value={payload.crn}
        onChange={changeCrnValue}
      />
      <Input
        placeholder="Tax Identification Number (TIN)"
        value={payload.tin}
        onChange={changeTinValue}
      />
      <Select
        placeholder="Select a Payor Type"
        value={payload.payorType}
        onChange={changePayorTypeValue}
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
  const { goToNextStep, gotoPrevStep } = props;
  const { payload, updateRegistrationFormData } = useContext(
    MemberRegistrationContext
  );

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

  return (
    <Fragment>
      <h1 className={styles.title}>Contact Information</h1>
      <Input
        placeholder="Complete Address"
        value={payload.address}
        onChange={changeAddressValue}
        required
      />
      <Input
        placeholder="Zip Code"
        value={payload.zip}
        onChange={changeZipValue}
        required
      />
      <Input
        placeholder="Mobile Phone Number"
        value={payload.mobile}
        onChange={changeMobileValue}
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
  const { payload, updateRegistrationFormData } = useContext(
    MemberRegistrationContext
  );

  const changeFirstNameValue = (evt) => {
    updateRegistrationFormData("firstName", evt.target.value);
  };

  const changeMiddleNameValue = (evt) => {
    updateRegistrationFormData("middleName", evt.target.value);
  };

  const changeLastNameValue = (evt) => {
    updateRegistrationFormData("lastName", evt.target.value);
  };

  const changeSuffixValue = (evt) => {
    updateRegistrationFormData("suffix", evt.target.value);
  };

  return (
    <Fragment>
      <h1 className={styles.title}>Basic Information</h1>
      <Input
        placeholder="First Name"
        value={payload.firstName}
        onChange={changeFirstNameValue}
        required
      />
      <Input
        placeholder="Middle Name"
        value={payload.middleName}
        onChange={changeMiddleNameValue}
        required
      />
      <Input
        placeholder="Last Name"
        value={payload.lastName}
        onChange={changeLastNameValue}
        required
      />
      <Input
        placeholder="Suffix (Jr., Sr., etc.)"
        value={payload.suffix}
        onChange={changeSuffixValue}
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
      <p>
        Complete these sections to create your SSS individual member account.
      </p>
      <div
        className={
          styles.step +
          (currentStep === "basic-info" ? " " + styles.active : "")
        }
        onClick={() => {
          goToStep("basic-info");
        }}>
        <h2>Basic Information</h2>
      </div>
      <div
        className={
          styles.step +
          (currentStep === "contact-info" ? " " + styles.active : "")
        }
        onClick={() => {
          goToStep("contact-info");
        }}>
        <h2>Contact Information</h2>
      </div>
      <div
        className={
          styles.step +
          (currentStep === "other-details" ? " " + styles.active : "")
        }
        onClick={() => {
          goToStep("other-details");
        }}>
        <h2>Other Details</h2>
      </div>
      <div
        className={
          styles.step +
          (currentStep === "account-details" ? " " + styles.active : "")
        }
        onClick={() => {
          goToStep("account-details");
        }}>
        <h2>Account Details</h2>
      </div>
    </div>
  );
}
