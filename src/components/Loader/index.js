import React from 'react'

const Loader = (props) => { 
    return (
        <div>
        {props.error ? (
            <h3>Oops! Something is wrong. We're checking, please come back later.</h3>
        ) : (
            <div className="loader-gif"> 
                <img src={require('../../images/loader.gif')} alt="loading..." />
            </div>
        )}
        </div>
    )
}

export default Loader