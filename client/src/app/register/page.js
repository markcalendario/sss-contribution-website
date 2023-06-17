"use client";

import styles from "./page.module.scss";
import SectionContent, {
  SectionTitle,
  SectionWrapper
} from "../../components/SectionContent/SectionContent";
import ImageCard from "../../components/ImageCard/ImageCard";

export default function ContributorTypeChooser() {
  function redirectToMemberRegistration() {
    window.location.href = "/register/member";
  }

  function redirectToEmployerRegistration() {
    window.location.href = "/register/employer";
  }

  return (
    <SectionContent id={styles.typeChooser}>
      <SectionTitle>
        <h1>Membership Type</h1>
        <p>Choose what type of contributor you are.</p>
      </SectionTitle>
      <SectionWrapper className={styles.wrapper}>
        <ImageCard
          className={styles.card}
          imageLink="/images/contributor-types/individual.webp"
          title="I'm an individual member."
          description="Self-employed, Voluntary, OFW, Non-working Spouse, Fisherman"
          onClick={redirectToMemberRegistration}
        />
        <ImageCard
          className={styles.card}
          imageLink="/images/contributor-types/employer.webp"
          title="I'm an employer."
          description="An employer for business or household."
          onClick={redirectToEmployerRegistration}
        />
      </SectionWrapper>
    </SectionContent>
  );
}
