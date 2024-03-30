import React from 'react'

const date = new Date();
const Footer = () => {
  return (
    <footer className='flex mt-auto items-center justify-center cursor-text'>
      <p className='mx-10 my-5 text-slate-950 dark:text-slate-50 text-center text-sm sm:text-base'>Copyright &copy; {date.getFullYear()} Muzic. All rights reserved. Made by @abhishek.</p>
    </footer>
  )
}

export default Footer