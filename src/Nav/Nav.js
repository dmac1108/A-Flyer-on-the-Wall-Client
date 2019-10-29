import React from 'react'
import {Link} from 'react-router-dom'
import './Nav.css'

function Nav(){
    return(
        <nav>
            <Link to='/'><h1>A Flyer on the Wall</h1></Link>
             <ul>
                <li><Link to='/sign-in'>Sign-In</Link></li>
                <li><Link to='/sign-up'>Sign-Up</Link></li>
            </ul>
        </nav>
    );


}

export default Nav