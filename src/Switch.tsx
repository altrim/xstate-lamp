import React from "react";
import styles from "./Switch.module.css";

type Props = {
  onClick: (...args: any) => any;
};
export const Switch: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
