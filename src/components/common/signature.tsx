import React, { ReactNode, useEffect, useState } from 'react';
import styles from './css/common.module.css';
import clsx from 'clsx';

interface SignatureProps {
  svg?: ReactNode;
  width?: number | string;
  // height?: number | string;
  className?: string;  // ✅ 增加 className
}

function Signature({ svg, width = 80, className }: SignatureProps) {
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  // const heightValue = typeof height === 'number' ? `${height}px` : height;
  const [defaultSvg, setDefaultSvg] = useState<string>('');

  useEffect(() => {
    // 异步加载默认SVG
    fetch('/Backlighting.svg')
      .then(response => response.text())
      .then(svgContent => {
        setDefaultSvg(svgContent);
      })
      .catch(error => {
        console.error('加载默认签名失败:', error);
      });
  }, []);

  return (
    <div
      className={clsx('transition-all', styles['animated-signature'], className)} // ✅ 合并外部className
      style={{ width: widthValue }}
    >
      {svg || (
        <div dangerouslySetInnerHTML={{ __html: defaultSvg }} />
      )}
    </div>
  );
}

export default React.memo(Signature);
