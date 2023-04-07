import React from "react";

function header(){
    return(
        <header>
            <div class="logo">
                <img src="/images/dog_freinds_logo.png" alt="logo"/>
            </div>
            <h1>머리~</h1>
            <nav>
            <ul>
                <li><a href="#!">Link 1</a></li>
                <li><a href="#!">Link 2</a></li>
                <li><a href="#!">Link 3</a></li>
            </ul>
            </nav>
        </header>
    );
}

export default header;