"use client";

import Button from "@/components/Buttons/Buttons";
import { Checkbox, Input } from "@/components/FormFields/FormFields";
import Highlight from "@/components/Highlight/Highlight";
import { FullPageLoader } from "@/components/Loaders/Loaders";
import NoResultIndicator from "@/components/NoResultIndicator/NoResultIndicator";
import { HorizontalTable } from "@/components/Table/Table";
import { Fragment, createContext, useContext, useEffect, useState } from "react";
import { Content, DashboardContent, DashboardTitle } from "../../layout";
import styles from "./page.module.scss";
const ContributionContext = createContext();

export default function ContributionFilingCompiled() {
  const [availablePeriods, setAvailablePeriods] = useState(null);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [currentStage, setCurrentStage] = useState("selection");
  const stages = ["selection", "filing"];

  const getAvailablePeriods = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/available-periods`,
      { credentials: "include" }
    );

    if (!response.ok) {
      return alert("Something went wrong while checking available periods.");
    }

    const result = await response.json();

    if (result.hasPendingFiledContributions) {
      return setAvailablePeriods(false);
    }

    if (!result.success) {
      return alert(result.message);
    }

    setAvailablePeriods(result.availablePeriods);
  };

  const removeFromSelectedPeriods = (toRemoveMonth, toRemoveYear) => {
    const updatedSelectedPeriods = [];

    for (const selectedPeriod of selectedPeriods) {
      if (selectedPeriod.month === toRemoveMonth && selectedPeriod.year === toRemoveYear) {
        continue; // remove if match
      }

      updatedSelectedPeriods.push({ ...selectedPeriod });
    }

    setSelectedPeriods(updatedSelectedPeriods);
  };

  const appendToSelectedPeriods = (month, year) => {
    setSelectedPeriods((prev) => {
      return [...prev, { month, year, sss: "", ec: "" }];
    });
  };

  const goToNextStage = () => {
    const nextStage = stages[stages.indexOf(currentStage) + 1];
    setCurrentStage(nextStage);
  };

  const goToPrevStage = () => {
    const prevStage = stages[stages.indexOf(currentStage) - 1];
    setCurrentStage(prevStage);
  };

  const resetAllSelectedFields = () => {
    setSelectedPeriods([]);
  };

  const changeECAmountOfPeriod = (targetMonth, targetYear, ecAmount) => {
    const updatedSelectedPeriods = [];

    for (const selectedPeriod of selectedPeriods) {
      if (selectedPeriod.month === targetMonth && selectedPeriod.year === targetYear) {
        updatedSelectedPeriods.push({ ...selectedPeriod, ec: ecAmount });
        continue;
      }

      updatedSelectedPeriods.push({ ...selectedPeriod });
    }

    setSelectedPeriods(updatedSelectedPeriods);
  };

  const changeSSSAmountOfPeriod = (targetMonth, targetYear, sssAmount) => {
    const updatedSelectedPeriods = [];

    for (const selectedPeriod of selectedPeriods) {
      if (selectedPeriod.month === targetMonth && selectedPeriod.year === targetYear) {
        updatedSelectedPeriods.push({ ...selectedPeriod, sss: sssAmount });
        continue;
      }

      updatedSelectedPeriods.push({ ...selectedPeriod });
    }

    setSelectedPeriods(updatedSelectedPeriods);
  };

  useEffect(() => {
    getAvailablePeriods();
  }, []);

  useEffect(() => {
    if (availablePeriods !== null) {
      console.log("Available", availablePeriods);
    }
  }, [availablePeriods]);

  useEffect(() => {
    console.log("Selected", selectedPeriods);
  }, [selectedPeriods]);

  if (availablePeriods === null) {
    return <FullPageLoader text="Checking available periods." />;
  }

  if (availablePeriods === false) {
    return (
      <Fragment>
        <Highlight tint="orange">
          <h1>Pending Contributions</h1>
          <p>You already have submitted contributions to pay.</p>
        </Highlight>
        <NoResultIndicator text="You have no unpaid contributions." />
      </Fragment>
    );
  }

  return (
    <ContributionContext.Provider
      value={{
        availablePeriods,
        selectedPeriods,
        goToNextStage,
        goToPrevStage
      }}>
      {currentStage === "selection" ? (
        <PeriodSelection
          appendToSelectedPeriods={appendToSelectedPeriods}
          removeFromSelectedPeriods={removeFromSelectedPeriods}
        />
      ) : (
        <ContributionFiling
          resetAllSelectedFields={resetAllSelectedFields}
          changeECAmountOfPeriod={changeECAmountOfPeriod}
          changeSSSAmountOfPeriod={changeSSSAmountOfPeriod}
        />
      )}
    </ContributionContext.Provider>
  );
}

function PeriodSelection(props) {
  const { availablePeriods, goToNextStage } = useContext(ContributionContext);
  const { appendToSelectedPeriods, removeFromSelectedPeriods } = props;

  const handleSelectPeriod = (isSelected, month, year) => {
    if (!isSelected) {
      return removeFromSelectedPeriods(month, year);
    }

    appendToSelectedPeriods(month, year);
  };

  return (
    <DashboardContent>
      <DashboardTitle>
        <h1>Contribution Filing</h1>
      </DashboardTitle>
      <Content>
        <Highlight tint="primary">
          <h1>Guide</h1>
          <p>Select the period(s) you want to pay.</p>
        </Highlight>
        <HorizontalTable>
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {availablePeriods.map((data, index) => (
              <tr key={index}>
                <td data-head="Month">
                  {data.month.substr(0, 1).toUpperCase() + data.month.substr(1)}
                </td>
                <td data-head="Year">{data.year}</td>
                <td data-head="Select">
                  <Checkbox
                    onChange={(evt) => {
                      handleSelectPeriod(evt.target.checked, data.month, data.year);
                    }}>
                    Select
                  </Checkbox>
                </td>
              </tr>
            ))}
          </tbody>
        </HorizontalTable>
        <div>
          <Button className="bg-primary text-slate" onClick={goToNextStage}>
            Next &#187;
          </Button>
        </div>
      </Content>
    </DashboardContent>
  );
}

function ContributionFiling(props) {
  const { selectedPeriods, goToPrevStage } = useContext(ContributionContext);
  const { resetAllSelectedFields, changeECAmountOfPeriod, changeSSSAmountOfPeriod } = props;

  const handleBackClick = () => {
    goToPrevStage();
    resetAllSelectedFields();
  };

  const submitContribution = async () => {
    console.log(selectedPeriods);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/contributions/employer/file-contribution`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributions: selectedPeriods })
      }
    );

    if (!response.ok) {
      return alert("An error occured while submitting contribution file.");
    }

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      window.location.href = "/dashboard/employer/pay";
    }
  };

  if (selectedPeriods.length === 0) {
    return <NoSelectedPeriodIndicator />;
  }

  return (
    <DashboardContent id={styles.contributionFiling}>
      <DashboardTitle>
        <h1>Finalize Contribution</h1>
      </DashboardTitle>
      <Content className={styles.content}>
        <HorizontalTable>
          <thead>
            <tr>
              <th>Month</th>
              <th>SSS Contribution</th>
              <th>EC Contribution</th>
            </tr>
          </thead>
          <tbody>
            {selectedPeriods.map((data, index) => (
              <tr key={index}>
                <th>
                  {data.month.substr(0, 1).toUpperCase() + data.month.substr(1)} {data.year}
                </th>
                <td data-head="SSS Contribution">
                  <Input
                    placeholder="Amount"
                    onChange={(evt) => {
                      changeSSSAmountOfPeriod(data.month, data.year, evt.target.value);
                    }}
                  />
                </td>
                <td data-head="EC Contribution">
                  <Input
                    placeholder="Amount"
                    value={data.amount}
                    onChange={(evt) => {
                      changeECAmountOfPeriod(data.month, data.year, evt.target.value);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </HorizontalTable>
        <div className={styles.buttons}>
          <Button className="bg-slate-5 text-slate" onClick={handleBackClick}>
            &#171; Restart
          </Button>
          <Button className="bg-green text-slate" onClick={submitContribution}>
            Finalize and Submit
          </Button>
        </div>
      </Content>
    </DashboardContent>
  );
}

function NoSelectedPeriodIndicator() {
  const { goToPrevStage } = useContext(ContributionContext);

  return (
    <Fragment>
      <NoResultIndicator text="Please select a period first." />
      <div>
        <Button className="bg-slate-5 text-slate" onClick={goToPrevStage}>
          &#171; Back
        </Button>
      </div>
    </Fragment>
  );
}
