import clsx from 'clsx';
import { motion } from 'motion/react';

import { useTheme } from '@/features/theme';

import style from './LoginBg.module.scss';

const LoginBg = () => {
  const { darkMode } = useTheme();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={clsx(style['login-bg'], darkMode && style.dark)}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className={clsx(style.shape, style['shape-circle'], style['shape-tl'])} />
      <span className={clsx(style.shape, style['shape-ring'], style['shape-tc'])} />
      <span className={clsx(style.shape, style['shape-dot'], style['shape-ml'])} />
      <span className={clsx(style.shape, style['shape-square'], style['shape-bl'])} />
      <span className={clsx(style.shape, style['shape-dot'], style['shape-mr'])} />
      <span className={clsx(style.shape, style['shape-arc'], style['shape-tr'])} />
    </motion.div>
  );
};

export default LoginBg;
