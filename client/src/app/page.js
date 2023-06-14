import styles from "./page.module.scss";
import { Fragment } from "react";
import Navbar from "./components/Navbar/Navbar";
import Button, { LinkButton } from "./components/Buttons/Buttons";
import SectionContent, {
  SectionTitle,
  SectionWrapper
} from "./components/SectionContent/SectionContent";
import ImageCard from "./components/ImageCard/ImageCard";

export const metadata = {
  title: "Welcome to Social Security System",
  description: "Web-based SSS Contribution Form"
};

export default function Home() {
  return (
    <Fragment>
      <Navbar />
      <Hero />
      <Stats />
      <InviteUsers />
      <Tagline />
    </Fragment>
  );
}

function Hero() {
  function redirectToMemberLogin(params) {
    window.location.href = "/login/member";
  }

  function redirectToEmployerLogin(params) {
    window.location.href = "/login/employer";
  }

  return (
    <section id={styles.hero}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.texts}>
            <h1 data-aos="fade-right">Building Stronger Future with SSS.</h1>
            <p data-aos="fade-left">
              Stay connected to the Social Security System, access the contribution form, and
              monitor your contributions effortlessly at your fingertips
            </p>
          </div>
          <div data-aos="fade" className={styles.buttons}>
            <Button onClick={redirectToMemberLogin} className="bg-primary text-slate">
              Member
            </Button>
            <Button onClick={redirectToEmployerLogin} className="bg-white text-primary">
              Employer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const SSSEstablishedDate = new Date("September 1, 1957");
  const SSSAge = new Date(Date.now() - SSSEstablishedDate).getUTCFullYear() - 1970;

  return (
    <section id={styles.statsBar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div data-aos="fade-up" data-aos-delay="200" className={styles.stats}>
            <h1>{SSSAge}</h1>
            <p>Years in Service</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100" className={styles.stats}>
            <h1>40.52 M</h1>
            <p>Filipinos Covered</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200" className={styles.stats}>
            <h1>20%</h1>
            <p>Members Increase Each Year</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InviteUsers() {
  return (
    <SectionContent id={styles.inviteUsers}>
      <SectionTitle>
        <h1>Join Our Community and Explore Social Security Benefits</h1>
        <p>
          Join us to experience the advantages of our social security system, providing
          comprehensive coverage, peace of mind for your loved ones, and an accessible user-friendly
          interface.
        </p>
      </SectionTitle>
      <SectionWrapper className={styles.wrapper}>
        <ImageCard
          className={styles.card}
          title="Comprehensive Coverage"
          description="Enjoy health care, unemployment benefits, disability support, and retirement pensions."
          imageLink="/images/image-card-images/senior-citizen.webp"
        />
        <ImageCard
          className={styles.card}
          title="Family Support and Security"
          description="Ensure financial stability for your family with survivor benefits."
          imageLink="/images/image-card-images/family.webp"
        />
        <ImageCard
          className={styles.card}
          title="Accessible and User-Friendly"
          description="Manage your benefits and contributions effortlessly with our online portal."
          imageLink="/images/image-card-images/business-people.webp"
        />
      </SectionWrapper>
    </SectionContent>
  );
}

function Tagline(props) {
  return (
    <section id={styles.tagline}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 data-aos="fade-up">Maaasahang Proteksyon Sa Panahon Ng Pangangailangan</h1>
        </div>
      </div>
    </section>
  );
}
