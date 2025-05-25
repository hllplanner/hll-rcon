import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "100% API Coverage",
    description: (
      <>
        All RCONv1 and RCONv2 commands are implemented in an easy to use wrapper. No need to write your own RCON commands.
      </>
    )
  },
  {
    title: "Best of Both Worlds",
    description: (
      <>
        Not all commands in RCONv1 exist in RCONv2, and vice versa. RCONv2 uses a faster and safer protocol although lacks a fair bit of whats in RCONv1. hll-ircon Integrates both protocols into a single client so you dont have to.
      </>
    )
  },
  {
    title: "Dont Like Abstraction?",
    description: (
      <>
        Not all solutions are the same, this library offers a high-level manager based API, but also provides you with the low-level tools to write RCON commands yourself.
      </>
    )
  }
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
