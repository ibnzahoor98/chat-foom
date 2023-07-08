import '../../App.css';
import logo from '../../assets/images/logo.png'; 

function AuthUpperSection(){

    return  (
        <>

                <img className="logo" src={logo} ></img>
                <h1 className="chat-foom">CHAT FOOM</h1>
                <p className="developed-by">by Saad Zahoor</p> 
        </> 
       

    )
}

export default AuthUpperSection;