import Button, { LinkButton } from "@/app/components/Buttons/Buttons";
import { Input } from "@/app/components/FormFields/FormFields";
import sharedStyles from "../shared.module.scss";
import styles from "./page.module.scss";

export default function MemberLogin() {
  return (
    <section id={sharedStyles.login} className={styles.memberLogin}>
      <div className={sharedStyles.container}>
        <div className={sharedStyles.wrapper}>
          <form className={sharedStyles.loginBox}>
            <h1>Login</h1>
            <Input placeholder="SSS Number" required />
            <Input placeholder="Email Address" required />
            <Input placeholder="Pasword" required />
            <Button className="bg-primary text-slate">Login as Individual Member</Button>
            <LinkButton href="/register" className="bg-slate-2 text-slate-7">
              Don't have an account? Register here.
            </LinkButton>
          </form>
        </div>
      </div>
    </section>
  );
}
