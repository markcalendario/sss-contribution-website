"use client";

import moment from "moment/moment";
import { useEffect, useState } from "react";
import styles from "./DateAndTimeCard.module.scss";

export default function DateAndTimeCard(props) {
  const { id, className } = props;
  const [dayName, setDayName] = useState(null);
  const [time, setTime] = useState("Syncing...");
  const [date, setDate] = useState(null);

  const initializeDayName = () => {
    setDayName(moment().format("dddd"));
  };

  const intializeDate = () => {
    setDate(moment().format("LL"));
  };

  const updateTime = () => {
    setTime(moment().format("LTS"));
  };

  useEffect(() => {
    updateTime();
    setInterval(() => {
      updateTime();
    }, 1000);
  }, []);

  useEffect(() => {
    initializeDayName();
    intializeDate();
  }, []);

  return (
    <div id={id} className={styles.dateTimeCard + (className ? " " + className : "")}>
      <div className={styles.wrapper}>
        <p>{dayName}</p>
        <h1>{time}</h1>
        <p>{date}</p>
      </div>
    </div>
  );
}
