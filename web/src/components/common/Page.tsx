import React from 'react';
import Menu from 'src/components/common/Menu';

const PageComponent = (props) => {
  return (
    <React.Fragment>
      <Menu />
      {props.children}
    </React.Fragment>
  );
};

export const Page = PageComponent;
