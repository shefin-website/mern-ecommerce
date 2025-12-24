/**
 *
 * Page404
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

const Page404 = () => {
  return (
    <div className='page-404'>
      <div className='mb-2'>The page you are looking for was not found.</div>
      <Link to='/'>
        <Button text='Back to Home' variant='primary' />
      </Link>
    </div>
  );
};

export default Page404;
