import React from 'react'

function Navigation() {
  return (
    <div className='nav-container'>
        <div className='nav-logo'>
            <img src='/images/logo.png' alt='erick-kirui-logo' />
    
        </div>

        <div className='nav-menu'>
            <nav>
                <ul>
                    <li>About Me</li>
                    <li>Contacts</li>
                    <li>Projects</li>
                </ul>
            </nav>

        </div>

        <div className='nav-icons'>
            <img src='/images/GitHub.png' alt='erick-kirui-logo' />
            <img src='/images/Instagram.png' alt='erick-kirui-logo' />
            <img src='/images/LinkedIn.png' alt='erick-kirui-logo' />


        </div>
      
    </div>
  )
}

export default Navigation
