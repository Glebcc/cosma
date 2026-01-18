import styles from './Widget.module.css';

type WidgetProps = {
  title: string;
  children: React.ReactNode;
};

const Widget = ({ title, children }: WidgetProps) => {
  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Widget;
