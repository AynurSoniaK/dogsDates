import React from 'react'

export const Navbar = ( { logged, setShowModal, showModal, setSignUp } ) => {

    const handleClick = () => {
        setShowModal(true)
        setSignUp(false)
    }


    return (
        <nav>
            <div className='logoContainer'>
            <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 208C288 216.8 280.8 224 272 224C263.2 224 255.1 216.8 255.1 208C255.1 199.2 263.2 192 272 192C280.8 192 288 199.2 288 208zM256.3-.0068C261.9-.0507 267.3 1.386 272.1 4.066L476.5 90.53C487.7 95.27 495.2 105.1 495.9 118.1C501.6 213.6 466.7 421.9 272.5 507.7C267.6 510.5 261.1 512.1 256.3 512C250.5 512.1 244.9 510.5 239.1 507.7C45.8 421.9 10.95 213.6 16.57 118.1C17.28 105.1 24.83 95.27 36.04 90.53L240.4 4.066C245.2 1.386 250.7-.0507 256.3-.0068H256.3zM160.9 286.2L143.1 320L272 384V320H320C364.2 320 400 284.2 400 240V208C400 199.2 392.8 192 384 192H320L312.8 177.7C307.4 166.8 296.3 160 284.2 160H239.1V224C239.1 259.3 211.3 288 175.1 288C170.8 288 165.7 287.4 160.9 286.2H160.9zM143.1 176V224C143.1 241.7 158.3 256 175.1 256C193.7 256 207.1 241.7 207.1 224V160H159.1C151.2 160 143.1 167.2 143.1 176z"/></svg>
            </div>
            { !logged && <button disabled={showModal} className='navButton' onClick={handleClick}>Se connecter</button> }
        </nav>
    )
}
export default Navbar;
