import React from 'react';
import Menu from 'src/components/common/Menu';

const Page = (props) => {
  return (
    <React.Fragment>
      <Menu />
      {props.children}
    </React.Fragment>
  );
};

export default Page;
